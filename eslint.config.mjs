import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { projectService: true },
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    files: ["packages/domain/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "next",
                "next/**",
                "drizzle-orm",
                "drizzle-orm/**",
                "postgres",
                "@aws-sdk/**",
                "@google-cloud/**",
                "@anthropic-ai/**",
                "openai",
                "stripe",
                "twilio",
                "@sendgrid/**",
                "node:child_process",
                "node:fs",
                "node:fs/**",
                "node:process",
              ],
              message:
                "Domain code must remain independent of frameworks, databases, providers, and runtime infrastructure (ARC-MOD-001).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/integrations/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@aws-sdk/**",
                "@google-cloud/**",
                "@anthropic-ai/**",
                "openai",
                "stripe",
                "twilio",
                "@sendgrid/**",
              ],
              message:
                "M0 permits typed provider contracts only; concrete provider SDKs require their ADR and validation gate (INT-ADP-001).",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/drizzle/**",
    ],
  },
];
