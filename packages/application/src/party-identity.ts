import type {
  CreateNeutralPartyInput,
  FlagPossibleDuplicateInput,
  PartyIdentityMutation,
  RecordPartyContactInput,
  RecordPartyNameInput,
  RecordRepresentationClaimInput,
} from "@lexgate/domain";
import {
  createNeutralPartyMutation,
  flagPossibleDuplicateMutation,
  recordPartyContactMutation,
  recordPartyNameMutation,
  recordRepresentationClaimMutation,
} from "@lexgate/domain";
import {
  createPartyIdentityCommandLogContext,
  type Logger,
} from "@lexgate/observability";
import type { Actor } from "./index.js";
import type { RestrictedResourceAuthorizationPort } from "./authorization.js";

type PartyIdentityAction =
  | "party.create"
  | "party.record_name"
  | "party.record_contact"
  | "party.record_representation"
  | "party.flag_possible_duplicate";

export type PartyIdentityAssertionCategory =
  "party" | "name" | "contact" | "representation" | "possible_duplicate";

export type PartyIdentityCommandReceipt = Readonly<{
  commandId: string;
  commandFingerprint: string;
  actorAccountId: string;
  organizationId: string;
  action: PartyIdentityAction;
  resourceType: "party";
  resourceId: string;
  assertionId: string;
  assertionCategory: PartyIdentityAssertionCategory;
  occurredAt: Date;
}>;

export type PartyIdentityCommandResult = Readonly<{
  partyId: string;
  assertionId: string;
  replayed: boolean;
}>;

export type PartyIdentityNameHistory = Readonly<{
  id: string;
  value: string;
  formType: string;
  languageTag: string;
  script: string | null;
  reviewState: string;
  source: string;
  recordedAt: Date;
}>;

export type PartyIdentityContactHistory = Readonly<{
  id: string;
  contactType: string;
  value: string;
  operationalPurpose: string;
  reviewState: string;
  source: string;
  recordedAt: Date;
}>;

export type PartyIdentityPrimaryNameAssignmentHistory = Readonly<{
  id: string;
  nameFormId: string;
  supersedesAssignmentId: string | null;
  recordedAt: Date;
  recordedByAccountId: string;
}>;

export type PartyIdentityHistory = Readonly<{
  id: string;
  kind: "person" | "organization";
  primaryNameId: string;
  names: readonly PartyIdentityNameHistory[];
  primaryNameAssignments: readonly PartyIdentityPrimaryNameAssignmentHistory[];
  contacts: readonly PartyIdentityContactHistory[];
}>;

export interface PartyIdentityPersistencePort {
  createParty(input: {
    actor: Actor;
    command: CreateNeutralPartyInput;
    mutation: PartyIdentityMutation;
    commandFingerprint: string;
  }): Promise<PartyIdentityCommandResult>;
  recordName(input: {
    actor: Actor;
    command: RecordPartyNameInput;
    mutation: PartyIdentityMutation;
    commandFingerprint: string;
  }): Promise<PartyIdentityCommandResult>;
  recordContact(input: {
    actor: Actor;
    command: RecordPartyContactInput;
    mutation: PartyIdentityMutation;
    commandFingerprint: string;
  }): Promise<PartyIdentityCommandResult>;
  recordRepresentationClaim(input: {
    actor: Actor;
    command: RecordRepresentationClaimInput;
    mutation: PartyIdentityMutation;
    commandFingerprint: string;
  }): Promise<PartyIdentityCommandResult>;
  flagPossibleDuplicate(input: {
    actor: Actor;
    command: FlagPossibleDuplicateInput;
    mutation: PartyIdentityMutation;
    commandFingerprint: string;
  }): Promise<PartyIdentityCommandResult>;
  readPartyHistory(input: {
    organizationId: string;
    partyId: string;
  }): Promise<PartyIdentityHistory | null>;
}

export type PartyIdentityCommandOutcome =
  | Readonly<{
      outcome: "recorded";
      result: PartyIdentityCommandResult;
    }>
  | Readonly<{
      outcome: "denied";
      reason: "not_authorized";
    }>;

export type PartyIdentityReadOutcome =
  | Readonly<{
      outcome: "found";
      history: PartyIdentityHistory;
    }>
  | Readonly<{
      outcome: "denied";
      reason: "not_authorized";
    }>;

export class PartyIdentityConflictError extends Error {
  override name = "PartyIdentityConflictError";
}

export class PartyIdentityNotFoundOrNotAuthorizedError extends Error {
  override name = "PartyIdentityNotFoundOrNotAuthorizedError";
}

const denied: PartyIdentityCommandOutcome = {
  outcome: "denied",
  reason: "not_authorized",
};

const readDenied: PartyIdentityReadOutcome = {
  outcome: "denied",
  reason: "not_authorized",
};

const canonicalize = (value: unknown): unknown => {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalize(item)]),
    );
  }
  return value;
};

const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

export const createPartyIdentityCommandFingerprint = async (
  command: unknown,
): Promise<string> => {
  const encoded = new TextEncoder().encode(
    JSON.stringify(canonicalize(command)),
  );
  return toHex(await globalThis.crypto.subtle.digest("SHA-256", encoded));
};

const authorize = async (input: {
  actor: Actor;
  authorization: RestrictedResourceAuthorizationPort;
  resource: { type: "party" | "party-registry"; id: string };
  operation: PartyIdentityAction | "party.read";
  correlationId: string;
}): Promise<boolean> => {
  const decision = await input.authorization.evaluate({
    decisionId: crypto.randomUUID(),
    correlationId: input.correlationId,
    actorAccountId: input.actor.accountId,
    organizationId: input.actor.organizationId,
    resource: input.resource,
    operation: input.operation,
  });
  return decision.outcome === "allowed";
};

const logOutcome = (input: {
  logger?: Logger | undefined;
  correlationId: string;
  action: PartyIdentityAction | "party.read";
  outcome: "recorded" | "denied" | "found";
}): void => {
  input.logger?.info(
    createPartyIdentityCommandLogContext({
      correlationId: input.correlationId,
      action: input.action,
      outcome: input.outcome,
    }),
    "Party identity command completed.",
  );
};

const denyCommand = (input: {
  logger?: Logger | undefined;
  correlationId: string;
  action: PartyIdentityAction;
}): PartyIdentityCommandOutcome => {
  logOutcome({
    logger: input.logger,
    correlationId: input.correlationId,
    action: input.action,
    outcome: "denied",
  });
  return denied;
};

const denyRead = (input: {
  logger?: Logger | undefined;
  correlationId: string;
}): PartyIdentityReadOutcome => {
  logOutcome({
    logger: input.logger,
    correlationId: input.correlationId,
    action: "party.read",
    outcome: "denied",
  });
  return readDenied;
};

const recordCommand = async <
  TCommand extends { commandId: string; correlationId: string },
>(input: {
  actor: Actor;
  command: TCommand;
  mutation: PartyIdentityMutation;
  action: PartyIdentityAction;
  logger?: Logger | undefined;
  persist: (args: {
    actor: Actor;
    command: TCommand;
    mutation: PartyIdentityMutation;
    commandFingerprint: string;
  }) => Promise<PartyIdentityCommandResult>;
}): Promise<PartyIdentityCommandOutcome> => {
  const commandFingerprint = await createPartyIdentityCommandFingerprint(
    input.command,
  );
  const result = await input.persist({
    actor: input.actor,
    command: input.command,
    mutation: input.mutation,
    commandFingerprint,
  });
  logOutcome({
    logger: input.logger,
    correlationId: input.command.correlationId,
    action: input.action,
    outcome: "recorded",
  });
  return { outcome: "recorded", result };
};

export const createNeutralParty = async (input: {
  actor: Actor;
  command: CreateNeutralPartyInput;
  authorization: RestrictedResourceAuthorizationPort;
  persistence: PartyIdentityPersistencePort;
  logger?: Logger | undefined;
}): Promise<PartyIdentityCommandOutcome> => {
  const allowed = await authorize({
    actor: input.actor,
    authorization: input.authorization,
    resource: { type: "party-registry", id: input.actor.organizationId },
    operation: "party.create",
    correlationId: input.command.correlationId,
  });
  if (!allowed) {
    return denyCommand({
      logger: input.logger,
      correlationId: input.command.correlationId,
      action: "party.create",
    });
  }

  const mutation = createNeutralPartyMutation(input.command);
  return recordCommand({
    actor: input.actor,
    command: input.command,
    mutation,
    action: "party.create",
    logger: input.logger,
    persist: input.persistence.createParty.bind(input.persistence),
  });
};

export const recordPartyName = async (input: {
  actor: Actor;
  command: RecordPartyNameInput;
  authorization: RestrictedResourceAuthorizationPort;
  persistence: PartyIdentityPersistencePort;
  logger?: Logger | undefined;
}): Promise<PartyIdentityCommandOutcome> => {
  const allowed = await authorize({
    actor: input.actor,
    authorization: input.authorization,
    resource: { type: "party", id: input.command.partyId },
    operation: "party.record_name",
    correlationId: input.command.correlationId,
  });
  if (!allowed) {
    return denyCommand({
      logger: input.logger,
      correlationId: input.command.correlationId,
      action: "party.record_name",
    });
  }

  return recordCommand({
    actor: input.actor,
    command: input.command,
    mutation: recordPartyNameMutation(input.command),
    action: "party.record_name",
    logger: input.logger,
    persist: input.persistence.recordName.bind(input.persistence),
  });
};

export const recordPartyContact = async (input: {
  actor: Actor;
  command: RecordPartyContactInput;
  authorization: RestrictedResourceAuthorizationPort;
  persistence: PartyIdentityPersistencePort;
  logger?: Logger | undefined;
}): Promise<PartyIdentityCommandOutcome> => {
  const allowed = await authorize({
    actor: input.actor,
    authorization: input.authorization,
    resource: { type: "party", id: input.command.partyId },
    operation: "party.record_contact",
    correlationId: input.command.correlationId,
  });
  if (!allowed) {
    return denyCommand({
      logger: input.logger,
      correlationId: input.command.correlationId,
      action: "party.record_contact",
    });
  }

  return recordCommand({
    actor: input.actor,
    command: input.command,
    mutation: recordPartyContactMutation(input.command),
    action: "party.record_contact",
    logger: input.logger,
    persist: input.persistence.recordContact.bind(input.persistence),
  });
};

const authorizeBothParties = async (input: {
  actor: Actor;
  authorization: RestrictedResourceAuthorizationPort;
  firstPartyId: string;
  secondPartyId: string;
  operation: "party.record_representation" | "party.flag_possible_duplicate";
  correlationId: string;
}): Promise<boolean> => {
  const firstAllowed = await authorize({
    actor: input.actor,
    authorization: input.authorization,
    resource: { type: "party", id: input.firstPartyId },
    operation: input.operation,
    correlationId: input.correlationId,
  });
  if (!firstAllowed) return false;
  return authorize({
    actor: input.actor,
    authorization: input.authorization,
    resource: { type: "party", id: input.secondPartyId },
    operation: input.operation,
    correlationId: input.correlationId,
  });
};

export const recordRepresentationClaim = async (input: {
  actor: Actor;
  command: RecordRepresentationClaimInput;
  authorization: RestrictedResourceAuthorizationPort;
  persistence: PartyIdentityPersistencePort;
  logger?: Logger | undefined;
}): Promise<PartyIdentityCommandOutcome> => {
  const allowed = await authorizeBothParties({
    actor: input.actor,
    authorization: input.authorization,
    firstPartyId: input.command.claim.representedPartyId,
    secondPartyId: input.command.claim.representativePartyId,
    operation: "party.record_representation",
    correlationId: input.command.correlationId,
  });
  if (!allowed) {
    return denyCommand({
      logger: input.logger,
      correlationId: input.command.correlationId,
      action: "party.record_representation",
    });
  }

  return recordCommand({
    actor: input.actor,
    command: input.command,
    mutation: recordRepresentationClaimMutation(input.command),
    action: "party.record_representation",
    logger: input.logger,
    persist: input.persistence.recordRepresentationClaim.bind(
      input.persistence,
    ),
  });
};

export const flagPossibleDuplicate = async (input: {
  actor: Actor;
  command: FlagPossibleDuplicateInput;
  authorization: RestrictedResourceAuthorizationPort;
  persistence: PartyIdentityPersistencePort;
  logger?: Logger | undefined;
}): Promise<PartyIdentityCommandOutcome> => {
  const allowed = await authorizeBothParties({
    actor: input.actor,
    authorization: input.authorization,
    firstPartyId: input.command.duplicate.firstPartyId,
    secondPartyId: input.command.duplicate.secondPartyId,
    operation: "party.flag_possible_duplicate",
    correlationId: input.command.correlationId,
  });
  if (!allowed) {
    return denyCommand({
      logger: input.logger,
      correlationId: input.command.correlationId,
      action: "party.flag_possible_duplicate",
    });
  }

  return recordCommand({
    actor: input.actor,
    command: input.command,
    mutation: flagPossibleDuplicateMutation(input.command),
    action: "party.flag_possible_duplicate",
    logger: input.logger,
    persist: input.persistence.flagPossibleDuplicate.bind(input.persistence),
  });
};

export const readPartyIdentityHistory = async (input: {
  actor: Actor;
  partyId: string;
  authorization: RestrictedResourceAuthorizationPort;
  persistence: PartyIdentityPersistencePort;
  correlationId: string;
  logger?: Logger | undefined;
}): Promise<PartyIdentityReadOutcome> => {
  const allowed = await authorize({
    actor: input.actor,
    authorization: input.authorization,
    resource: { type: "party", id: input.partyId },
    operation: "party.read",
    correlationId: input.correlationId,
  });
  if (!allowed) {
    return denyRead({
      logger: input.logger,
      correlationId: input.correlationId,
    });
  }

  const history = await input.persistence.readPartyHistory({
    organizationId: input.actor.organizationId,
    partyId: input.partyId,
  });
  if (!history) {
    return denyRead({
      logger: input.logger,
      correlationId: input.correlationId,
    });
  }
  logOutcome({
    logger: input.logger,
    correlationId: input.correlationId,
    action: "party.read",
    outcome: "found",
  });
  return { outcome: "found", history };
};
