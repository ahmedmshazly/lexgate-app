/**
 * A deliberately adversarial synthetic name corpus.
 *
 * Every name is fictional. The corpus exists so the matcher's false-positive
 * and false-negative rates can be **measured** rather than asserted, because
 * the two failure modes here are equally dangerous and pull in opposite
 * directions:
 *
 * - A missed conflict is the obvious harm.
 * - A flood of false positives is the subtler one. Egyptian patronymic naming
 *   reuses a small pool of given names, so unrelated people sharing a full
 *   tripartite name is the normal case, not the edge case. A matcher that
 *   flags constantly trains staff to dismiss without reading, and a rejected
 *   flag then carries no information about whether anyone actually looked.
 *
 * Pairs are labelled with ground truth so a test can count both.
 */

export type NamePairExpectation = "same_person" | "distinct_people";

export type NamePair = Readonly<{
  left: string;
  right: string;
  expectation: NamePairExpectation;
  /** Why this pair is hard, so a failure report explains itself. */
  note: string;
}>;

/**
 * Pairs that denote the SAME person written differently. Missing one of these
 * is a missed conflict.
 */
export const sameParty: readonly NamePair[] = [
  {
    left: "أحمد محمد الشريف",
    right: "احمد محمد شريف",
    expectation: "same_person",
    note: "alef variant plus the Arabic definite article on the family name",
  },
  {
    left: "مريم سالم",
    right: "Mariam Salem",
    expectation: "same_person",
    note: "Arabic against its Latin transliteration",
  },
  {
    left: "Mariam Salem",
    right: "Maryam Saleem",
    expectation: "same_person",
    note: "two Latin transliterations of one Arabic name",
  },
  {
    left: "محمد يوسف",
    right: "Mohammed Youssef",
    expectation: "same_person",
    note: "cross-script, both parts needing transliteration equivalence",
  },
  {
    left: "عبد الله محمود",
    right: "عبدالله محمود",
    expectation: "same_person",
    note: "compound theophoric name written spaced against joined",
  },
  {
    left: "فاطمة علي",
    right: "فاطمه علي",
    expectation: "same_person",
    note: "ta marbuta against ha",
  },
  {
    left: "مُحَمَّد حسن",
    right: "محمد حسن",
    expectation: "same_person",
    note: "diacritics present against absent",
  },
  {
    left: "محـــمود إبراهيم",
    right: "محمود ابراهيم",
    expectation: "same_person",
    note: "tatweel elongation and an alef variant",
  },
  {
    left: "الأستاذ خالد عمر",
    right: "خالد عمر",
    expectation: "same_person",
    note: "honorific present against absent",
  },
  {
    left: "Ahmed Mohamed Ali Sharif",
    right: "Ahmad Mohammad Aly Shareef",
    expectation: "same_person",
    note: "every part transliterated differently",
  },
];

/**
 * Pairs that denote DIFFERENT people who look similar. Flagging one of these
 * as a strong candidate is the false positive that causes alert fatigue.
 */
export const distinctParties: readonly NamePair[] = [
  {
    left: "أحمد محمد علي",
    right: "أحمد محمد حسن",
    expectation: "distinct_people",
    note: "shares given and father; differs at grandfather — extremely common",
  },
  {
    left: "محمد الشريف",
    right: "يوسف الشريف",
    expectation: "distinct_people",
    note: "shares only a family name, which is close to meaningless alone",
  },
  {
    left: "علي حسن",
    right: "حسن علي",
    expectation: "distinct_people",
    note: "same two names in reversed roles — given against father",
  },
  {
    left: "مريم أحمد",
    right: "مريم محمود",
    expectation: "distinct_people",
    note: "shares a common given name only",
  },
  {
    left: "Ahmed Hassan Ibrahim",
    right: "Ahmed Hassan Mahmoud",
    expectation: "distinct_people",
    note: "two of three parts shared; the differing part is the family name",
  },
  {
    left: "عبد الله سالم",
    right: "عبد الرحمن سالم",
    expectation: "distinct_people",
    note: "different compound theophoric names sharing a family name",
  },
  {
    left: "خالد عمر النيل",
    right: "خالد عمر البحر",
    expectation: "distinct_people",
    note: "shares given and father; differs only at the final part",
  },
  {
    left: "شركة النيل التجريبية",
    right: "مكتب النيل التجريبي",
    expectation: "distinct_people",
    note: "two organisations sharing a distinctive word",
  },
];

/**
 * The hardest case, kept separate because it is the one a matcher cannot
 * resolve on names alone: two unrelated people with an identical full
 * tripartite name. A matcher SHOULD surface this as a candidate — it looks
 * identical — but a reviewer must decide, and the system must never treat the
 * match as identity.
 */
export const identicalButDistinct: readonly NamePair[] = [
  {
    left: "محمد أحمد محمود",
    right: "محمد أحمد محمود",
    expectation: "distinct_people",
    note: "identical tripartite name held by two unrelated people; names alone cannot separate them",
  },
];

export const nameCorpus: readonly NamePair[] = [
  ...sameParty,
  ...distinctParties,
];
