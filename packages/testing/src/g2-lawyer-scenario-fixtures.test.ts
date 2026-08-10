import { describe, expect, it } from "vitest";
import { g2LawyerScenarioFixtures } from "./g2-lawyer-scenario-fixtures.js";

describe("G2 synthetic lawyer scenario fixtures", () => {
  it("covers nine distinct bilingual scenario families without an automatic legal result", () => {
    expect(g2LawyerScenarioFixtures).toHaveLength(9);
    expect(g2LawyerScenarioFixtures.map((scenario) => scenario.id)).toEqual([
      "G2-01",
      "G2-02",
      "G2-03",
      "G2-04",
      "G2-05",
      "G2-06",
      "G2-07",
      "G2-08",
      "G2-09",
    ]);

    for (const scenario of g2LawyerScenarioFixtures) {
      expect(scenario.arabicLabel).not.toHaveLength(0);
      expect(scenario.englishLabel).not.toHaveLength(0);
      expect(scenario.latinNameForms).not.toHaveLength(0);
      expect(scenario.safeSystemOutcome).not.toMatch(
        /clear|engag|matter|authorit/i,
      );
      expect(scenario.prohibitedAutomaticOutcome).toMatch(
        /clear|engag|matter|authorit|access|merge|disclosure/i,
      );
      expect(scenario.requiresEscalation).toBe(true);
    }
  });
});
