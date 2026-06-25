/*
  Warnings:

  - Added the required column `user_id` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
