export type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

export type AggregateId = Brand<string, "AggregateId">;

export type DomainEvent<
  TType extends string = string,
  TPayload = unknown,
> = Readonly<{
  id: string;
  type: TType;
  occurredAt: Date;
  aggregateId: AggregateId;
  payload: TPayload;
}>;

export type Derived<T> = Readonly<{
  value: T;
  reviewState: "unreviewed" | "reviewed" | "rejected";
}>;

export const assertDerivedIsReviewed = <T>(derived: Derived<T>): T => {
  if (derived.reviewState !== "reviewed") {
    throw new Error(
      "Derived information cannot be used as a verified fact before review.",
    );
  }

  return derived.value;
};

export type DeadlineState = "calculated" | "confirmed" | "superseded";

export const assertDeadlineCanBeConfirmed = (input: {
  state: DeadlineState;
  ruleVersionId: string | undefined;
  reviewerId: string | undefined;
}): void => {
  if (input.state !== "calculated") {
    throw new Error("Only a calculated deadline can be confirmed.");
  }

  if (!input.ruleVersionId || !input.reviewerId) {
    throw new Error(
      "A confirmed deadline requires a source rule version and reviewer.",
    );
  }
};
