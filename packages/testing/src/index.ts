export const syntheticParty = (suffix: string) => ({
  displayName: `Synthetic Test Party ${suffix}`,
  arabicDisplayName: `طرف اختبار اصطناعي ${suffix}`,
  isSynthetic: true,
});

export {
  syntheticAccessLifecycleFixture,
  syntheticAccessLifecycleIds,
} from "./access-lifecycle-fixtures.js";

export { g2LawyerScenarioFixtures } from "./g2-lawyer-scenario-fixtures.js";

export {
  syntheticPartyIdentityFixture,
  syntheticPartyIdentityIds,
  syntheticPartyIdentityPrivacy,
} from "./party-identity-fixtures.js";
