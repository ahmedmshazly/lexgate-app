import { describe, expect, it } from "vitest";
import {
  canonicalNamePart,
  canonicalNameParts,
  compareNameParts,
  containsArabicScript,
  normalizeNameText,
  splitNameParts,
} from "./arabic-names.js";

describe("Arabic orthographic normalization", () => {
  it("unifies alef variants", () => {
    // أ إ آ and bare ا are the same letter written differently. An exact
    // comparison would treat these as different people.
    const forms = ["أحمد", "إحمد", "آحمد", "احمد"];
    const normalized = forms.map(normalizeNameText);

    expect(new Set(normalized).size).toBe(1);
  });

  it("unifies ta marbuta with ha", () => {
    expect(normalizeNameText("فاطمة")).toBe(normalizeNameText("فاطمه"));
  });

  it("unifies alef maksura with ya", () => {
    expect(normalizeNameText("يحيى")).toBe(normalizeNameText("يحيي"));
  });

  it("strips diacritics", () => {
    expect(normalizeNameText("مُحَمَّد")).toBe(normalizeNameText("محمد"));
  });

  it("strips tatweel", () => {
    expect(normalizeNameText("محـــمد")).toBe(normalizeNameText("محمد"));
  });

  it("folds the definite article in both scripts", () => {
    expect(normalizeNameText("Al-Sharif")).toBe(normalizeNameText("Sharif"));
    expect(normalizeNameText("El Sharif")).toBe(normalizeNameText("sharif"));
    expect(normalizeNameText("al sharif")).toBe(normalizeNameText("Sharif"));
  });

  it("folds Latin case, punctuation, and whitespace", () => {
    expect(normalizeNameText("  Ahmed   O'Salem  ")).toBe("ahmed o salem");
  });

  it("detects Arabic script", () => {
    expect(containsArabicScript("أحمد")).toBe(true);
    expect(containsArabicScript("Ahmed")).toBe(false);
  });
});

describe("name componentization", () => {
  it("splits a patronymic chain into its parts", () => {
    expect(splitNameParts("أحمد محمد علي الشريف")).toEqual([
      "احمد",
      "محمد",
      "علي",
      "شريف",
    ]);
  });

  it("keeps a compound theophoric name as one part", () => {
    // Written joined or spaced is a spelling choice, not two parts. Treating
    // it as two would shift every later part by one position and destroy the
    // positional comparison the whole design rests on.
    expect(splitNameParts("عبد الله محمد")).toEqual(
      splitNameParts("عبدالله محمد"),
    );
    expect(splitNameParts("عبد الله محمد")).toHaveLength(2);
  });

  it("drops honorifics, which carry no identifying information", () => {
    expect(splitNameParts("الأستاذ أحمد محمد")).toEqual(
      splitNameParts("أحمد محمد"),
    );
    expect(splitNameParts("Dr. Ahmed Mohamed")).toEqual(["ahmed", "mohamed"]);
  });

  it("returns nothing for an empty or punctuation-only name", () => {
    expect(splitNameParts("   ")).toEqual([]);
    expect(splitNameParts("--")).toEqual([]);
  });
});

describe("transliteration equivalence", () => {
  it("maps known Latin renderings onto one canonical key", () => {
    for (const group of [
      ["Mohamed", "Mohammed", "Muhammad", "Mohammad"],
      ["Youssef", "Yusuf", "Yousef"],
      ["Mariam", "Maryam", "Mariem"],
    ]) {
      const canonical = group.map(canonicalNamePart);
      expect(new Set(canonical).size, group.join("/")).toBe(1);
    }
  });

  it("maps an Arabic name onto the same key as its transliteration", () => {
    expect(canonicalNamePart("محمد")).toBe(canonicalNamePart("Mohammed"));
    expect(canonicalNamePart("مريم")).toBe(canonicalNamePart("Maryam"));
  });

  it("leaves an unknown name as its normalized form", () => {
    // The table is incomplete by construction. An unknown name must still
    // compare correctly against itself.
    expect(canonicalNamePart("Zeinhom")).toBe("zeinhom");
    expect(compareNameParts("Zeinhom", "zeinhom")).toBe("exact");
  });

  it("canonicalizes a whole name across scripts", () => {
    expect(canonicalNameParts("مريم سالم")).toEqual(
      canonicalNameParts("Mariam Salem"),
    );
  });
});

describe("part comparison reports how, not just whether", () => {
  it("distinguishes an exact match from a transliteration match", () => {
    expect(compareNameParts("محمد", "محمد")).toBe("exact");
    expect(compareNameParts("Mohamed", "Mohammed")).toBe("transliteration");
    expect(compareNameParts("Mohamed", "Ahmed")).toBe("none");
  });

  it("treats an empty part as no match rather than a match", () => {
    expect(compareNameParts("", "محمد")).toBe("none");
    expect(compareNameParts("  ", "  ")).toBe("none");
  });

  it("matches across scripts through the canonical key", () => {
    expect(compareNameParts("مريم", "Maryam")).toBe("transliteration");
  });
});
