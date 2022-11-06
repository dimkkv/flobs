/*
  Warnings:

  - You are about to drop the column `address` on the `flashLoan` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `flashLoan` table. All the data in the column will be lost.
  - You are about to drop the column `other_assets` on the `flashLoan` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `flashLoan` table. All the data in the column will be lost.
  - Added the required column `assets_info` to the `flashLoan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flashLoan" DROP COLUMN "address",
DROP COLUMN "name",
DROP COLUMN "other_assets",
DROP COLUMN "symbol",
ADD COLUMN     "assets" TEXT[],
ADD COLUMN     "assets_info" TEXT NOT NULL;
