# Self-hosted brand typography

Families required by [`docs/brand/BRAND_SYSTEM.md`](../../../../docs/brand/BRAND_SYSTEM.md), self-hosted as `woff2` so
application and design-system rendering do not depend on a third-party font host.

| Family                 | Role in the brand system    |
| ---------------------- | --------------------------- |
| `Instrument Sans`      | Application UI              |
| `Newsreader`           | English display / editorial |
| `IBM Plex Sans Arabic` | Arabic UI                   |
| `Noto Naskh Arabic`    | Arabic display / editorial  |
| `IBM Plex Mono`        | Metadata                    |

Load them with `@import "./fonts.css";`, every `src:` is a relative path inside this directory.

Subsets are deliberately narrow: `latin` + `latin-ext` for the Latin families, `arabic` + `latin` for the Arabic
families. Weights are limited to those the brand system actually calls for. Regenerate rather than hand-edit:
`fonts.css` is generated, and adding a weight means re-running the font fetch.

## Licensing

All five families are licensed under the **SIL Open Font License, Version 1.1**, which permits redistribution and
self-hosting provided the fonts are not sold on their own and the license notice is retained.

- Instrument Sans — Copyright The Instrument Sans Project Authors
- Newsreader — Copyright The Newsreader Project Authors
- IBM Plex Sans Arabic, IBM Plex Mono — Copyright IBM Corp.
- Noto Naskh Arabic — Copyright The Noto Project Authors

License text: <https://openfontlicense.org/open-font-license-official-text/>

Per `docs/brand/BRAND_SYSTEM.md`, do not substitute unlicensed fonts for these families.
