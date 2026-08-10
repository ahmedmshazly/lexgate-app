import type {
  AuthorizationDecision,
  RestrictedResourceAuthorizationRequest,
  RestrictedResourceReference,
} from "@lexgate/domain";
import {
  createAuthorizationDecisionLogContext,
  type Logger,
} from "@lexgate/observability";
import type { Actor } from "./index.js";

export interface RestrictedResourceAuthorizationPort {
  evaluate(
    request: RestrictedResourceAuthorizationRequest,
  ): Promise<AuthorizationDecision>;
}

export const evaluateRestrictedResourceAccess = async (input: {
  decisionId: string;
  correlationId: string;
  actor: Actor;
  resource: RestrictedResourceReference;
  operation: string;
  authorization: RestrictedResourceAuthorizationPort;
  logger?: Logger;
}): Promise<AuthorizationDecision> => {
  const decision = await input.authorization.evaluate({
    decisionId: input.decisionId,
    correlationId: input.correlationId,
    actorAccountId: input.actor.accountId,
    organizationId: input.actor.organizationId,
    resource: input.resource,
    operation: input.operation,
  });

  input.logger?.info(
    createAuthorizationDecisionLogContext({
      correlationId: input.correlationId,
      outcome: decision.outcome,
      reason: decision.reason,
    }),
    "Restricted-resource access evaluated.",
  );

  return decision;
};
