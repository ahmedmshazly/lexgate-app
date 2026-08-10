export const syntheticAccessLifecycleIds = {
  organizationId: "synthetic-organization-access-lifecycle",
  requesterAccountId: "synthetic-requester-access-lifecycle",
  approverAccountId: "synthetic-approver-access-lifecycle",
  subjectAccountId: "synthetic-subject-access-lifecycle",
  operatorAccountId: "synthetic-operator-access-lifecycle",
  membershipRelationshipId: "00000000-0000-4000-8000-000000000401",
  grantRelationshipId: "00000000-0000-4000-8000-000000000402",
  approvalId: "00000000-0000-4000-8000-000000000403",
  commandId: "00000000-0000-4000-8000-000000000404",
  correlationId: "synthetic-correlation-access-lifecycle",
  resourceId: "synthetic-restricted-resource-access-lifecycle",
} as const;

export const syntheticAccessLifecycleFixture = () => ({
  actor: {
    accountId: syntheticAccessLifecycleIds.operatorAccountId,
    organizationId: syntheticAccessLifecycleIds.organizationId,
  },
  requesterAccountId: syntheticAccessLifecycleIds.requesterAccountId,
  approverAccountId: syntheticAccessLifecycleIds.approverAccountId,
  subjectAccountId: syntheticAccessLifecycleIds.subjectAccountId,
  membershipRelationshipId:
    syntheticAccessLifecycleIds.membershipRelationshipId,
  grantRelationshipId: syntheticAccessLifecycleIds.grantRelationshipId,
  approvalId: syntheticAccessLifecycleIds.approvalId,
  commandId: syntheticAccessLifecycleIds.commandId,
  correlationId: syntheticAccessLifecycleIds.correlationId,
  resource: {
    type: "synthetic-restricted-resource",
    id: syntheticAccessLifecycleIds.resourceId,
  },
  operation: "read",
  arabicScenarioLabel: "منح وصول اصطناعي قابل للمراجعة",
  englishScenarioLabel: "Reviewable synthetic access grant",
  occurredAt: new Date("2026-08-10T12:00:00.000Z"),
  approvalExpiresAt: new Date("2026-08-17T12:00:00.000Z"),
});
