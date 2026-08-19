# Phase 3 Legacy-Data Validation Report

Generated from the repository snapshots on 2026-08-19 with `npm run validate:legacy`.

## Outcome

Every record in both applications maps to and validates against the canonical domain model.

| Snapshot | Type | Valid records | Variants | Warnings | Errors |
| --- | --- | ---: | ---: | ---: | ---: |
| Public | Cigar | 551 / 551 | 750 | 67 | 0 |
| Public | Tobacco | 70 / 70 | 0 | 2 | 0 |
| Public | Pipe | 14 / 14 | 0 | 0 | 0 |
| Public | Caffeine | 27 / 27 | 0 | 0 | 0 |
| Admin | Cigar | 551 / 551 | 750 | 67 | 0 |
| Admin | Tobacco | 70 / 70 | 0 | 2 | 0 |
| Admin | Pipe | 14 / 14 | 0 | 0 | 0 |
| Admin | Caffeine | 24 / 24 | 0 | 0 | 0 |

The cigar, tobacco, and pipe snapshots are byte-identical between applications, so their warnings are the same rather than separate defects. Public caffeine is authoritative and contains three products absent from admin: `cultivate-sumatra`, `cultivate-honduras`, and `cultivate-decaf`.

## Warning summary

| Warning | Count in each authoritative catalog | Migration treatment |
| --- | ---: | --- |
| Stored slug differs from generated slug | 55 | Preserve the stored slug to avoid route breakage; review only if redirects are planned. |
| Missing cigar variant size | 8 | Retain with `size=null`; resolve before making the database column non-null. |
| Duplicate barcode | 3 values | Retain and review before adding a uniqueness constraint. |
| Cigar without variants | 1 | Retain the product; confirm whether a variant should be added. |
| Missing stock status | 1 | Normalize to `false` and flag for review. |
| Price formatting | 1 | Normalize `12.5` to `12.50`. |

## Variant warnings

| Product slug | Variant | Warning |
| --- | ---: | --- |
| `esteban-carrera-cashmere` | 1 | Missing size label |
| `esteban-carrera-cashmere` | 2 | Missing size label |
| `esteban-carrera-esteban-carrera-mr-brownstone` | 1 | Missing size label |
| `j-c-newman-decision-550` | 1 | Missing size label |
| `j-c-newman-don-jose-granada` | 1 | Missing size label |
| `j-c-newman-don-jose-grandee` | 1 | Missing size label |
| `joya-de-nicaragua-robusta` | 1 | Missing size label |
| `gurkha-volition-america-maduro` | 1 | Missing size label and stock status; stock normalizes to `false` |
| `romacraft-cromagnon-aquataine` | 1 | Price `12.5` normalizes to `12.50` |

`perla-del-mar-double-toro` has no variants.

## Duplicate barcodes

| Barcode | Products |
| --- | --- |
| `843182122111` | `arturo-fuente-don-carlos-eye-of-the-bull`, `arturo-fuente-eye-of-the-bull` |
| `843182122630` | `arturo-fuente-hemingway-signature-maduro`, `arturo-fuente-signature-maduro` |
| `7460644702709` | `la-flor-dominicana-cabinet-oscuro-l-300`, `la-flor-dominicana-l300-natural` |

## Preserved slug differences

These are warnings, not proposed automatic renames. Some reveal intentional route conventions, punctuation differences, historical typos, or names that changed after the route was established.

| Stored route slug | Current generator output |
| --- | --- |
| `arturo-fuente-don-carlos-no-3` | `arturo-fuente-don-carlos-no3` |
| `c-l-e-25th-anniversary` | `cle-25th-anniversary` |
| `c-l-e-cbt` | `cle-cbt` |
| `drew-estate-acid-cnotes` | `drew-estate-acid-c-notes` |
| `drew-estate-undercrown-all-dekk-d-out` | `drew-estate-undercrown-all-dekkd-out` |
| `e-p-carrillo-allegiance-robusto` | `ep-carrillo-allegiance-robusto` |
| `e-p-carrillo-allegiance-toro` | `ep-carrillo-allegiance-toro` |
| `e-p-carrillo-new-wave-connecticut` | `ep-carrillo-new-wave-connecticut` |
| `e-p-carrillo-new-wave-connecticut-brilliantes` | `ep-carrillo-new-wave-connecticut-divinos` |
| `e-p-carrillo-new-wave-connecticut-divino` | `ep-carrillo-new-wave-connecticut-brilliantes` |
| `eiroia-the-first-20` | `eiroa-the-first-20` |
| `j-c-newman-angel-cuesta` | `jc-newman-angel-cuesta` |
| `j-c-newman-black-diamond` | `jc-newman-black-diamond` |
| `j-c-newman-brickhouse-double-connecticut` | `jc-newman-brickhouse-double-connecticut` |
| `j-c-newman-brick-house-conn-mighty-mighty` | `jc-newman-brick-house-conn-mighty-mighty` |
| `j-c-newman-brickhouse-maduro` | `jc-newman-brickhouse-maduro` |
| `j-c-newman-brickhouse-sungrown` | `jc-newman-brickhouse-sungrown` |
| `j-c-newman-brickhouse-sungrown-corona-larga` | `jc-newman-brickhouse-sungrown-corona-larga` |
| `j-c-newman-cuesta-rey-no-60` | `jc-newman-cuesta-rey-no60` |
| `j-c-newman-cuesta-rey-no-7` | `jc-newman-cuesta-rey-no7` |
| `j-c-newman-cuesta-rey-sungrown` | `jc-newman-cuesta-rey-sungrown` |
| `j-c-newman-decision-550` | `jc-newman-decision-550` |
| `j-c-newman-diamond-crown-3` | `jc-newman-diamond-crown-3` |
| `j-c-newman-diamond-crown-5` | `jc-newman-diamond-crown-5` |
| `j-c-newman-diamond-crown-maduro-5` | `jc-newman-diamond-crown-maduro-5` |
| `j-c-newman-diamond-crown-maximus-4` | `jc-newman-diamond-crown-maximus-4` |
| `j-c-newman-diamond-crown-maximus-5` | `jc-newman-diamond-crown-maximus-5` |
| `j-c-newman-don-jose-granada` | `jc-newman-don-jose-granada` |
| `j-c-newman-don-jose-grandee` | `jc-newman-don-jose-grandee` |
| `j-c-newman-el-baton` | `jc-newman-el-baton` |
| `j-c-newman-factory-49` | `jc-newman-factory-49` |
| `j-c-newman-factory-49-sweet` | `jc-newman-factory-49-sweet` |
| `j-c-newman-factory-59` | `jc-newman-factory-59` |
| `j-c-newman-factory-59-sweet` | `jc-newman-factory-59-sweet` |
| `j-c-newman-factory-99` | `jc-newman-factory-99` |
| `j-c-newman-factory-99-sweet` | `jc-newman-factory99-sweet` |
| `j-c-newman-house-handmade-maduro-5x56` | `jc-newman-house-handmade-maduro-5x56` |
| `j-c-newman-house-handmade-maduro-6x54` | `jc-newman-house-handmade-maduro-6x54` |
| `j-c-newman-house-handmade-maduro-6x60` | `jc-newman-house-handmade-maduro-6x60` |
| `j-c-newman-house-handmade-shade-5x56` | `jc-newman-house-handmade-shade-5x56` |
| `j-c-newman-house-handmade-shade-6x54` | `jc-newman-house-handmade-shade-6x54` |
| `j-c-newman-house-handmade-shade-6x60` | `jc-newman-house-handmade-shade-6x60` |
| `j-c-newman-julius-caesar` | `jc-newman-julius-caesar` |
| `j-c-newman-la-unica-600-maduro` | `jc-newman-la-unica-600-maduro` |
| `j-c-newman-la-unica-connecticut` | `jc-newman-la-unica-connecticut` |
| `j-c-newman-yagua` | `jc-newman-yagua` |
| `la-aroma-de-cuba-edition-especial-no-2` | `la-aroma-de-cuba-edition-especial-no2` |
| `la-flor-dominicana-double-ligero-dl654` | `la-flor-dominicana-double-ligero-dl-654` |
| `montecristo-classic-yellow-label-no-3` | `montecristo-classic-yellow-label-no3` |
| `oliva-serie-v-no-4` | `oliva-serie-v-no4` |
| `arturo-fuente-858-rosado-sungrown` | `arturo-fuente-8-5-8-rosado-sungrown` |
| `la-flor-dominicana-cabinet-oscar-natural-l250` | `la-flor-dominicana-cabinet-oscar-natural-l-250` |
| `la-flor-dominicana-l300-natural` | `la-flor-dominicana-l-300-natural` |
| `neopolitan` | `neapolitan` |
| `grousemoor` | `grouse-moor` |

## Reproduction

Run the checked-in validator after any legacy catalog update:

```powershell
npm run validate:legacy
```

For complete structured warning objects, including source indexes and paths:

```powershell
node packages/domain/scripts/validate-legacy-data.js --json
```
