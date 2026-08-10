import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { validateDocumentation } from "./validate-docs.js";

const requiredDocumentationPaths = [
  "README.md",
  "governance/DOCUMENT_CONTROL.md",
  "governance/OPEN_DECISIONS.md",
  "requirements/MASTER_SRS.md",
  "requirements/requirements.yaml",
  "requirements/traceability.yaml",
  "architecture/DOMAIN_DATA_ARCHITECTURE.md",
    "development/QUALITY_ENGINEERING_STANDARD.md",
  "brand/BRAND_SYSTEM.md",
  "archive/pre-docs-2026-08-09/README.md",
];

const temporaryRoots: string[] = [];
const repositoryRoot = resolve(import.meta.dirname, "..");

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true })),
  );
});

const createSyntheticDocumentationRoot = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), "lexgate-docs-"));
  temporaryRoots.push(root);
  const docsRoot = join(root, "docs");

  await Promise.all(
    requiredDocumentationPaths.map(async (relativePath) => {
      const path = join(docsRoot, relativePath);
      await mkdir(join(path, ".."), { recursive: true });
      await writeFile(path, "# Synthetic documentation fixture\n");
    }),
  );

  await writeFile(
    join(docsRoot, "requirements/requirements.yaml"),
    `schema_version: 1
requirements:
  - id: ARC-MOD-001
    title: Synthetic incomplete P0 record
    statement: Synthetic fixture only.
    priority: P0
    status: approved
    sources: [SYNTHETIC]
    acceptance: [synthetic acceptance]
    tests: [docs:synthetic]
`,
  );
  await writeFile(
    join(docsRoot, "requirements/traceability.yaml"),
    "schema_version: 1\ntraceability: []\n",
  );

  return root;
};

describe("documentation validation", () => {
  it("rejects an incomplete P0 requirement record with actionable failures (QLT-TRC-001)", async () => {
    const root = await createSyntheticDocumentationRoot();

    const failures = await validateDocumentation(root);

    expect(failures).toEqual(
      expect.arrayContaining([
        "ARC-MOD-001 has no owner",
        "ARC-MOD-001 has no release",
        "ARC-MOD-001 has no legal_validation",
        "Missing traceability record for ARC-MOD-001",
      ]),
    );
  });

  it("keeps every open gate linked to its controlled review packet without changing the open-decision status", async () => {
    const [openDecisions, traceability] = await Promise.all([
      readFile(
        join(repositoryRoot, "docs/governance/OPEN_DECISIONS.md"),
        "utf8",
      ),
      readFile(
        join(repositoryRoot, "docs/requirements/traceability.yaml"),
        "utf8",
      ),
    ]);

    expect(openDecisions).toContain("004-gate-readiness");
    expect(openDecisions).toContain("ODR-003");
    expect(openDecisions).toContain("ODR-004");
    expect(traceability).toContain("specs/004-gate-readiness");
  });
});
