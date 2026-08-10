import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(import.meta.dirname, "../../..");

const walkTypeScriptFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return walkTypeScriptFiles(path);
      return /\.tsx?$/.test(entry.name) ? [path] : [];
    }),
  );

  return nested.flat();
};

const importSpecifierPattern =
  /(?:import(?:\s+type)?\s+(?:[^"']+?\s+from\s+)?|export\s+[^"']*?\s+from\s+)["']([^"']+)["']/g;

const readImportSpecifiers = async (path: string): Promise<string[]> => {
  const source = await readFile(path, "utf8");
  return Array.from(source.matchAll(importSpecifierPattern)).flatMap(
    (match) => {
      const specifier = match[1];
      return specifier ? [specifier] : [];
    },
  );
};

const isForbiddenDomainImport = (specifier: string): boolean =>
  [
    "next",
    "drizzle-orm",
    "postgres",
    "@aws-sdk/",
    "@google-cloud/",
    "@anthropic-ai/",
    "openai",
    "stripe",
    "twilio",
    "@sendgrid/",
    "node:child_process",
    "node:fs",
    "node:process",
  ].some(
    (prefix) => specifier === prefix || specifier.startsWith(`${prefix}/`),
  );

const isForbiddenM0ProviderImport = (specifier: string): boolean =>
  [
    "@aws-sdk/",
    "@google-cloud/",
    "@anthropic-ai/",
    "openai",
    "stripe",
    "twilio",
    "@sendgrid/",
  ].some(
    (prefix) => specifier === prefix || specifier.startsWith(`${prefix}/`),
  );

const isForbiddenIdentityProviderImport = (specifier: string): boolean =>
  [
    "@auth0/",
    "@clerk/",
    "next-auth",
    "next-auth/",
    "better-auth",
    "lucia",
    "passport",
    "firebase",
    "@supabase/",
    "@aws-sdk/",
    "@google-cloud/",
  ].some(
    (prefix) => specifier === prefix || specifier.startsWith(`${prefix}/`),
  );

describe("M0/M1 foundation boundaries", () => {
  it("keeps every domain source independent from framework and provider infrastructure (ARC-MOD-001)", async () => {
    const domainRoot = join(repositoryRoot, "packages/domain/src");
    const domainFiles = await walkTypeScriptFiles(domainRoot);

    expect(domainFiles.length).toBeGreaterThan(0);

    for (const path of domainFiles) {
      const imports = await readImportSpecifiers(path);
      expect(
        imports.filter(isForbiddenDomainImport),
        relative(repositoryRoot, path),
      ).toEqual([]);
    }
  });

  it("keeps integration code provider-neutral and exposes no M0 provider activation path (INT-ADP-001, QLT-EVD-001)", async () => {
    const integrationRoot = join(repositoryRoot, "packages/integrations/src");
    const integrationFiles = await walkTypeScriptFiles(integrationRoot);
    const imports = (
      await Promise.all(integrationFiles.map(readImportSpecifiers))
    ).flat();
    const webRouteFiles = await walkTypeScriptFiles(
      join(repositoryRoot, "apps/web/src/app"),
    );

    expect(imports.filter(isForbiddenM0ProviderImport)).toEqual([]);
    expect(
      webRouteFiles.map((path) => relative(repositoryRoot, path)),
    ).not.toContain("apps/web/src/app/api/route.ts");
  });

  it("keeps the M1 identity boundary provider-neutral and free of a browser authorization path (SEC-AUT-001, SEC-MAT-001)", async () => {
    const authRoot = join(repositoryRoot, "packages/auth/src");
    const authFiles = await walkTypeScriptFiles(authRoot);
    const webRouteFiles = await walkTypeScriptFiles(
      join(repositoryRoot, "apps/web/src/app"),
    );
    const authorizationRouteFiles = webRouteFiles
      .map((path) => relative(repositoryRoot, path))
      .filter((path) => /authorization|identity|login|session/i.test(path));
    const imports = (
      await Promise.all(authFiles.map(readImportSpecifiers))
    ).flat();

    expect(imports.filter(isForbiddenIdentityProviderImport)).toEqual([]);
    expect(authorizationRouteFiles).toEqual([]);
  });
});
