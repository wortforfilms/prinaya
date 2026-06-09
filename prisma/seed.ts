import { PrismaClient } from "@prisma/client";
import {
  budgetItems,
  cadObjects,
  decorItems,
  exportJobs,
  floralPalette,
  guestSections,
  layers,
  lightingFixtures,
  mandapDimensions,
  materialPalette,
  observatoryEvents,
  projectSummary,
  seatingCapacity,
  stageDimensions,
  venueDimensions,
  vendors
} from "../src/lib/data-frames";
import { blockedCapabilities, releaseStatus } from "../src/lib/status";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.organization.findUnique({ where: { slug: "tlp-demo" } });
  if (existing) {
    await prisma.organization.delete({ where: { id: existing.id } });
  }

  const organization = await prisma.organization.create({
    data: {
      name: "TLP Wedding CAD Demo Organization",
      slug: "tlp-demo"
    }
  });

  const user = await prisma.user.create({
    data: {
      organizationId: organization.id,
      email: "demo@tlp-wedding-cad.local",
      name: "Demo Studio Admin"
    }
  });

  const permissions = await Promise.all(
    ["routes.read", "cad.edit", "schema.verify", "evidence.read", "admin.preview"].map((key) => {
      const data = {
        key,
        label: key
          .split(".")
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(" ")
      };

      return prisma.permission.upsert({
        where: { key },
        update: data,
        create: data
      });
    })
  );

  const role = await prisma.role.create({
    data: {
      organizationId: organization.id,
      name: "Preview Admin",
      description: "Can inspect all controlled-preview surfaces."
    }
  });

  await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({ roleId: role.id, permissionId: permission.id }))
  });

  const materialRecords = await Promise.all(
    materialPalette.map((material) =>
      prisma.material.create({
        data: {
          id: material.id,
          organizationId: organization.id,
          name: material.label,
          finish: material.finish,
          color: material.color,
          usage: material.usage
        }
      })
    )
  );

  const project = await prisma.project.create({
    data: {
      organizationId: organization.id,
      ownerId: user.id,
      name: projectSummary.name,
      clientName: projectSummary.client,
      eventDate: new Date(projectSummary.eventDate),
      status: releaseStatus.verdict,
      productionReady: releaseStatus.productionReady,
      venue: {
        create: {
          name: projectSummary.venueName,
          lengthM: venueDimensions.lengthM,
          widthM: venueDimensions.widthM,
          clearHeightM: venueDimensions.clearHeightM,
          entries: venueDimensions.entries,
          emergencyExits: venueDimensions.emergencyExits,
          parkingBlocks: venueDimensions.parkingBlocks,
          metadata: venueDimensions
        }
      },
      layout: {
        create: {
          name: "Lotus Palace Guest Flow",
          planJson: { stageDimensions, seatingCapacity, zones: guestSections },
          capacity: seatingCapacity.totalGuests,
          status: "READY"
        }
      },
      mandaps: {
        create: {
          name: "Vedic Lotus Mandap",
          footprint: mandapDimensions.footprintM,
          pillarCount: mandapDimensions.pillarCount,
          canopyHeightM: mandapDimensions.canopyHeightM,
          saptapadiDiameterM: mandapDimensions.saptapadiDiameterM,
          materials: materialRecords.map((material) => material.id)
        }
      },
      floralDesigns: {
        create: {
          name: "Lotus Marigold Canopy",
          palette: floralPalette,
          garlandMeters: floralPalette.garlandMeters,
          decorItems,
          status: "READY"
        }
      },
      seatingPlans: {
        create: {
          name: "Ceremony and Dining Seating",
          totalSeats: seatingCapacity.totalGuests,
          sections: guestSections,
          status: "READY"
        }
      },
      budget: {
        create: {
          currency: "INR",
          estimate: budgetItems.reduce((sum, item) => sum + item.estimatedInr, 0),
          status: "READY",
          items: {
            create: budgetItems.map((item) => ({
              label: item.label,
              category: item.category,
              estimated: item.estimatedInr,
              actual: null,
              status: item.status
            }))
          }
        }
      },
      exports: {
        create: exportJobs.map((job) => ({
          label: job.label,
          format: job.format,
          status: job.status,
          evidence: job.evidence
        }))
      },
      walkthroughs: {
        create: {
          name: "Preview Walkthrough Path",
          status: "PARTIAL",
          path: [
            [0, 2, 34],
            [0, 2, 10],
            [0, 2, 0],
            [0, 2, -24]
          ]
        }
      },
      aiGenerations: {
        create: {
          prompt: "Generate a Vedic lotus mandap with sci-fi night lighting accents.",
          model: "blocked-preview",
          status: "PARTIAL",
          output: { note: "No live AI runtime connected in this scaffold." }
        }
      },
      releaseGates: {
        create: {
          organizationId: organization.id,
          verdict: releaseStatus.verdict,
          productionReady: releaseStatus.productionReady,
          blockers: blockedCapabilities,
          evidenceSummary: {
            routes: "release/evidence/routes.json",
            schema: "release/evidence/schema.json",
            cad: "release/evidence/cad-runtime.json",
            blockers: "release/evidence/blockers.json"
          }
        }
      }
    }
  });

  const scene = await prisma.scene.create({
    data: {
      projectId: project.id,
      name: "Demo Wedding CAD Scene",
      status: "READY",
      worldUnits: "meters",
      metadata: { source: "seed", designLanguage: projectSummary.designLanguage }
    }
  });

  const layerIdMap = new Map<string, string>();
  for (const layer of layers) {
    const record = await prisma.layer.create({
      data: {
        sceneId: scene.id,
        name: layer.label,
        visible: layer.visible,
        locked: layer.locked,
        color: layer.color,
        sortOrder: layers.indexOf(layer)
      }
    });
    layerIdMap.set(layer.id, record.id);
  }

  await prisma.cADObject.createMany({
    data: cadObjects.map((object) => ({
      sceneId: scene.id,
      layerId: layerIdMap.get(object.layerId) ?? Array.from(layerIdMap.values())[0],
      materialId: object.materialId,
      kind: object.kind,
      label: object.label,
      position: object.position,
      rotation: object.rotation,
      scale: object.scale
    }))
  });

  await prisma.camera.createMany({
    data: [
      {
        projectId: project.id,
        sceneId: scene.id,
        name: "Perspective Preview",
        mode: "perspective",
        position: [28, 22, 28],
        target: [0, 0, 0]
      },
      {
        projectId: project.id,
        sceneId: scene.id,
        name: "Top Plan",
        mode: "top",
        position: [0, 60, 0],
        target: [0, 0, 0]
      }
    ]
  });

  const camera = await prisma.camera.findFirstOrThrow({ where: { projectId: project.id, mode: "perspective" } });
  await prisma.renderJob.createMany({
    data: [
      {
        projectId: project.id,
        cameraId: camera.id,
        label: "Day concept preview",
        status: "READY",
        outputPath: "in-app 3D canvas"
      },
      {
        projectId: project.id,
        cameraId: camera.id,
        label: "Night lighting preview",
        status: "PARTIAL",
        outputPath: "preview only"
      }
    ]
  });

  const lightingPlan = await prisma.lightingPlan.create({
    data: {
      projectId: project.id,
      name: "Sci-Fi Vedic Night Lighting",
      status: "READY",
      nightMode: true,
      metadata: { blockedCompliance: true }
    }
  });

  await prisma.fixture.createMany({
    data: lightingFixtures.map((fixture) => ({
      lightingPlanId: lightingPlan.id,
      label: fixture.label,
      type: fixture.type,
      count: fixture.count,
      colorTemperatureK: fixture.colorTemperatureK,
      position: { layerId: fixture.layerId }
    }))
  });

  const seatingPlan = await prisma.seatingPlan.findFirstOrThrow({ where: { projectId: project.id } });
  await prisma.guest.createMany({
    data: guestSections.flatMap((section) =>
      Array.from({ length: Math.min(6, section.assigned) }).map((_, index) => ({
        projectId: project.id,
        seatingPlanId: seatingPlan.id,
        name: `${section.label} Guest ${index + 1}`,
        groupName: section.label,
        section: section.id,
        status: "invited"
      }))
    )
  });

  await prisma.vendor.createMany({
    data: vendors.map((vendor) => ({
      organizationId: organization.id,
      projectId: project.id,
      name: vendor.label,
      category: vendor.category,
      city: vendor.city,
      status: vendor.status,
      notes: vendor.status === "blocked-live" ? "Live vendor marketplace remains blocked." : "Demo vendor only."
    }))
  });

  await prisma.asset.createMany({
    data: cadObjects.map((object) => ({
      organizationId: organization.id,
      materialId: object.materialId,
      category: object.layerId,
      kind: object.kind,
      label: object.label,
      geometry: { scale: object.scale, primitive: object.kind },
      status: "READY"
    }))
  });

  await prisma.marketplaceItem.create({
    data: {
      organizationId: organization.id,
      title: "Live marketplace checkout",
      category: "commerce",
      status: "BLOCKED",
      priceEstimate: null
    }
  });

  await prisma.observatoryEvent.createMany({
    data: observatoryEvents.map((event) => ({
      organizationId: organization.id,
      projectId: project.id,
      category: event.category,
      label: event.label,
      status: event.status,
      metadata: { at: event.at }
    }))
  });

  const releaseGate = await prisma.releaseGate.findFirstOrThrow({ where: { projectId: project.id } });
  await prisma.evidence.createMany({
    data: [
      {
        organizationId: organization.id,
        projectId: project.id,
        releaseGateId: releaseGate.id,
        kind: "routes",
        path: "release/evidence/routes.json",
        status: "READY",
        summary: "Route matrix generated with explicit statuses."
      },
      {
        organizationId: organization.id,
        projectId: project.id,
        releaseGateId: releaseGate.id,
        kind: "blockers",
        path: "release/evidence/blockers.json",
        status: "BLOCKED",
        summary: "Production-only capabilities remain blocked."
      }
    ]
  });

  console.log(`Seeded ${organization.name} with project ${project.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
