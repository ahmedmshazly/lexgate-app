import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(import.meta.dirname, "../../..");
const decisionRegisterPath = join(
  repositoryRoot,
  "specs/004-gate-readiness/evidence/gate-decision-register.md",
);

describe("gate-readiness boundaries", () => {
  it("requires every gate decision to remain explicitly blocked until its accountable reviewer records approval", async () => {
    const register = await readFile(decisionRegisterPath, "utf8");

    for (const gate of ["G1", "ODR-003", "ODR-004", "G2"]) {
      expect(register).toMatch(
        new RegExp(`\\|\\s*${gate}\\s*\\|\\s*Blocked\\s*\\|`),
      );
    }

    expect(register).toContain(
      "No sponsor, template, test result, or tool output passes a gate.",
    );
  });

  it("keeps identity work provider-neutral and blocks a provider, login, or break-glass activation path", async () => {
    const authSource = await readFile(
      join(repositoryRoot, "packages/auth/src/index.ts"),
      "utf8",
    );

    expect(authSource).toContain("createSessionInvalidationIntentPort");
    expect(authSource).toContain("never invokes an\n * identity provider");
    expect(authSource).not.toMatch(/auth0|clerk|keycloak|cognito/i);
  });

  it("keeps privacy and legal-operations packets synthetic-only and non-activating", async () => {
    const packets = await Promise.all(
      [
        "odr-003-processing-review.md",
        "odr-003-dpo-and-controls-review.md",
        "odr-004-pilot-operating-profile.md",
        "odr-004-migration-decision-pack.md",
        "g2-lawyer-scenario-pack.md",
      ].map((name) =>
        readFile(
          join(repositoryRoot, "specs/004-gate-readiness/evidence", name),
          "utf8",
        ),
      ),
    );

    for (const packet of packets) {
      expect(packet).toContain("synthetic");
      expect(packet).toContain("No approval recorded");
    }
    expect(packets.join("\n")).toContain(
      "No source extract or import is authorized",
    );
    expect(packets.join("\n")).toContain("No real personal data");
    expect(packets.join("\n")).toContain("No automatic conflict clearance");
  });
});
