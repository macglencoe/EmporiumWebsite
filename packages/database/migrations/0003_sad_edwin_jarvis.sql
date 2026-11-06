ALTER TABLE "change_set_items" DROP CONSTRAINT "change_set_items_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "change_set_items" ADD COLUMN "draft_key" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "change_set_items" ADD CONSTRAINT "change_set_items_draft_key_unique" UNIQUE("change_set_id","draft_key");