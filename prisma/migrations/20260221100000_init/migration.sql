-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "ImportRun" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" "ImportStatus" NOT NULL,
    "dataDir" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3),
    "extractTimestamp" TIMESTAMP(3),
    "rowsScanned" INTEGER NOT NULL DEFAULT 0,
    "rowsSelected" INTEGER NOT NULL DEFAULT 0,
    "rowsInserted" INTEGER NOT NULL DEFAULT 0,
    "rowsSkipped" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,

    CONSTRAINT "ImportRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commerce" (
    "id" TEXT NOT NULL,
    "establishmentNumber" TEXT NOT NULL,
    "enterpriseNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "naceVersion" TEXT NOT NULL,
    "naceCode" TEXT NOT NULL,
    "matchedNaceCodes" TEXT[] NOT NULL,
    "addressLine" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "source" TEXT NOT NULL,
    "sourceSnapshotDate" TIMESTAMP(3),
    "sourceExtractedAt" TIMESTAMP(3),
    "importRunId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commerce_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Commerce_category_check" CHECK ("category" = 'boucherie')
);

-- CreateIndex
CREATE INDEX "ImportRun_status_idx" ON "ImportRun"("status");

-- CreateIndex
CREATE INDEX "ImportRun_startedAt_idx" ON "ImportRun"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Commerce_establishmentNumber_key" ON "Commerce"("establishmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Commerce_slug_key" ON "Commerce"("slug");

-- CreateIndex
CREATE INDEX "Commerce_enterpriseNumber_idx" ON "Commerce"("enterpriseNumber");

-- CreateIndex
CREATE INDEX "Commerce_name_idx" ON "Commerce"("name");

-- CreateIndex
CREATE INDEX "Commerce_postalCode_idx" ON "Commerce"("postalCode");

-- CreateIndex
CREATE INDEX "Commerce_city_idx" ON "Commerce"("city");

-- AddForeignKey
ALTER TABLE "Commerce" ADD CONSTRAINT "Commerce_importRunId_fkey" FOREIGN KEY ("importRunId") REFERENCES "ImportRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
