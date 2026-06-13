import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as RS from "@/lib/surfaces/runtime-surfaces";

const APP = join(process.cwd(), "src", "app");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) return walk(p);
    return entry === "page.tsx" ? [p] : [];
  });
}

const scaffoldPages = walk(APP).filter((f) => {
  const src = readFileSync(f, "utf8");
  return src.includes("SurfaceScaffold") && src.includes("runtime-surfaces");
});

const mod = RS as Record<string, unknown>;

describe("dedicated surface pages wiring", () => {
  it("there is a large set of scaffold-backed surface pages", () => {
    expect(scaffoldPages.length).toBeGreaterThanOrEqual(60);
  });

  it.each(scaffoldPages.map((p) => [p.replace(`${APP}/`, ""), p]))(
    "%s imports and invokes an existing builder",
    (_label, file) => {
      const src = readFileSync(file, "utf8");
      const m = src.match(/import\s*\{([^}]+)\}\s*from\s*["']@\/lib\/surfaces\/runtime-surfaces["']/);
      expect(m, `no runtime-surfaces import in ${file}`).toBeTruthy();
      const names = m![1].split(",").map((s) => s.trim()).filter(Boolean);
      const builderName = names.find((n) => n.startsWith("build"));
      expect(builderName, `no builder imported in ${file}`).toBeTruthy();
      expect(typeof mod[builderName!], `${builderName} is not an exported function`).toBe("function");
      expect(src).toContain(`${builderName!}()`);
    }
  );
});
