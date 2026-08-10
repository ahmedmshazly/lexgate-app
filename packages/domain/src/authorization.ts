export type RestrictedResourceReference = Readonly<{
  type: string;
  id: string;
}>;

export type RestrictedResourceAuthorizationRequest = Readonly<{
  decisionId: string;
  correlationId: string;
  actorAccountId: string;
  organizationId: string;
  resource: RestrictedResourceReference;
  operation: string;
  browserPermissionAssertion?: boolean;
  emergencyAccessRequested?: boolean;
}>;

export type OrganizationMembership = Readonly<{
  accountId: string;
  organizationId: string;
  systemRole: string;
  isActive: boolean;
}>;

export type RestrictedResourceAccessGrant = Readonly<{
  accountId: string;
  organizationId: string;
  resourceType: string;
  resourceId: string;
  operation: string;
  isActive: boolean;
}>;

export type AuthorizationDecision =
  | Readonly<{
      outcome: "allowed";
      reason: "explicit_relationship";
    }>
  | Readonly<{
      outcome: "denied";
      reason: "not_authorized";
    }>;

export type RestrictedResourceAuthorizationPolicyInput = Readonly<{
  request: RestrictedResourceAuthorizationRequest;
  membership: OrganizationMembership | null;
  grants: readonly RestrictedResourceAccessGrant[];
}>;

const isNonEmpty = (value: string): boolean => value.trim().length > 0;

const denied: AuthorizationDecision = {
  outcome: "denied",
  reason: "not_authorized",
};

export const evaluateRestrictedResourceAccess = (
  input: RestrictedResourceAuthorizationPolicyInput,
): AuthorizationDecision => {
  const { request, membership, grants } = input;

  if (
    !isNonEmpty(request.decisionId) ||
    !isNonEmpty(request.correlationId) ||
    !isNonEmpty(request.actorAccountId) ||
    !isNonEmpty(request.organizationId) ||
    !isNonEmpty(request.resource.type) ||
    !isNonEmpty(request.resource.id) ||
    !isNonEmpty(request.operation) ||
    request.emergencyAccessRequested === true
  ) {
    return denied;
  }

  if (
    !membership ||
    !membership.isActive ||
    membership.accountId !== request.actorAccountId ||
    membership.organizationId !== request.organizationId
  ) {
    return denied;
  }

  const hasExactGrant = grants.some(
    (grant) =>
      grant.isActive &&
      grant.accountId === request.actorAccountId &&
      grant.organizationId === request.organizationId &&
      grant.resourceType === request.resource.type &&
      grant.resourceId === request.resource.id &&
      grant.operation === request.operation,
  );

  return hasExactGrant
    ? { outcome: "allowed", reason: "explicit_relationship" }
    : denied;
};
