import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const code = uuidv4().split('-')[0].toUpperCase() + '-' + uuidv4().split('-')[1].toUpperCase();
  
  const invite = await prisma.inviteCode.create({
    data: {
      code,
    },
  });

  console.log('✅ Novo código de convite gerado!');
  console.log('==================================');
  console.log(`Código: ${invite.code}`);
  console.log('==================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
