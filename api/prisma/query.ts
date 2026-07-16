import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- DIAGNOSTIC DATA ---');
  
  // 1. Projects
  const projectsCount = await prisma.project.count();
  console.log(`Total Projects: ${projectsCount}`);
  
  // 2. Payments
  const payments = await prisma.payment.findMany();
  console.log(`Total Payments: ${payments.length}`);
  const paidPayments = payments.filter(p => p.status === 'PAID');
  console.log('PAID payments:');
  paidPayments.forEach(p => console.log(` - Project ID: ${p.project_id}, Amount: ${p.amount}, Date: ${p.payment_date}`));
  
  const pendingPayments = payments.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE');
  console.log('PENDING/OVERDUE payments:');
  pendingPayments.forEach(p => console.log(` - Project ID: ${p.project_id}, Amount: ${p.amount}, Date: ${p.due_date}, Status: ${p.status}`));

  // 3. Project Expenses
  const pExpenses = await prisma.projectExpense.findMany();
  console.log(`Total Project Expenses: ${pExpenses.length}`);
  pExpenses.forEach(e => console.log(` - Project ID: ${e.project_id}, Category: ${e.category}, Value: ${e.value}`));

  // 4. Task Expenses
  const tExpenses = await prisma.taskExpense.findMany();
  console.log(`Total Task Expenses: ${tExpenses.length}`);
  tExpenses.forEach(e => console.log(` - Task ID: ${e.task_id}, Category: ${e.category}, Value: ${e.value}`));

  // 5. Time Entries
  const timeEntriesCount = await prisma.timeEntry.count();
  console.log(`Total Time Entries: ${timeEntriesCount}`);
  const timeEntries = await prisma.timeEntry.findMany();
  timeEntries.forEach(entry => console.log(` - Start: ${entry.start_time}, End: ${entry.end_time}, Duration: ${entry.duration}`));
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
