# Data Model: Brand System Implementation

This feature introduces **no persistence**. There is no table, migration, projection, or ledger. The entities below are build-time and render-time structures held in committed source. They are recorded here because the specification names them and because their validation rules are what the tests assert.

## Entity — Brand token

One named, approved brand value with exactly one authoritative definition.

| Field   | Type                            | Notes                                                            |
| ------- | ------------------------------- | ---------------------------------------------------------------- |
| `name`  | token key                       | Stable identifier; maps to a custom property name by convention. |
| `value` | colour, length, or family stack | Quoted from LG-BRAND-001. A colour is lowercase hexadecimal.     |
| `group` | `color` \| `radius` \| `font`   | Determines the generated declaration's placement and formatting. |

**Validation rules**

- Every token named in LG-BRAND-001 is present. A missing token fails the parity test.
- No token value is defined in more than one place. The stylesheet is generated, never hand-edited.
- Custom property names derive from token keys deterministically, so the generated stylesheet is reproducible byte-for-byte.
- A generated stylesheet that differs from the committed one fails the parity test.

**Derived representations**: the typed record (programmatic consumers) and the generated stylesheet (style consumers). Both derive from the same source, so they cannot disagree.

## Entity — Typography role assignment

The binding of a typographic role and a script to an ordered stack of approved families.

| Field      | Type                        | Notes                                                                                                        |
| ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `role`     | `ui` \| `display` \| `mono` | The purpose LG-BRAND-001 assigns.                                                                            |
| `script`   | `latin` \| `arabic`         | Selected semantically by `:lang`, never by direction or a class.                                             |
| `families` | ordered list                | Approved family for the script, then the approved family of the opposite script, then a same-script generic. |

**Validation rules**

- Every family named is one of the five approved in LG-BRAND-001.
- Every stack terminates in a generic of the correct script, so a load failure degrades legibly.
- The opposite-script approved family precedes the generic, so a mixed Arabic/Latin string resolves per glyph across approved faces before reaching a system font.

## Entity — Curated asset

An approved mark or typeface admitted into the repository.

| Field     | Type            | Notes                                                                |
| --------- | --------------- | -------------------------------------------------------------------- |
| `file`    | repository path | The committed artifact.                                              |
| `source`  | source filename | The approved file in the brand source bundle it was taken from.      |
| `sha256`  | hex digest      | Of the committed file, recomputed and compared by test.              |
| `use`     | text            | The intended context, quoted from LG-BRAND-001.                      |
| `licence` | text or `null`  | Required for a redistributed typeface; `null` for a firm-owned mark. |

**Validation rules**

- Every curated asset has a manifest entry; every manifest entry resolves to a committed file.
- The recomputed digest matches the recorded one. A mismatch means the asset was altered or substituted and fails the provenance test.
- Every typeface entry names a licence permitting self-hosting, with attribution recorded.
- No curated asset is duplicated outside `packages/brand`.

## Relationships

A typography role assignment references approved families, which are realised by curated assets of kind typeface. A brand token of group `font` carries a role assignment's family stack as its value. Curated assets of kind mark are referenced by application components through the package export, never by a public path.

## State transitions

None. These structures have no lifecycle at runtime. They change only by an authored commit, and any change to an approved value requires a corresponding change to LG-BRAND-001 first, since the document is the controlling authority and this feature has no latitude to decide brand questions.
