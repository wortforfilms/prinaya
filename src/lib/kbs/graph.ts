/**
 * KBS v1.0 — Knowledge Base System core graph.
 *
 * A first-class runtime knowledge graph (not a flat asset catalog). Every domain
 * entity — assets, routes, use cases, screens, templates, boards, rituals, films,
 * vedis, vendors, materials — is a typed `KbsNode`, and typed `KbsRelation` edges
 * connect them. The graph is assembled at runtime in `registry.ts`.
 *
 * Node id scheme: `<type>:<slug>` (e.g. `asset:mandaps-vedic-lotus-001`,
 * `route:/mandap`, `ritual:saptapadi`). Ids are globally unique across types.
 */

export type KbsStatus = "READY" | "PARTIAL" | "BLOCKED";

export type KbsEntityType =
  | "Asset"
  | "Template"
  | "Board"
  | "UseCase"
  | "Workflow"
  | "Screen"
  | "Route"
  | "Vendor"
  | "Guest"
  | "Film"
  | "Shot"
  | "Drone"
  | "Venue"
  | "Mandap"
  | "Vedi"
  | "Stage"
  | "Floral"
  | "Lighting"
  | "Ritual"
  | "Nakshatra"
  | "Tithi"
  | "Muhurat"
  | "Cost"
  | "Material"
  | "Evidence";

export type KbsRelationKind =
  | "uses" // a composite uses a component (template uses asset)
  | "references" // a use case references an asset/screen
  | "partOf" // a screen is part of a use case
  | "rendersTo" // a scene renders to a board
  | "recommends" // AI / heuristic recommendation
  | "requires" // a ritual requires a vedi/agni
  | "documents" // evidence documents a node
  | "derivedFrom" // node derived from a source node
  | "linkedTo"; // generic association (route <-> screen)

export type KbsRelation = {
  kind: KbsRelationKind;
  to: string;
  weight?: number;
};

export type KbsNode = {
  id: string;
  type: KbsEntityType;
  category: string;
  name: string;
  description: string;
  status: KbsStatus;
  metadata: Record<string, unknown>;
  relations: KbsRelation[];
  evidence: string[];
  createdAt: string;
  updatedAt: string;
};

export type KbsInboundEdge = { from: string; kind: KbsRelationKind; weight?: number };

export type KbsGraphStats = {
  nodeCount: number;
  relationCount: number;
  byType: Record<string, number>;
  byStatus: Record<KbsStatus, number>;
  danglingRelations: number;
};

export type KbsValidationIssue = {
  level: "error" | "warning";
  nodeId: string;
  message: string;
};

const ISO_EPOCH = "2026-06-11T00:00:00.000Z";

/** Fill optional fields so external/curated JSON can be partial. */
export function normalizeNode(
  input: Partial<KbsNode> & Pick<KbsNode, "id" | "type" | "name">,
  evidencePath?: string
): KbsNode {
  return {
    id: input.id,
    type: input.type,
    category: input.category ?? input.type,
    name: input.name,
    description: input.description ?? "",
    status: input.status ?? "READY",
    metadata: input.metadata ?? {},
    relations: input.relations ?? [],
    evidence: input.evidence ?? (evidencePath ? [evidencePath] : []),
    createdAt: input.createdAt ?? ISO_EPOCH,
    updatedAt: input.updatedAt ?? ISO_EPOCH
  };
}

export class KnowledgeGraph {
  private byId = new Map<string, KbsNode>();
  private byType = new Map<KbsEntityType, KbsNode[]>();
  private inbound = new Map<string, KbsInboundEdge[]>();

  constructor(nodes: KbsNode[] = []) {
    nodes.forEach((node) => this.addNode(node));
  }

  addNode(node: KbsNode): void {
    if (this.byId.has(node.id)) {
      throw new Error(`KBS: duplicate node id "${node.id}"`);
    }
    this.byId.set(node.id, node);
    const list = this.byType.get(node.type) ?? [];
    list.push(node);
    this.byType.set(node.type, list);
    node.relations.forEach((relation) => this.indexInbound(node.id, relation));
  }

  addRelation(fromId: string, relation: KbsRelation): void {
    const node = this.byId.get(fromId);
    if (!node) throw new Error(`KBS: cannot add relation from unknown node "${fromId}"`);
    node.relations.push(relation);
    this.indexInbound(fromId, relation);
  }

  private indexInbound(fromId: string, relation: KbsRelation): void {
    const edges = this.inbound.get(relation.to) ?? [];
    edges.push({ from: fromId, kind: relation.kind, weight: relation.weight });
    this.inbound.set(relation.to, edges);
  }

  has(id: string): boolean {
    return this.byId.has(id);
  }

  getNode(id: string): KbsNode | undefined {
    return this.byId.get(id);
  }

  get nodes(): KbsNode[] {
    return Array.from(this.byId.values());
  }

  nodesOfType(type: KbsEntityType): KbsNode[] {
    return this.byType.get(type) ?? [];
  }

  /** Outbound neighbours, optionally filtered by relation kind. */
  neighbors(id: string, kind?: KbsRelationKind): KbsNode[] {
    const node = this.byId.get(id);
    if (!node) return [];
    return node.relations
      .filter((relation) => (kind ? relation.kind === kind : true))
      .map((relation) => this.byId.get(relation.to))
      .filter((target): target is KbsNode => Boolean(target));
  }

  /** Nodes that point at `id` (reverse edges). */
  inboundNodes(id: string, kind?: KbsRelationKind): KbsNode[] {
    const edges = this.inbound.get(id) ?? [];
    return edges
      .filter((edge) => (kind ? edge.kind === kind : true))
      .map((edge) => this.byId.get(edge.from))
      .filter((node): node is KbsNode => Boolean(node));
  }

  /** Breadth-first traversal from a node up to `depth` hops. */
  traverse(id: string, depth = 1): KbsNode[] {
    const seen = new Set<string>([id]);
    let frontier = [id];
    const result: KbsNode[] = [];
    for (let hop = 0; hop < depth; hop += 1) {
      const next: string[] = [];
      for (const current of frontier) {
        for (const neighbor of this.neighbors(current)) {
          if (!seen.has(neighbor.id)) {
            seen.add(neighbor.id);
            result.push(neighbor);
            next.push(neighbor.id);
          }
        }
      }
      frontier = next;
    }
    return result;
  }

  stats(): KbsGraphStats {
    const byType: Record<string, number> = {};
    const byStatus: Record<KbsStatus, number> = { READY: 0, PARTIAL: 0, BLOCKED: 0 };
    let relationCount = 0;
    let danglingRelations = 0;
    for (const node of this.byId.values()) {
      byType[node.type] = (byType[node.type] ?? 0) + 1;
      byStatus[node.status] += 1;
      for (const relation of node.relations) {
        relationCount += 1;
        if (!this.byId.has(relation.to)) danglingRelations += 1;
      }
    }
    return { nodeCount: this.byId.size, relationCount, byType, byStatus, danglingRelations };
  }

  /** Relation integrity + required-field checks. Dangling edges are warnings. */
  validate(): KbsValidationIssue[] {
    const issues: KbsValidationIssue[] = [];
    for (const node of this.byId.values()) {
      if (!node.id || !node.name) {
        issues.push({ level: "error", nodeId: node.id, message: "missing id or name" });
      }
      for (const relation of node.relations) {
        if (!this.byId.has(relation.to)) {
          issues.push({
            level: "warning",
            nodeId: node.id,
            message: `dangling ${relation.kind} relation -> ${relation.to}`
          });
        }
      }
    }
    return issues;
  }

  toJSON(): KbsNode[] {
    return this.nodes;
  }
}
