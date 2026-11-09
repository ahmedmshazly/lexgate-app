# Web application guidance

This file supplements the repository-level `CONSTITUTION.md` for `apps/web`.

- Use the Next.js App Router and TypeScript. Keep route modules small and put reusable UI in `src/components`.
- Default to Server Components. Add `"use client"` only for an actual browser interaction, and keep authorization and privileged data access on the server.
- Validate locale values at the routing boundary. All user-facing text must have both English and Arabic representations, and Arabic surfaces must use RTL-aware layout and logical CSS properties.
- Do not make legal conclusions in the interface. Display system-derived information as proposed, pending review, or approved only when the corresponding authoritative state supports it.
- Use `@lexgate/brand` design tokens rather than introducing unreviewed colours, typography, or logo variants. Preserve the Portal mark clear space and accessibility requirements in `docs/brand/BRAND_SYSTEM.md`.
- Add or update Playwright coverage for material route, locale, or access-control changes. Run the web lint, typecheck, test, build, and relevant browser checks before handoff.
