/*
  Warnings:

  - You are about to drop the column `destinationId` on the `plans` table. All the data in the column will be lost.
  - The `emailVerified` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[providerId,accountId]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - Made the column `providerId` on table `account` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."plans" DROP CONSTRAINT "plans_destinationId_fkey";

-- DropIndex
DROP INDEX "public"."account_userId_providerId_key";

-- AlterTable
ALTER TABLE "public"."account" ALTER COLUMN "providerId" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."plans" DROP COLUMN "destinationId",
ADD COLUMN     "section" TEXT NOT NULL DEFAULT 'planes';

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "password" TEXT,
DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."assets" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "title" TEXT,
    "alt" TEXT,
    "folder" TEXT NOT NULL DEFAULT 'uploads',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assets_key_key" ON "public"."assets"("key");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "public"."account"("providerId", "accountId");
