export type G2LawyerScenarioFixture = Readonly<{
  id: string;
  title: string;
  arabicLabel: string;
  englishLabel: string;
  latinNameForms: readonly string[];
  safeSystemOutcome: string;
  prohibitedAutomaticOutcome: string;
  requiresEscalation: true;
}>;

export const g2LawyerScenarioFixtures: readonly G2LawyerScenarioFixture[] = [
  {
    id: "G2-01",
    title: "Incomplete prospective enquiry",
    arabicLabel: "استفسار محتمل غير مكتمل",
    englishLabel: "Incomplete prospective enquiry",
    latinNameForms: ["Nile Test Co."],
    safeSystemOutcome:
      "Record, request approved missing information, and route.",
    prohibitedAutomaticOutcome: "clearance or engagement",
    requiresEscalation: true,
  },
  {
    id: "G2-02",
    title: "Name-variant cue",
    arabicLabel: "تنويعات الاسم",
    englishLabel: "Name-variant cue",
    latinNameForms: ["Mariam Salem", "Mariam Saleem"],
    safeSystemOutcome: "Preserve provenance and show an authorized review cue.",
    prohibitedAutomaticOutcome: "identity merge or clearance",
    requiresEscalation: true,
  },
  {
    id: "G2-03",
    title: "Individual, organisation, and affiliate ambiguity",
    arabicLabel: "غموض الشخص والمنشأة والتابع",
    englishLabel: "Individual, organisation, and affiliate ambiguity",
    latinNameForms: ["Nile Test Holdings", "Nile Test Director"],
    safeSystemOutcome: "Keep parties distinct and route the relationship cue.",
    prohibitedAutomaticOutcome: "identity merge or organisation attribution",
    requiresEscalation: true,
  },
  {
    id: "G2-04",
    title: "Unreviewed representative authority",
    arabicLabel: "سلطة تمثيل غير مراجعة",
    englishLabel: "Unreviewed representative authority",
    latinNameForms: ["Synthetic Representative"],
    safeSystemOutcome: "Record an unvalidated assertion and route.",
    prohibitedAutomaticOutcome: "representation authority or access",
    requiresEscalation: true,
  },
  {
    id: "G2-05",
    title: "Present-client adverse-party cue",
    arabicLabel: "مؤشر طرف خصم لعميل قائم",
    englishLabel: "Present-client adverse-party cue",
    latinNameForms: ["Current Synthetic Client", "Proposed Adverse Party"],
    safeSystemOutcome: "Route for authorized conflict review.",
    prohibitedAutomaticOutcome: "clearance or matter opening",
    requiresEscalation: true,
  },
  {
    id: "G2-06",
    title: "Former-client uncertainty",
    arabicLabel: "غموض عميل سابق",
    englishLabel: "Former-client uncertainty",
    latinNameForms: ["Former Synthetic Client"],
    safeSystemOutcome: "Preserve unknowns and request approved information.",
    prohibitedAutomaticOutcome: "automatic clearance or block",
    requiresEscalation: true,
  },
  {
    id: "G2-07",
    title: "Prospective adverse party",
    arabicLabel: "طرف خصم محتمل",
    englishLabel: "Prospective adverse party",
    latinNameForms: ["Prospective Adverse Party"],
    safeSystemOutcome: "Record limited candidate context and route.",
    prohibitedAutomaticOutcome: "client or engagement creation",
    requiresEscalation: true,
  },
  {
    id: "G2-08",
    title: "Enquiry, consultation, or payment without engagement",
    arabicLabel: "استفسار أو استشارة أو دفع دون توكيل",
    englishLabel: "Enquiry, consultation, or payment without engagement",
    latinNameForms: ["Synthetic Enquirer"],
    safeSystemOutcome: "Keep contact and commercial facts separate.",
    prohibitedAutomaticOutcome: "engagement or representation",
    requiresEscalation: true,
  },
  {
    id: "G2-09",
    title: "Restricted high-sensitivity case",
    arabicLabel: "حالة مقيدة عالية الحساسية",
    englishLabel: "Restricted high-sensitivity case",
    latinNameForms: ["Restricted Synthetic Case"],
    safeSystemOutcome:
      "Use exact reviewer projection and mandatory escalation.",
    prohibitedAutomaticOutcome: "broad disclosure or access grant",
    requiresEscalation: true,
  },
];
