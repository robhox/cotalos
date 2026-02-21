ALTER TABLE "Commerce"
DROP CONSTRAINT IF EXISTS "Commerce_category_check";

ALTER TABLE "Commerce"
ADD CONSTRAINT "Commerce_category_check"
CHECK ("category" IN ('boucherie'));
