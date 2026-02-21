-- CreateTable
CREATE TABLE "CommerceInterest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "fullNameNormalized" TEXT NOT NULL,
    "commerceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommerceInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommerceInterest_commerceId_fullNameNormalized_key" ON "CommerceInterest"("commerceId", "fullNameNormalized");

-- CreateIndex
CREATE INDEX "CommerceInterest_commerceId_createdAt_idx" ON "CommerceInterest"("commerceId", "createdAt");

-- AddForeignKey
ALTER TABLE "CommerceInterest" ADD CONSTRAINT "CommerceInterest_commerceId_fkey" FOREIGN KEY ("commerceId") REFERENCES "Commerce"("id") ON DELETE CASCADE ON UPDATE CASCADE;
