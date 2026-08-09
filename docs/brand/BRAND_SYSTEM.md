# Lex Gate Brand System

**Document ID:** LG-BRAND-001  
**Version:** 1.0.0  
**Status:** Approved for M0 implementation  
**Owner:** Brand owner

## Brand position

Lex Gate is a serious law firm with exceptionally good digital systems, not a software company that happens to do law. The visual system communicates authority, discretion, clarity, and measured confidence. Gold is a controlled accent, not decoration.

## Identity decisions

- **Primary digital mark:** Portal.
- **Alternate controlled marks:** Keystone and Seal; use only in documented contexts.
- **Primary lockup:** Horizontal mark/wordmark lockup.
- **Working languages:** English and Arabic, with direction and typography appropriate to each.
- **Client-facing default surface:** Formal Ivory; restricted material must retain persistent classification, not merely decorative color.

## Core tokens

| Token               | Value     | Use                              |
| ------------------- | --------- | -------------------------------- |
| `--lg-navy-900`     | `#0E1C30` | Primary brand surface            |
| `--lg-navy-950`     | `#0A1524` | Deep emphasis                    |
| `--lg-gold-700`     | `#A07C2A` | Reserved accent                  |
| `--lg-gold-600`     | `#B8913C` | Focus and controlled emphasis    |
| `--lg-ivory`        | `#F7F3EA` | Brand on-dark / subtle surface   |
| `--lg-warm-white`   | `#FCFAF6` | Default client-facing ground     |
| `--lg-ink`          | `#16171B` | Primary text                     |
| `--lg-confidential` | `#59304F` | Confidential classification      |
| `--lg-restricted`   | `#42284A` | Highly restricted classification |

## Typography

Use Instrument Sans for application UI; Newsreader for English display/editorial use; IBM Plex Sans Arabic for Arabic UI; Noto Naskh Arabic for Arabic display/editorial use; IBM Plex Mono for metadata. Maintain semantic language and direction rather than relying on visual reversal.

## Accessibility and content safeguards

All color choices need text/icon/pattern reinforcement where meaning is material. Focus uses visible gold contrast. Motion respects reduced-motion preferences. Icons name functions, not professions. Public legal content, testimonials, case studies, outcome language, and lawyer profiles require the applicable legal/content approval gate.

## Asset provenance

The supplied `Brand Identity Upgrade Request (1)` directory remains the source bundle. Curated production-safe assets and code tokens are exposed by `packages/brand`; do not edit legacy vectors or substitute unlicensed marks/fonts.
