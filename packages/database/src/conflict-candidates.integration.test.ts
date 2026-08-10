import type { CreateNeutralPartyInput } from "@lexgate/domain";
import { createNeutralPartyMutation } from "@lexgate/domain";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, describe, expect, it } from "vitest";
import { createConflictCandidatePort } from "./conflict-candidates.js";
import { createPartyIdentityPersistencePort } from "./party-identity.js";
import { createRecordsLifecyclePersistencePort } from "./records-lifecycle.js";
import { auditEvents } from "./schema.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for LEG-CFL-004 integration tests. Start local PostgreSQL before running them.",
  );
}

const client = postgres(databaseUrl, { max: 2 });
const database = drizzle({ client });
const parties = createPartyIdentityPersistencePort(database);
const records = createRecordsLifecyclePersistencePort(database);
const candidates = createConflictCandidatePort(database);
const occurredAt = new Date("2026-08-10T12:00:00.000Z");

const syntheticPrivacy = {
  processingPurpose: "party_identity_foundation",
  dataClassification: "internal",
  subjectCategory: "synthetic_individual",
  source: "synthetic-fixture",
  retentionCandidate: "synthetic_development_only",
  accessBoundary: "internal_authorized_only",
  validationRequirement: "privacy_and_g2_required",
} as const;

const partyCommand = (input: {
  partyId: string;
  name: string;
}): CreateNeutralPartyInput => {
  const nameId = crypto.randomUUID();
  return {
    commandId: crypto.randomUUID(),
    correlationId: `synthetic-conflict-${crypto.randomUUID()}`,
    partyId: input.partyId,
    kind: "person",
    partyPrivacy: syntheticPrivacy,
    primaryName: {
      id: nameId,
      value: input.name,
      formType: "legal",
      languageTag: "ar",
      script: "Arabic",
      reviewState: "unreviewed",
      privacy: syntheticPrivacy,
    },
    primaryNameAssignment: { id: crypto.randomUUID(), nameFormId: nameId },
    occurredAt,
  };
};

const seed = async (organizationId: string, name: string) => {
  const partyId = crypto.randomUUID();
  const command = partyCommand({ partyId, name });
  await parties.createParty({
    actor: { accountId: `synthetic-operator-${partyId}`, organizationId },
    command,
    mutation: createNeutralPartyMutation(command),
    commandFingerprint: `fingerprint-${command.commandId}`,
  });
  return partyId;
};

const actor = {
  accountId: "synthetic-conflict-reviewer",
  correlationId: "synthetic-conflict-correlation",
};

describe("PostgreSQL conflict candidates over encrypted names", () => {
  afterAll(async () => {
    await client.end({ timeout: 5 });
  });

  it("finds a candidate across encrypted values and spelling variation", async () => {
    const organizationId = `synthetic-conflict-org-${crypto.randomUUID()}`;
    const knownId = await seed(organizationId, "أحمد محمد الشريف");
    await seed(organizationId, "سعيد إبراهيم حسن");

    // Values are stored encrypted, so this only works because matching
    // decrypts in memory — SQL cannot compare ciphertext.
    const found = await candidates.findCandidates({
      organizationId,
      subjectName: "احمد محمد شريف",
      actor,
    });

    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({
      partyId: knownId,
      tier: "strong",
      clearsConflict: false,
    });
    expect(found[0]?.rationale).toContain("Every compared part matches");
  });

  it("does not match an erased subject, because their names cannot be read", async () => {
    const organizationId = `synthetic-conflict-org-${crypto.randomUUID()}`;
    const erasedId = await seed(organizationId, "مريم سالم");

    await expect(
      candidates.findCandidates({
        organizationId,
        subjectName: "Mariam Salem",
        actor,
      }),
    ).resolves.toHaveLength(1);

    await expect(
      records.eraseSubject({
        subjectId: erasedId,
        organizationId,
        actor: {
          accountId: "synthetic-privacy-officer",
          reasonCode: "synthetic_erasure_request",
        },
      }),
    ).resolves.toEqual({ outcome: "erased" });

    // Erasure means erasure. The subject is genuinely gone from matching —
    // correct, and a real tension with conflict checking that a reviewer
    // should see stated rather than discover.
    await expect(
      candidates.findCandidates({
        organizationId,
        subjectName: "Mariam Salem",
        actor,
      }),
    ).resolves.toEqual([]);
  });

  it("records a search that found nothing, so silence is not clearance", async () => {
    const organizationId = `synthetic-conflict-org-${crypto.randomUUID()}`;
    await seed(organizationId, "سعيد إبراهيم");

    await expect(
      candidates.findCandidates({
        organizationId,
        subjectName: "خالد عمر",
        actor,
      }),
    ).resolves.toEqual([]);

    const [attempt] = await database
      .select()
      .from(auditEvents)
      .where(
        and(
          eq(auditEvents.action, "conflict_candidates.searched.none"),
          eq(auditEvents.resourceId, organizationId),
        ),
      );

    expect(attempt).toMatchObject({
      actorAccountId: "synthetic-conflict-reviewer",
      resourceType: "organization",
    });
  });

  it("ranks a strong candidate above a coincidental one", async () => {
    const organizationId = `synthetic-conflict-org-${crypto.randomUUID()}`;
    const strongId = await seed(organizationId, "احمد محمد شريف");
    const weakId = await seed(organizationId, "يوسف الشريف");

    const found = await candidates.findCandidates({
      organizationId,
      subjectName: "أحمد محمد الشريف",
      actor,
    });

    expect(found.map((candidate) => candidate.partyId)).toEqual([
      strongId,
      weakId,
    ]);
    expect(found.map((candidate) => candidate.tier)).toEqual([
      "strong",
      "weak",
    ]);
  });

  it("keeps the in-memory scale limit observable", async () => {
    const organizationId = `synthetic-conflict-org-${crypto.randomUUID()}`;
    await seed(organizationId, "محمد علي");
    await seed(organizationId, "فاطمة حسن");

    // Matching is O(n) in a tenant's readable names. Exposing the count means
    // the limit stays visible rather than becoming a surprise at scale.
    await expect(candidates.readableNameCount(organizationId)).resolves.toBe(2);
  });
});
