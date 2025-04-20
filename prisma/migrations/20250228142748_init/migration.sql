-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "completed" DROP NOT NULL,
ALTER COLUMN "completed" SET DEFAULT false;
