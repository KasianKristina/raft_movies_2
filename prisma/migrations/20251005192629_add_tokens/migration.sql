/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `AuthSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `AuthSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthSession" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_token_key" ON "AuthSession"("token");
