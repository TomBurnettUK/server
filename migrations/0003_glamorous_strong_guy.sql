ALTER TABLE "users" ADD COLUMN "hashed_password" varchar;
UPDATE "users" SET "hashed_password" = 'unset' WHERE "hashed_password" is NULL;
ALTER TABLE "users" ALTER COLUMN "hashed_password" SET NOT NULL;