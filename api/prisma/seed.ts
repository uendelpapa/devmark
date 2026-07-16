import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- STARTING DATABASE SEED ---');

  // 1. Reset Database in Dependency Order (except Users/Auth)
  console.log('Resetting existing database records (except users)...');
  await prisma.timeEntry.deleteMany({});
  await prisma.subtask.deleteMany({});
  await prisma.taskExpense.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.projectExpense.deleteMany({});
  await prisma.projectTag.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.client.deleteMany({});

  // 1.5 Fetch or Create User
  console.log('Fetching existing users...');
  let users = await prisma.user.findMany();
  
  if (users.length === 0) {
    console.log('No users found. Creating default user...');
    const passwordHash = await bcrypt.hash('senha123', 12);
    const defaultUser = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'teste@teste.com',
        password_hash: passwordHash,
      }
    });
    users = [defaultUser];
  }

  // Helpers for historical date generation
  const getDateOffset = (monthsAgo: number, day: number = 10, hour: number = 12) => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo);
    d.setDate(day);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  for (const user of users) {
    console.log(`\n--- Seeding rich historical data for user: ${user.email} ---`);

    // 2. Seed Clients (to populate CRM Funnel)
    console.log('Seeding clients (CRM Funnel)...');
    const clientsData = [
      // Active Clients (5)
      { name: 'Alice Smith', company_name: 'TechStart', document: '11.111.111/0001-11', email: `alice_${user.id.split('-')[0]}@techstart.com`, phone: '11999999991', status: 'ACTIVE' },
      { name: 'Bob Johnson', company_name: 'DesignFlow', document: '22.222.222/0001-22', email: `bob_${user.id.split('-')[0]}@designflow.com`, phone: '11999999992', status: 'ACTIVE' },
      { name: 'Charlie Brown', company_name: 'MarketGrowth', document: '33.333.333/0001-33', email: `charlie_${user.id.split('-')[0]}@marketgrowth.com`, phone: '11999999993', status: 'ACTIVE' },
      { name: 'Diana Prince', company_name: 'WayneEnt', document: '44.444.444/0001-44', email: `diana_${user.id.split('-')[0]}@wayneent.com`, phone: '11999999994', status: 'ACTIVE' },
      { name: 'Evan Wright', company_name: 'BetaCorp', document: '55.555.555/0001-55', email: `evan_${user.id.split('-')[0]}@betacorp.com`, phone: '11999999995', status: 'ACTIVE' },
      
      // Leads (4)
      { name: 'Fiona Gallagher', company_name: 'SouthSide LLC', document: '66.666.666/0001-66', email: `fiona_${user.id.split('-')[0]}@southside.com`, phone: '11999999996', status: 'LEAD' },
      { name: 'George Bluth', company_name: 'BananaStand', document: '77.777.777/0001-77', email: `george_${user.id.split('-')[0]}@bananastand.com`, phone: '11999999997', status: 'LEAD' },
      { name: 'Hal Jordan', company_name: 'FerrisAir', document: '88.888.888/0001-88', email: `hal_${user.id.split('-')[0]}@ferrisair.com`, phone: '11999999998', status: 'LEAD' },
      { name: 'Iris West', company_name: 'CentralNews', document: '99.999.999/0001-99', email: `iris_${user.id.split('-')[0]}@centralnews.com`, phone: '11999999999', status: 'LEAD' },

      // Negotiating (2)
      { name: 'Jack Shepard', company_name: 'OceanicAir', document: '12.345.678/0001-90', email: `jack_${user.id.split('-')[0]}@oceanic.com`, phone: '11988888881', status: 'NEGOTIATING' },
      { name: 'Katherine Pierce', company_name: 'MysticFalls', document: '98.765.432/0001-10', email: `katherine_${user.id.split('-')[0]}@mysticfalls.com`, phone: '11988888882', status: 'NEGOTIATING' },

      // Lost (1)
      { name: 'Logan Howlett', company_name: 'WeaponX', document: '11.222.333/0001-44', email: `logan_${user.id.split('-')[0]}@weaponx.com`, phone: '11988888883', status: 'LOST' }
    ];

    const clients = [];
    for (const c of clientsData) {
      const client = await prisma.client.create({ data: { ...c, user_id: user.id } as any });
      clients.push(client);
    }

    const activeClients = clients.filter(c => c.status === 'ACTIVE');

    // 3. Seed Projects
    console.log('Seeding projects...');
    const projectsData = [
      { name: 'Redesign Landing Page', area: 'MARKETING', status: 'COMPLETED', priority: 'HIGH', value: 8000, received: 8000, clientIdx: 0, monthsAgoCreated: 10, monthsAgoDelivered: 9, workedHours: 32 },
      { name: 'Desenvolvimento E-commerce', area: 'DEVELOPER', status: 'COMPLETED', priority: 'URGENT', value: 24000, received: 24000, clientIdx: 1, monthsAgoCreated: 8, monthsAgoDelivered: 5, workedHours: 32 },
      { name: 'App de Entregas iOS/Android', area: 'DEVELOPER', status: 'IN_PROGRESS', priority: 'HIGH', value: 35000, received: 15000, clientIdx: 2, monthsAgoCreated: 4, monthsAgoDelivered: null, workedHours: 32 },
      { name: 'Gestão de Tráfego Pago', area: 'MARKETING', status: 'IN_PROGRESS', priority: 'LOW', value: 6000, received: 4000, clientIdx: 3, monthsAgoCreated: 2, monthsAgoDelivered: null, workedHours: 16 },
      { name: 'API de Pagamento Integrada', area: 'DEVELOPER', status: 'REVIEW', priority: 'MEDIUM', value: 12000, received: 9000, clientIdx: 4, monthsAgoCreated: 3, monthsAgoDelivered: null, workedHours: 16 },
      { name: 'Criação de Identidade Visual', area: 'MARKETING', status: 'COMPLETED', priority: 'MEDIUM', value: 5000, received: 5000, clientIdx: 0, monthsAgoCreated: 6, monthsAgoDelivered: 5, workedHours: 0 },
      { name: 'SEO e Marketing de Conteúdo', area: 'MARKETING', status: 'COMPLETED', priority: 'LOW', value: 4500, received: 4500, clientIdx: 1, monthsAgoCreated: 5, monthsAgoDelivered: 4, workedHours: 0 },
      { name: 'Plataforma E-learning LMS', area: 'DEVELOPER', status: 'COMPLETED', priority: 'HIGH', value: 28000, received: 28000, clientIdx: 2, monthsAgoCreated: 7, monthsAgoDelivered: 2, workedHours: 0 },
      { name: 'Portal de Notícias Corporativo', area: 'DEVELOPER', status: 'COMPLETED', priority: 'MEDIUM', value: 15000, received: 15000, clientIdx: 3, monthsAgoCreated: 11, monthsAgoDelivered: 10, workedHours: 0 },
      { name: 'Consultoria de SEO Avançada', area: 'MARKETING', status: 'COMPLETED', priority: 'LOW', value: 3200, received: 3200, clientIdx: 4, monthsAgoCreated: 2, monthsAgoDelivered: 1, workedHours: 0 },
      
      // Proposta Comercial para Clientes em Negociação
      { name: 'MVP SaaS Financeiro', area: 'DEVELOPER', status: 'PLANNING', priority: 'HIGH', value: 45000, received: 0, clientIdx: 9, monthsAgoCreated: 0, monthsAgoDelivered: null, workedHours: 0 },
      { name: 'Branding e Campanhas Meta Ads', area: 'MARKETING', status: 'PLANNING', priority: 'MEDIUM', value: 12000, received: 0, clientIdx: 10, monthsAgoCreated: 0, monthsAgoDelivered: null, workedHours: 0 }
    ];

    const projects = [];
    for (const p of projectsData) {
      const isNegotiating = p.clientIdx >= 9;
      const client = isNegotiating ? clients[p.clientIdx] : activeClients[p.clientIdx % activeClients.length];
      const createdDate = getDateOffset(p.monthsAgoCreated, 5);
      const deliveryDate = p.monthsAgoDelivered !== null ? getDateOffset(p.monthsAgoDelivered, 28) : null;

      const project = await prisma.project.create({
        data: {
          user_id: user.id,
          client_id: client.id,
          name: p.name,
          area: p.area as any,
          status: p.status as any,
          priority: p.priority as any,
          project_value: p.value,
          amount_received: p.received,
          amount_pending: p.value - p.received,
          created_at: createdDate,
          delivery_date: deliveryDate,
          expected_delivery_date: getDateOffset(p.monthsAgoCreated - 2, 20),
          worked_hours: p.workedHours
        }
      });
      projects.push(project);
    }

    // 4. Seed Monthly Expenses over the last 12 months (to populate Expense Chart & Cash Flow)
    console.log('Seeding monthly project and global expenses...');
    
    // Generate expenses for each month from 11 months ago to current month
    for (let m = 0; m <= 11; m++) {
      const date = getDateOffset(m, 15);
      
      // Basic recurrent hosting and software
      await prisma.projectExpense.create({
        data: {
          project_id: projects[m % projects.length].id,
          title: 'Servidor VPS Cloud (Mensal)',
          category: 'HOSTING',
          value: 120.00 + (m * 5), // slightly varying
          created_at: date
        }
      });

      await prisma.projectExpense.create({
        data: {
          project_id: projects[(m + 1) % projects.length].id,
          title: 'Licenças Softwares de Design e Dev',
          category: 'SOFTWARE',
          value: 85.00,
          created_at: date
        }
      });

      await prisma.projectExpense.create({
        data: {
          project_id: projects[(m + 2) % projects.length].id,
          title: 'Créditos de IA para Geração / Copilot',
          category: 'AI',
          value: 99.00,
          created_at: date
        }
      });

      // Periodic higher expenses (Ads & Freelancers)
      if (m % 3 === 0) {
        await prisma.projectExpense.create({
          data: {
            project_id: projects[m % projects.length].id,
            title: 'Campanha de Marketing Ads Google',
            category: 'ADS',
            value: 600.00 + (m * 50),
            created_at: date
          }
        });
      }

      if (m % 4 === 0) {
        await prisma.projectExpense.create({
          data: {
            project_id: projects[m % projects.length].id,
            title: 'Contratação Redator Freelancer',
            category: 'FREELANCER',
            value: 500.00,
            created_at: date
          }
        });
      }
    }

    // 5. Seed Tasks for active projects
    console.log('Seeding tasks...');
    const tasks = [];
    const tasksData = [
      { projectIdx: 0, title: 'Desenhar Arquitetura e Modelagem', desc: 'Estruturação do banco', status: 'COMPLETED', priority: 'HIGH', hours: 10, monthsAgo: 10, workedHours: 16 },
      { projectIdx: 0, title: 'Construir Telas do Front', desc: 'Mockups e componentes', status: 'COMPLETED', priority: 'HIGH', hours: 25, monthsAgo: 9, workedHours: 16 },
      { projectIdx: 1, title: 'Configurar Catálogo do E-commerce', desc: 'Lógica do carrinho e checkout', status: 'COMPLETED', priority: 'URGENT', hours: 30, monthsAgo: 7, workedHours: 16 },
      { projectIdx: 1, title: 'Integração Gateway de Pagamentos', desc: 'Homologação do Stripe/Pix', status: 'COMPLETED', priority: 'URGENT', hours: 20, monthsAgo: 6, workedHours: 16 },
      { projectIdx: 2, title: 'Interface Mobile React Native', desc: 'Desenvolvimento das views do App', status: 'IN_PROGRESS', priority: 'HIGH', hours: 40, monthsAgo: 3, workedHours: 16 },
      { projectIdx: 2, title: 'Configuração Push Notifications', desc: 'Integração Firebase Cloud Messaging', status: 'IN_PROGRESS', priority: 'MEDIUM', hours: 15, monthsAgo: 2, workedHours: 16 },
      { projectIdx: 3, title: 'Configuração Gerenciador de Anúncios', desc: 'Pixel do Meta e Analytics instalados', status: 'IN_PROGRESS', priority: 'LOW', hours: 8, monthsAgo: 1, workedHours: 16 },
      { projectIdx: 4, title: 'Documentação da API e Testes Unitários', desc: 'Endpoints swagger e cobertura jest', status: 'REVIEW', priority: 'MEDIUM', hours: 16, monthsAgo: 2, workedHours: 16 }
    ];

    for (const t of tasksData) {
      const task = await prisma.task.create({
        data: {
          user_id: user.id,
          project_id: projects[t.projectIdx].id,
          title: t.title,
          description: t.desc,
          status: t.status as any,
          priority: t.priority as any,
          estimated_hours: t.hours,
          due_date: getDateOffset(t.monthsAgo, 15),
          worked_hours: t.workedHours
        }
      });
      tasks.push(task);
    }

    // 6. Seed Time Entries (to populate worked hours per project in past months)
    console.log('Seeding time entries...');
    // Create random entries across projects to show nice effort
    for (let t = 0; t < tasks.length; t++) {
      const task = tasks[t];
      const entryCount = 4; // 4 entries per task
      for (let i = 1; i <= entryCount; i++) {
        const start = getDateOffset(tasksData[t].monthsAgo, 10 + i, 9);
        const end = getDateOffset(tasksData[t].monthsAgo, 10 + i, 13);
        const durationMins = 240; // 4 hours
        
        await prisma.timeEntry.create({
          data: {
            project_id: task.project_id,
            task_id: task.id,
            start_time: start,
            end_time: end,
            duration: durationMins,
            description: `Ajustes técnicos e refatorações - tarefa #${i}`
          }
        });
      }
    }

    // 7. Seed Payments (Distributed across the last 12 months for cash flow)
    console.log('Seeding financial payments (PAID and PENDING)...');
    
    const paymentsToSeed = [
      // Project 0 (Redesign Page) - Total 8000 (Delivered 9 months ago)
      { project_id: projects[0].id, amount: 4000, date: getDateOffset(10, 5), status: 'PAID' },
      { project_id: projects[0].id, amount: 4000, date: getDateOffset(9, 25), status: 'PAID' },

      // Project 1 (E-commerce) - Total 24000 (Delivered 5 months ago)
      { project_id: projects[1].id, amount: 8000, date: getDateOffset(8, 10), status: 'PAID' },
      { project_id: projects[1].id, amount: 8000, date: getDateOffset(7, 10), status: 'PAID' },
      { project_id: projects[1].id, amount: 8000, date: getDateOffset(5, 25), status: 'PAID' },

      // Project 2 (App Entregas) - Total 35000 (In progress)
      { project_id: projects[2].id, amount: 15000, date: getDateOffset(4, 5), status: 'PAID' },
      { project_id: projects[2].id, amount: 10000, date: getDateOffset(1, 15), status: 'PAID' }, // paid last month
      { project_id: projects[2].id, amount: 10000, date: getDateOffset(0, 30), status: 'PENDING' }, // pending at end of current month

      // Project 3 (Gestão de Tráfego) - Total 6000 (In progress)
      { project_id: projects[3].id, amount: 2000, date: getDateOffset(2, 5), status: 'PAID' },
      { project_id: projects[3].id, amount: 2000, date: getDateOffset(1, 5), status: 'PAID' },
      { project_id: projects[3].id, amount: 2000, date: getDateOffset(0, 5), status: 'PENDING' }, // pending this month

      // Project 4 (API Pagamento) - Total 12000 (Review)
      { project_id: projects[4].id, amount: 6000, date: getDateOffset(3, 10), status: 'PAID' },
      { project_id: projects[4].id, amount: 3000, date: getDateOffset(1, 10), status: 'PAID' },
      { project_id: projects[4].id, amount: 3000, date: getDateOffset(0, 10), status: 'PENDING' },

      // Project 5 (Identidade Visual) - Total 5000 (Completed 5 months ago)
      { project_id: projects[5].id, amount: 2500, date: getDateOffset(6, 12), status: 'PAID' },
      { project_id: projects[5].id, amount: 2500, date: getDateOffset(5, 12), status: 'PAID' },

      // Project 6 (SEO Conteúdo) - Total 4500 (Completed 4 months ago)
      { project_id: projects[6].id, amount: 4500, date: getDateOffset(4, 15), status: 'PAID' },

      // Project 7 (LMS E-learning) - Total 28000 (Completed 2 months ago)
      { project_id: projects[7].id, amount: 14000, date: getDateOffset(7, 10), status: 'PAID' },
      { project_id: projects[7].id, amount: 14000, date: getDateOffset(2, 10), status: 'PAID' },

      // Project 8 (Portal Notícias) - Total 15000 (Completed 10 months ago)
      { project_id: projects[8].id, amount: 7500, date: getDateOffset(11, 20), status: 'PAID' },
      { project_id: projects[8].id, amount: 7500, date: getDateOffset(10, 20), status: 'PAID' },

      // Project 9 (SEO Avançado) - Total 3200 (Completed 1 month ago)
      { project_id: projects[9].id, amount: 3200, date: getDateOffset(1, 22), status: 'PAID' }
    ];

    for (const p of paymentsToSeed) {
      const isPaid = p.status === 'PAID';
      await prisma.payment.create({
        data: {
          project_id: p.project_id,
          amount: p.amount,
          due_date: p.date,
          payment_date: isPaid ? p.date : null,
          status: p.status as any
        }
      });
    }

    // 8. Seed Services (to populate micro service-related metrics)
    console.log('Seeding micro services...');
    const servicesToSeed = [
      { client_id: activeClients[0].id, user_id: user.id, title: 'Instalação de Certificado SSL', status: 'COMPLETED', value: 350, amount_received: 350, amount_pending: 0, due_date: getDateOffset(3, 10), finished_at: getDateOffset(3, 10), created_at: getDateOffset(3, 10) },
      { client_id: activeClients[1].id, user_id: user.id, title: 'Migração de Servidor cPanel para VPS', status: 'COMPLETED', value: 1200, amount_received: 1200, amount_pending: 0, due_date: getDateOffset(2, 20), finished_at: getDateOffset(2, 20), created_at: getDateOffset(2, 20) },
      { client_id: activeClients[2].id, user_id: user.id, title: 'Suporte Mensal WordPress', status: 'PENDING', value: 800, amount_received: 0, amount_pending: 800, due_date: getDateOffset(0, 25), finished_at: null, created_at: getDateOffset(0, 1) }
    ];

    for (const s of servicesToSeed) {
      await prisma.service.create({
        data: s as any
      });
    }
  }

  console.log('--- DATABASE SEED COMPLETED SUCCESSFULLY ---');
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
