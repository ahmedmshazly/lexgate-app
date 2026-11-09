import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import {
  dirname,
  extname,
  join,
  normalize,
  relative,
  resolve,
} from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const repositoryRoot = resolve(import.meta.dirname, "..");

const walk = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return nested.flat();
};

const requirePath = (path: string, failures: string[], root: string): void => {
  if (!existsSync(path)) {
    failures.push(`Missing required path: ${relative(root, path)}`);
  }
};

const validateMarkdownLinks = async (
  markdownFiles: string[],
  failures: string[],
  root: string,
): Promise<void> => {
  for (const file of markdownFiles) {
    const content = await readFile(file, "utf8");
    const links = content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g);
    for (const link of links) {
      const href = link[1];
      if (!href || /^(https?:|mailto:|#)/.test(href)) continue;
      const target = href.split("#", 1)[0];
      if (!target) continue;
      const resolved = normalize(join(dirname(file), target));
      if (!existsSync(resolved)) {
        failures.push(`${relative(root, file)} links to missing ${href}`);
      }
    }
  }
};

const validateRequirements = async (
  docsRoot: string,
  failures: string[],
): Promise<void> => {
  const requirementsPath = join(docsRoot, "requirements", "requirements.yaml");
  const traceabilityPath = join(docsRoot, "requirements", "traceability.yaml");
  const requirementsDocument = parse(
    await readFile(requirementsPath, "utf8"),
  ) as {
    requirements?: Array<Record<string, unknown>>;
  };
  const traceabilityDocument = parse(
    await readFile(traceabilityPath, "utf8"),
  ) as {
    traceability?: Array<Record<string, unknown>>;
  };

  const requirements = requirementsDocument.requirements ?? [];
  const traceability = traceabilityDocument.traceability ?? [];
  const ids = new Set<string>();
  const requirementsById = new Map<string, Record<string, unknown>>();
  const tracesByRequirement = new Map<string, Record<string, unknown>>();
  const isNonEmptyStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.length > 0);

  for (const requirement of requirements) {
    const id = requirement.id;
    if (
      typeof id !== "string" ||
      !/^[A-Z][A-Z0-9]*-[A-Z][A-Z0-9]*-\d{3}$/.test(id)
    ) {
      failures.push(`Invalid requirement ID: ${String(id)}`);
      continue;
    }
    if (ids.has(id)) failures.push(`Duplicate requirement ID: ${id}`);
    ids.add(id);
    requirementsById.set(id, requirement);
    for (const field of [
      "title",
      "statement",
      "priority",
      "status",
      "owner",
      "release",
      "legal_validation",
    ]) {
      if (typeof requirement[field] !== "string" || requirement[field] === "") {
        failures.push(`${id} has no ${field}`);
      }
    }
    if (!isNonEmptyStringArray(requirement.sources)) {
      failures.push(`${id} has no sources`);
    }
    if (!isNonEmptyStringArray(requirement.acceptance)) {
      failures.push(`${id} has no acceptance criteria`);
    }
    if (!isNonEmptyStringArray(requirement.tests)) {
      failures.push(`${id} has no test evidence identifiers`);
    }
  }

  for (const trace of traceability) {
    const requirement = trace.requirement;
    if (typeof requirement !== "string" || !ids.has(requirement)) {
      failures.push(
        `Traceability references unknown requirement: ${String(requirement)}`,
      );
      continue;
    }
    if (tracesByRequirement.has(requirement)) {
      failures.push(`Duplicate traceability record for ${requirement}`);
      continue;
    }
    tracesByRequirement.set(requirement, trace);

    for (const [field, label] of [
      ["architecture", "architecture"],
      ["implementation", "implementation"],
      ["evidence", "evidence"],
    ] as const) {
      if (!isNonEmptyStringArray(trace[field])) {
        failures.push(`Traceability has no ${label} for ${requirement}`);
      }
    }
    if (typeof trace.gate !== "string" || trace.gate.length === 0) {
      failures.push(`Traceability has no gate for ${requirement}`);
    }

    const expectedEvidence = requirementsById.get(requirement)?.tests;
    if (
      isNonEmptyStringArray(expectedEvidence) &&
      isNonEmptyStringArray(trace.evidence)
    ) {
      const expected = [...expectedEvidence].sort();
      const actual = [...trace.evidence].sort();
      if (expected.join("\u0000") !== actual.join("\u0000")) {
        failures.push(
          `Traceability evidence does not match requirement tests for ${requirement}`,
        );
      }
    }
  }

  for (const requirement of ids) {
    if (!tracesByRequirement.has(requirement)) {
      failures.push(`Missing traceability record for ${requirement}`);
    }
  }
};

export const validateDocumentation = async (
  root = repositoryRoot,
): Promise<string[]> => {
  const docsRoot = join(root, "docs");
  const failures: string[] = [];

  for (const required of [
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
  ]) {
    requirePath(join(docsRoot, required), failures, root);
  }

  if (!existsSync(docsRoot)) return failures;

  const files = await walk(docsRoot);
  const markdownFiles = files.filter(
    (file) =>
      extname(file) === ".md" &&
      !file.includes("/archive/pre-docs-2026-08-09/"),
  );
  await validateMarkdownLinks(markdownFiles, failures, root);
  await validateRequirements(docsRoot, failures);

  return failures;
};

const run = async (): Promise<void> => {
  const failures = await validateDocumentation();

  if (failures.length > 0) {
    console.error(
      "Documentation validation failed:\n" +
        failures.map((failure) => `- ${failure}`).join("\n"),
    );
    process.exitCode = 1;
    return;
  }

  const files = await walk(join(repositoryRoot, "docs"));
  const markdownFiles = files.filter(
    (file) =>
      extname(file) === ".md" &&
      !file.includes("/archive/pre-docs-2026-08-09/"),
  );
  console.log(
    `Documentation validation passed (${markdownFiles.length} canonical Markdown files).`,
  );
};

const invokedPath = process.argv[1];
if (invokedPath && resolve(invokedPath) === fileURLToPath(import.meta.url)) {
  void run();
}
