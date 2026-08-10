# Internal Contract: Bilingual Foundation Shell

**Routes:** `/` redirects to `/en`; `/en` and `/ar` are the only supported locale routes.

| Route              | Semantic document metadata                    | Required meaning                                                                       |
| ------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------- |
| `/en`              | `lang="en"`, `dir="ltr"`                      | Internal M0 engineering foundation; no legal workflow or public-service claim.         |
| `/ar`              | `lang="ar-EG"`, `dir="rtl"`                   | Arabic equivalent of the internal M0 meaning; mixed Arabic/Latin text remains legible. |
| unsupported locale | Safe rejection or redirect to supported route | No undefined/localized content is disclosed.                                           |

The shell uses the approved Portal asset and brand tokens. Its available link receives a visible keyboard focus state, and automated WCAG A/AA scanning is required. This contract is not a public website/content contract and grants no client access.
