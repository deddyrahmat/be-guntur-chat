/*
  Warnings:

  - You are about to drop the column `user1_id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `user2_id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.
  - Added the required column `user_receiver_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_sender_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user1_id_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user2_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sender_id_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "user1_id",
DROP COLUMN "user2_id",
ADD COLUMN     "user_receiver_id" INTEGER NOT NULL,
ADD COLUMN     "user_sender_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sender_id",
DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "active";

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_sender_id_fkey" FOREIGN KEY ("user_sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_receiver_id_fkey" FOREIGN KEY ("user_receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
