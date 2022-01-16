/*
  Warnings:

  - A unique constraint covering the columns `[tweetId]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tweet_tweetId_key" ON "Tweet"("tweetId");
