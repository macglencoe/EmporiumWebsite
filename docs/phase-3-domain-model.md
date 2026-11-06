# Phase 3 Shared Domain Model

Completed on 2026-08-19 on `migration/admin-neon`.

## Result

`packages/domain` is the database-independent contract shared by the future public queries, admin forms, API endpoints, migrations, and import/export tooling. It uses Zod runtime validation and supplies matching TypeScript declarations while the applications remain JavaScript-based.

The canonical model is a discriminated union on `type`:

| Type | Common fields | Type-specific fields |
| --- | --- | --- |
| Cigar | ID, slug, name, brand, description, image, visibility, publication, version, dates | Wrapper, binder, filler, flavor profile, strength, podcast, featured dates, variants |
| Tobacco | Same common fields | Family, sale form, components |
| Pipe | Same common fields | Material and pipe type |
| Caffeine | Same common fields | Roast, origin, and coffee/tea type |

Cigar variants have their own UUID, nullable size and barcode, explicit stock status, and a two-decimal price string. Size remains nullable temporarily because eight real variants lack labels. Barcode remains non-unique temporarily because three duplicate values require business review.

## Identity and slugs

Product identity no longer depends on a mutable slug or browser-generated `_clientId`:

- Existing products receive deterministic UUIDv5 IDs from product type and preserved legacy slug.
- Cigar variants receive deterministic UUIDv5 IDs from their product, source position, size, and barcode.
- Re-running an import produces the same IDs.
- Canonical and change-set schemas contain no `_clientId` or `new-slug` fields.
- Slug changes are normal updates to a product with a stable ID.
- Existing valid slugs are preserved to avoid breaking public routes; differences from the centralized generator are warnings.

The active Git/localStorage admin still carries its compatibility fields until its persistence layer is replaced in Phase 7. They do not cross the new domain boundary.

## Validation contracts

The package exports validators for:

- canonical products and each product subtype;
- admin product input without database-managed identity/version fields;
- public results, which must be published and not hidden;
- create, update, and delete change-set items;
- complete change sets with optimistic `baseVersion` values.

Dates are validated as real `YYYY-MM-DD` calendar dates. URLs, UUIDs, slugs, barcodes, prices, enumerations, booleans, and required names are typed rather than accepted as arbitrary strings.

## Legacy compatibility boundary

Import mappings translate display-oriented legacy names such as `Cigar Brand`, `Date Added`, `Strength_Profile`, `Sizes`, `In_Stock`, and `Price` into canonical fields. Export mappings translate canonical records back to legacy JSON without leaking IDs, versions, or database-oriented fields.

Import behavior is intentionally conservative:

- valid legacy slugs are retained;
- blank optional strings become `null`;
- missing collections become empty arrays;
- prices are normalized to two decimal places;
- unknown fields and browser-only IDs produce warnings;
- invalid canonical values produce errors rather than being discarded;
- duplicate slug and barcode checks run at catalog scope.

## Phase boundary

This phase defines values and validation only. It does not add Neon, Drizzle, database tables, or production reads and writes. Phase 4 will translate these contracts into relational columns and migrations.
