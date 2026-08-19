CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'delete', 'publish', 'image_upload', 'image_delete');--> statement-breakpoint
CREATE TYPE "public"."caffeine_type" AS ENUM('Coffee', 'Tea');--> statement-breakpoint
CREATE TYPE "public"."change_operation" AS ENUM('create', 'update', 'delete');--> statement-breakpoint
CREATE TYPE "public"."change_set_status" AS ENUM('draft', 'published', 'discarded');--> statement-breakpoint
CREATE TYPE "public"."cigar_strength" AS ENUM('Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('cigar', 'tobacco', 'pipe', 'caffeine');--> statement-breakpoint
CREATE TYPE "public"."tobacco_sale_form" AS ENUM('Bulk', 'Tin');--> statement-breakpoint
CREATE TABLE "caffeine_details" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"roast" text,
	"origin" text,
	"type" "caffeine_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cigar_details" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"wrapper" text,
	"binder" text,
	"filler" text,
	"flavor_profile" text,
	"strength" "cigar_strength",
	"podcast_link" text,
	"eds_pick_at" date,
	"teds_pick_at" date,
	"stick_figures_at" date
);
--> statement-breakpoint
CREATE TABLE "cigar_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"size" text,
	"barcode" text,
	"in_stock" boolean DEFAULT false NOT NULL,
	"price" numeric(10, 2),
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "cigar_variants_size_not_blank" CHECK ("cigar_variants"."size" is null or length(trim("cigar_variants"."size")) > 0),
	CONSTRAINT "cigar_variants_barcode_not_blank" CHECK ("cigar_variants"."barcode" is null or length(trim("cigar_variants"."barcode")) > 0),
	CONSTRAINT "cigar_variants_price_nonnegative" CHECK ("cigar_variants"."price" is null or "cigar_variants"."price" >= 0),
	CONSTRAINT "cigar_variants_sort_order_nonnegative" CHECK ("cigar_variants"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "pipe_details" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"material" text NOT NULL,
	"pipe_type" text
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_images_product_url_unique" UNIQUE("product_id","url"),
	CONSTRAINT "product_images_url_not_blank" CHECK (length(trim("product_images"."url")) > 0),
	CONSTRAINT "product_images_sort_order_nonnegative" CHECK ("product_images"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "product_type" NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"brand" text,
	"description" text,
	"image_url" text,
	"hidden" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"date_added" date,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_slug_not_blank" CHECK (length(trim("products"."slug")) > 0),
	CONSTRAINT "products_name_not_blank" CHECK (length(trim("products"."name")) > 0),
	CONSTRAINT "products_description_length" CHECK ("products"."description" is null or length("products"."description") <= 2000),
	CONSTRAINT "products_version_positive" CHECK ("products"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "tobacco_components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"component" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "tobacco_components_product_component_unique" UNIQUE("product_id","component"),
	CONSTRAINT "tobacco_components_component_not_blank" CHECK (length(trim("tobacco_components"."component")) > 0),
	CONSTRAINT "tobacco_components_sort_order_nonnegative" CHECK ("tobacco_components"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "tobacco_details" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"family" text,
	"sale_form" "tobacco_sale_form"
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"change_set_id" uuid,
	"product_id" uuid,
	"actor" text DEFAULT 'store-admin' NOT NULL,
	"action" "audit_action" NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audit_events_actor_not_blank" CHECK (length(trim("audit_events"."actor")) > 0)
);
--> statement-breakpoint
CREATE TABLE "change_set_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"change_set_id" uuid NOT NULL,
	"product_id" uuid,
	"operation" "change_operation" NOT NULL,
	"base_version" integer,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "change_set_items_shape" CHECK ((
        ("change_set_items"."operation" = 'create' and "change_set_items"."product_id" is null and "change_set_items"."base_version" is null and "change_set_items"."payload" is not null)
        or ("change_set_items"."operation" = 'update' and "change_set_items"."product_id" is not null and "change_set_items"."base_version" > 0 and "change_set_items"."payload" is not null)
        or ("change_set_items"."operation" = 'delete' and "change_set_items"."product_id" is not null and "change_set_items"."base_version" > 0 and "change_set_items"."payload" is null)
      ))
);
--> statement-breakpoint
CREATE TABLE "change_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "change_set_status" DEFAULT 'draft' NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "change_sets_message_not_blank" CHECK ("change_sets"."message" is null or length(trim("change_sets"."message")) > 0)
);
--> statement-breakpoint
ALTER TABLE "caffeine_details" ADD CONSTRAINT "caffeine_details_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cigar_details" ADD CONSTRAINT "cigar_details_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cigar_variants" ADD CONSTRAINT "cigar_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipe_details" ADD CONSTRAINT "pipe_details_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tobacco_components" ADD CONSTRAINT "tobacco_components_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tobacco_details" ADD CONSTRAINT "tobacco_details_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_change_set_id_change_sets_id_fk" FOREIGN KEY ("change_set_id") REFERENCES "public"."change_sets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_set_items" ADD CONSTRAINT "change_set_items_change_set_id_change_sets_id_fk" FOREIGN KEY ("change_set_id") REFERENCES "public"."change_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_set_items" ADD CONSTRAINT "change_set_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cigar_variants_product_idx" ON "cigar_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "cigar_variants_barcode_idx" ON "cigar_variants" USING btree ("barcode");--> statement-breakpoint
CREATE UNIQUE INDEX "product_images_one_primary_per_product" ON "product_images" USING btree ("product_id") WHERE "product_images"."is_primary";--> statement-breakpoint
CREATE INDEX "product_images_product_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "products_type_idx" ON "products" USING btree ("type");--> statement-breakpoint
CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "products_visibility_idx" ON "products" USING btree ("type","published","hidden");--> statement-breakpoint
CREATE INDEX "products_date_added_idx" ON "products" USING btree ("date_added");--> statement-breakpoint
CREATE INDEX "tobacco_components_product_idx" ON "tobacco_components" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "audit_events_change_set_idx" ON "audit_events" USING btree ("change_set_id");--> statement-breakpoint
CREATE INDEX "audit_events_product_created_idx" ON "audit_events" USING btree ("product_id","created_at");--> statement-breakpoint
CREATE INDEX "change_set_items_change_set_idx" ON "change_set_items" USING btree ("change_set_id");--> statement-breakpoint
CREATE INDEX "change_set_items_product_idx" ON "change_set_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "change_sets_status_updated_idx" ON "change_sets" USING btree ("status","updated_at");