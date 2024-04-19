-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "active" SET DEFAULT true;
