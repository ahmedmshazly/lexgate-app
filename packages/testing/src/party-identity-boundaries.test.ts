import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(import.meta.dirname, "../../..");

const walkTypeScriptFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? walkTypeScriptFiles(path)
        : /\.[cm]?[jt]sx?$/.test(entry.name)
          ? [path]
          : [];
    }),
  );
  return nested.flat();
};

describe("M2 party identity boundaries", () => {
  it("adds no public intake, client, conflict, engagement, matter, or party route (DAT-PRT-001)", async () => {
    const appRoot = join(repositoryRoot, "apps/web/src/app");
    const routeFiles = await walkTypeScriptFiles(appRoot);
    const prohibitedRoutes = routeFiles
      .map((path) => relative(appRoot, path))
      .filter((path) =>
        /party|intake|client|conflict|engagement|matter/i.test(path),
      );

    expect(prohibitedRoutes).toEqual([]);
  });

  it("keeps party identity implementation free of identity, AI, and external provider imports", async () => {
    const roots = [
      join(repositoryRoot, "packages/domain/src/party-identity.ts"),
      join(repositoryRoot, "packages/application/src/party-identity.ts"),
      join(repositoryRoot, "packages/database/src/party-identity.ts"),
    ];
    const source = await Promise.all(
      roots.map((path) => readFile(path, "utf8")),
    );
    const forbidden = [
      "next",
      "@auth0/",
      "@clerk/",
      "next-auth",
      "openai",
      "@anthropic-ai/",
      "stripe",
      "twilio",
      "@aws-sdk/",
      "@google-cloud/",
    ];

    expect(
      source.flatMap((file) =>
        forbidden.filter((specifier) => file.includes(specifier)),
      ),
    ).toEqual([]);
  });
});
