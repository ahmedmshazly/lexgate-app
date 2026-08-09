export type Classification = "internal" | "confidential" | "restricted";

export const classificationLabel = (classification: Classification): string => {
  if (classification === "restricted") return "Highly restricted";
  if (classification === "confidential") return "Confidential";
  return "Internal";
};
