# Domain package guidance

This file supplements the repository-level `CONSTITUTION.md` for `packages/domain`.

- Keep this package deterministic and framework-independent. It must not import HTTP, database, queue, environment, or provider SDK code.
- Model business state, invariants, value objects, and domain events here. Domain functions should return typed results or throw intentional domain errors, and never silently coerce invalid legal workflow state.
- Treat dates, calculations, AI-derived suggestions, and legal labels as provisional unless their approved source and reviewer are represented in the model.
- Every invariant change requires focused unit tests. Any requirement implementation must retain the requirement identifier in nearby tests or comments where it improves traceability.
