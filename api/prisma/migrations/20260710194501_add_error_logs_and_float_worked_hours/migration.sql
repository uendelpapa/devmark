-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('ERROR', 'WARN', 'INFO');

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "worked_hours" SET DEFAULT 0,
ALTER COLUMN "worked_hours" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "worked_hours" SET DEFAULT 0,
ALTER COLUMN "worked_hours" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "error_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "level" "LogLevel" NOT NULL DEFAULT 'ERROR',
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "url" VARCHAR(500),
    "user_agent" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "error_logs_user_id_idx" ON "error_logs"("user_id");

-- CreateIndex
CREATE INDEX "error_logs_created_at_idx" ON "error_logs"("created_at");

-- CreateIndex
CREATE INDEX "error_logs_level_idx" ON "error_logs"("level");

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
