CREATE TABLE "admin_auth_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor" text DEFAULT 'store-admin' NOT NULL,
	"action" text NOT NULL,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_auth_events_actor_not_blank" CHECK (length(trim("admin_auth_events"."actor")) > 0),
	CONSTRAINT "admin_auth_events_action_not_blank" CHECK (length(trim("admin_auth_events"."action")) > 0)
);
--> statement-breakpoint
CREATE TABLE "admin_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"credential_version" integer DEFAULT 1 NOT NULL,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"password_changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_credentials_username_unique" UNIQUE("username"),
	CONSTRAINT "admin_credentials_username_not_blank" CHECK (length(trim("admin_credentials"."username")) > 0),
	CONSTRAINT "admin_credentials_version_positive" CHECK ("admin_credentials"."credential_version" > 0),
	CONSTRAINT "admin_credentials_failed_attempts_nonnegative" CHECK ("admin_credentials"."failed_attempts" >= 0)
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"credential_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"credential_version" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "admin_sessions_token_hash_unique" UNIQUE("token_hash"),
	CONSTRAINT "admin_sessions_version_positive" CHECK ("admin_sessions"."credential_version" > 0)
);
--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_credential_id_admin_credentials_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."admin_credentials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_auth_events_created_idx" ON "admin_auth_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "admin_sessions_credential_idx" ON "admin_sessions" USING btree ("credential_id");--> statement-breakpoint
CREATE INDEX "admin_sessions_expiry_idx" ON "admin_sessions" USING btree ("expires_at");