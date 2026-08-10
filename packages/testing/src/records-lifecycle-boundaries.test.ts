import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));

const readRepositoryFile = async (path: string): Promise<string> =>
  readFile(`${repositoryRoot}${path}`, "utf8");

const migrationFiles = async (): Promise<string[]> =>
  (await readdir(`${repositoryRoot}packages/database/drizzle`)).filter((name) =>
    name.endsWith(".sql"),
  );

describe("records lifecycle destroys nothing (SC-006)", () => {
  it("keeps every append-only guard that was ever installed", async () => {
    // The guards are the reason destruction is impossible. A migration that
    // drops one would silently remove the property this whole feature is
    // built on top of.
    for (const file of await migrationFiles()) {
      const sql = await readRepositoryFile(`packages/database/drizzle/${file}`);

      expect(sql, `${file} drops an append-only trigger`).not.toMatch(
        /DROP\s+TRIGGER/i,
      );
      expect(sql, `${file} drops a table`).not.toMatch(/DROP\s+TABLE/i);
    }
  });

  it("issues no DELETE against a ledger or a party record", async () => {
    const sources = [
      "packages/database/src/records-lifecycle.ts",
      "packages/database/src/party-identity.ts",
      "packages/database/src/access-lifecycle.ts",
    ];

    for (const source of sources) {
      const contents = await readRepositoryFile(source);
      const deletes = contents.match(/\.delete\((\w+)\)/g) ?? [];

      for (const call of deletes) {
        // The projection rebuild is the sole permitted deletion: projections
        // are derived data, rebuilt from the ledger that remains untouched.
        expect(
          call,
          `${source} deletes something other than a rebuildable projection`,
        ).toMatch(/effective/i);
      }
    }
  });

  it("offers no code path that destroys a record", async () => {
    const domain = await readRepositoryFile(
      "packages/domain/src/records-lifecycle.ts",
    );

    // evaluateRecordDestruction must have no successful branch. Bound the
    // slice to that function alone — evaluateSubjectErasure follows it and
    // legitimately permits, so slicing to end-of-file would sweep it in.
    const start = domain.indexOf("export const evaluateRecordDestruction");
    const next = domain.indexOf("export const", start + 1);
    const destructionSection = domain.slice(
      start,
      next === -1 ? undefined : next,
    );
    expect(start).toBeGreaterThan(-1);
    expect(destructionSection).not.toMatch(/outcome:\s*"(permitted|allowed)"/);
    expect(domain).toContain('outcome: "refused"');
  });

  it("activates no retention schedule and no automatic expiry", async () => {
    const sources = [
      "packages/domain/src/records-lifecycle.ts",
      "packages/database/src/records-lifecycle.ts",
      "packages/application/src/records-lifecycle.ts",
    ];

    for (const source of sources) {
      const contents = await readRepositoryFile(source);

      // Nothing may change state through the passage of time. Every erasure
      // is an explicit, attributable command.
      expect(contents, `${source} schedules work`).not.toMatch(
        /setInterval|setTimeout|cron|node-schedule/i,
      );
    }
  });

  it("keeps G6 shut in the destruction evaluator's own defaults", async () => {
    const application = await readRepositoryFile(
      "packages/application/src/records-lifecycle.ts",
    );

    expect(application).toContain("recordsGateOpen: false");
    expect(application).toContain("hasApprovedRetentionSchedule: false");
  });

  it("records no gate as passed", async () => {
    const register = await readRepositoryFile(
      "specs/004-gate-readiness/evidence/gate-decision-register.md",
    );

    // Four gates, four unapproved entries. This feature closes none of them.
    const unapproved = register.match(/No approval recorded/g) ?? [];
    expect(unapproved.length).toBeGreaterThanOrEqual(4);
  });
});
