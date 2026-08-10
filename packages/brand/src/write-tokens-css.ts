import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { generateTokensCss } from "./generate-tokens-css.js";

/** Regenerates the committed stylesheet. Run with `pnpm tokens:generate`. */
const target = fileURLToPath(new URL("./tokens.css", import.meta.url));

await writeFile(target, generateTokensCss(), "utf8");
