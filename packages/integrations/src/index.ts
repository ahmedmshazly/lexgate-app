export type ProviderDeliveryResult = Readonly<{
  providerReference: string;
  acceptedAt: Date;
}>;

export interface ProviderAdapter<TRequest> {
  deliver(
    request: TRequest,
    idempotencyKey: string,
  ): Promise<ProviderDeliveryResult>;
}

// No provider SDK belongs in this package until its ADR and validation gate are approved.
