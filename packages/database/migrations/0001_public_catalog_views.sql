CREATE VIEW "public_products" WITH (security_barrier = true) AS
SELECT * FROM "products"
WHERE "published" = true AND "hidden" = false;
--> statement-breakpoint
CREATE VIEW "public_product_images" WITH (security_barrier = true) AS
SELECT image.* FROM "product_images" AS image
JOIN "products" AS product ON product."id" = image."product_id"
WHERE product."published" = true AND product."hidden" = false;
--> statement-breakpoint
CREATE VIEW "public_cigar_details" WITH (security_barrier = true) AS
SELECT detail.* FROM "cigar_details" AS detail
JOIN "products" AS product ON product."id" = detail."product_id"
WHERE product."published" = true AND product."hidden" = false;
--> statement-breakpoint
CREATE VIEW "public_cigar_variants" WITH (security_barrier = true) AS
SELECT variant.* FROM "cigar_variants" AS variant
JOIN "products" AS product ON product."id" = variant."product_id"
WHERE product."published" = true AND product."hidden" = false;
--> statement-breakpoint
CREATE VIEW "public_tobacco_details" WITH (security_barrier = true) AS
SELECT detail.* FROM "tobacco_details" AS detail
JOIN "products" AS product ON product."id" = detail."product_id"
WHERE product."published" = true AND product."hidden" = false;
--> statement-breakpoint
CREATE VIEW "public_tobacco_components" WITH (security_barrier = true) AS
SELECT component.* FROM "tobacco_components" AS component
JOIN "products" AS product ON product."id" = component."product_id"
WHERE product."published" = true AND product."hidden" = false;
--> statement-breakpoint
CREATE VIEW "public_pipe_details" WITH (security_barrier = true) AS
SELECT detail.* FROM "pipe_details" AS detail
JOIN "products" AS product ON product."id" = detail."product_id"
WHERE product."published" = true AND product."hidden" = false;
--> statement-breakpoint
CREATE VIEW "public_caffeine_details" WITH (security_barrier = true) AS
SELECT detail.* FROM "caffeine_details" AS detail
JOIN "products" AS product ON product."id" = detail."product_id"
WHERE product."published" = true AND product."hidden" = false;
