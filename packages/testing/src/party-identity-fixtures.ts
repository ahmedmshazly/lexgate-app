export const syntheticPartyIdentityPrivacy = {
  processingPurpose: "party_identity_foundation",
  dataClassification: "internal" as const,
  subjectCategory: "synthetic_individual" as const,
  source: "synthetic-fixture",
  retentionCandidate: "synthetic_development_only" as const,
  accessBoundary: "internal_authorized_only" as const,
  validationRequirement: "privacy_and_g2_required" as const,
};

export const syntheticPartyIdentityIds = {
  organizationId: "synthetic-organization-party-identity",
  accountId: "synthetic-account-party-identity",
  personPartyId: "00000000-0000-4000-8000-000000000201",
  organizationPartyId: "00000000-0000-4000-8000-000000000202",
  personNameId: "00000000-0000-4000-8000-000000000203",
  organizationNameId: "00000000-0000-4000-8000-000000000204",
  personPrimaryAssignmentId: "00000000-0000-4000-8000-000000000205",
  organizationPrimaryAssignmentId: "00000000-0000-4000-8000-000000000206",
  contactId: "00000000-0000-4000-8000-000000000207",
} as const;

export const syntheticPartyIdentityFixture = () => ({
  actor: {
    accountId: syntheticPartyIdentityIds.accountId,
    organizationId: syntheticPartyIdentityIds.organizationId,
  },
  privacy: syntheticPartyIdentityPrivacy,
  person: {
    id: syntheticPartyIdentityIds.personPartyId,
    kind: "person" as const,
    name: {
      id: syntheticPartyIdentityIds.personNameId,
      value: "أحمد اختبار",
      formType: "legal" as const,
      languageTag: "ar",
      script: "Arabic",
      reviewState: "unreviewed" as const,
      privacy: syntheticPartyIdentityPrivacy,
    },
    primaryNameAssignment: {
      id: syntheticPartyIdentityIds.personPrimaryAssignmentId,
      nameFormId: syntheticPartyIdentityIds.personNameId,
    },
    contact: {
      id: syntheticPartyIdentityIds.contactId,
      contactType: "email" as const,
      value: "synthetic.ahmed@example.test",
      operationalPurpose: "party_identity_foundation",
      reviewState: "unreviewed" as const,
      privacy: syntheticPartyIdentityPrivacy,
    },
  },
  organization: {
    id: syntheticPartyIdentityIds.organizationPartyId,
    kind: "organization" as const,
    name: {
      id: syntheticPartyIdentityIds.organizationNameId,
      value: "Synthetic Legal Services LLC",
      formType: "legal" as const,
      languageTag: "en",
      script: "Latin",
      reviewState: "unreviewed" as const,
      privacy: {
        ...syntheticPartyIdentityPrivacy,
        subjectCategory: "synthetic_organization" as const,
      },
    },
    primaryNameAssignment: {
      id: syntheticPartyIdentityIds.organizationPrimaryAssignmentId,
      nameFormId: syntheticPartyIdentityIds.organizationNameId,
    },
  },
});
