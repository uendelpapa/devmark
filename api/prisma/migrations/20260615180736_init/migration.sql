-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('LEAD', 'NEGOTIATING', 'ACTIVE', 'INACTIVE', 'LOST');

-- CreateEnum
CREATE TYPE "CommunicationType" AS ENUM ('WHATSAPP', 'EMAIL', 'PHONE', 'MEETING');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'BANK_TRANSFER', 'CREDIT_CARD', 'CASH');

-- CreateEnum
CREATE TYPE "ProjectArea" AS ENUM ('MARKETING', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'WAITING_CLIENT', 'REVIEW', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'OVERDUE', 'PAID', 'CANCELED');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('AI', 'SOFTWARE', 'DOMAIN', 'HOSTING', 'DESIGN', 'ADS', 'FREELANCER', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'VIDEO', 'PDF', 'DOCUMENT', 'SPREADSHEET', 'DESIGN', 'OTHER');

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "company_name" VARCHAR(255),
    "document" VARCHAR(30),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "website" VARCHAR(255),
    "instagram" VARCHAR(255),
    "linkedin" VARCHAR(255),
    "industry" VARCHAR(100),
    "source" VARCHAR(100),
    "status" "ClientStatus" NOT NULL DEFAULT 'LEAD',
    "preferred_communication" "CommunicationType" NOT NULL DEFAULT 'WHATSAPP',
    "preferred_payment_method" "PaymentMethod" NOT NULL DEFAULT 'PIX',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "area" "ProjectArea" NOT NULL,
    "specialty" VARCHAR(100),
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "project_value" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "amount_received" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "amount_pending" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estimated_hours" INTEGER,
    "worked_hours" INTEGER NOT NULL DEFAULT 0,
    "start_date" DATE,
    "expected_delivery_date" DATE,
    "delivery_date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "estimated_hours" INTEGER,
    "worked_hours" INTEGER NOT NULL DEFAULT 0,
    "expected_value" DECIMAL(12,2),
    "received_value" DECIMAL(12,2),
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "due_date" DATE NOT NULL,
    "payment_date" DATE,
    "payment_method" "PaymentMethod",
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_expenses" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" "ExpenseCategory" NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_expenses" (
    "id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" "ExpenseCategory" NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "task_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "type" "AssetType" NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "project_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tags" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_entries" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "project_tags_project_id_name_key" ON "project_tags"("project_id", "name");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_expenses" ADD CONSTRAINT "project_expenses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_expenses" ADD CONSTRAINT "task_expenses_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
