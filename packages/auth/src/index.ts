export type AuthenticatedPrincipal = Readonly<{
  accountId: string;
  organizationId: string;
  authenticationStrength: "password" | "mfa";
}>;

export interface IdentityProviderPort {
  getPrincipal(): Promise<AuthenticatedPrincipal | null>;
}

// Provider selection and implementation are deliberately deferred to M1/G1.
