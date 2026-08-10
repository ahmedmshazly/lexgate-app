import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(import.meta.dirname, "../../..");
const evidenceRoot = join(repositoryRoot, "specs/004-gate-readiness/evidence");

const readEvidence = (name: string): Promise<string> =>
  readFile(join(evidenceRoot, name), "utf8");

describe("gate-readiness review packets", () => {
  it("requires a one-page sponsor summary that distinguishes authorized preparation from every blocked activation", async () => {
    const summary = await readEvidence("sponsor-approval-summary.md");

    expect(summary).toContain("Authorized now");
    expect(summary).toContain("Still blocked");
    expect(summary).toContain("G1");
    expect(summary).toContain("ODR-003");
    expect(summary).toContain("ODR-004");
    expect(summary).toContain("G2");
    expect(summary).toContain("does not pass a gate");
  });

  it("requires a security and engineering review packet with no self-approval path", async () => {
    const review = await readEvidence("g1-security-engineering-review.md");

    expect(review).toContain("Security lead");
    expect(review).toContain("Engineering lead");
    expect(review).toContain("No approval recorded");
    expect(review).toContain("MFA/provider");
    expect(review).toContain("SEC-MAT-001");
    expect(review).toContain(
      "No sponsor, template, test result, or tool output passes G1.",
    );
  });

  it("requires the ODR-003 processing and DPO review templates to separate purpose, notice, consent, and approval", async () => {
    const [processing, controls] = await Promise.all([
      readEvidence("odr-003-processing-review.md"),
      readEvidence("odr-003-dpo-and-controls-review.md"),
    ]);

    expect(processing).toContain("Per-workflow processing review");
    expect(processing).toContain("lawful basis");
    expect(processing).toContain("Privacy notice");
    expect(processing).toContain("Consent");
    expect(processing).toContain("Synthetic example only");
    expect(controls).toContain("DPO determination");
    expect(controls).toContain("sensitive-data intake guardrail");
    expect(controls).toContain("processor and transfer review");
    expect(controls).toContain("rights, retention, hold, and breach readiness");
    expect(controls).toContain("No approval recorded");
  });

  it("requires a complete ODR-004 operating packet and nine non-automated G2 lawyer scenarios", async () => {
    const [operatingProfile, migration, scenarios] = await Promise.all([
      readEvidence("odr-004-pilot-operating-profile.md"),
      readEvidence("odr-004-migration-decision-pack.md"),
      readEvidence("g2-lawyer-scenario-pack.md"),
    ]);

    expect(operatingProfile).toContain("Pilot Operating Profile");
    expect(operatingProfile).toContain("authoritative-system matrix");
    expect(operatingProfile).toContain("Greenfield/no-migration declaration");
    expect(operatingProfile).toContain("Arabic/RTL/accessibility");
    expect(migration).toContain("Migration Decision Pack");
    expect(migration).toContain("No source extract or import is authorized");
    expect(migration).toContain("reconciliation");
    expect(scenarios).toContain("G2-01");
    expect(scenarios).toContain("G2-09");
    expect(scenarios).toContain("Prohibited automatic outcome");
    expect(scenarios).toContain("No approval recorded");
    expect(scenarios).toContain(
      "does not create an engagement, matter, authority, or clearance",
    );
  });
});
