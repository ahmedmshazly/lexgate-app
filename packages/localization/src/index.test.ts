import { describe, expect, it } from "vitest";
import { isSupportedLocale, localeMetadata } from "./index.js";

describe("localization foundation", () => {
  it("models Arabic as RTL", () => {
    expect(localeMetadata("ar")).toEqual({
      language: "ar-EG",
      direction: "rtl",
    });
  });

  it("rejects unsupported locales", () => {
    expect(isSupportedLocale("fr")).toBe(false);
  });
});
