/*
  Warnings:

  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "adminStatus" "AdminStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "userStatus" "Status" NOT NULL DEFAULT 'INPROGRESS';
