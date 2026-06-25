"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('--- STARTING DATABASE SEED ---');
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
    await prisma.client.deleteMany({});
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
    const now = new Date();
    const currentDay = now.getDay();
    const daysToSub = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToSub);
    monday.setHours(0, 0, 0, 0);
    const getWeekDayDate = (dayIndex, hour = 10, minutes = 0) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + dayIndex);
        d.setHours(hour, minutes, 0, 0);
        return d;
    };
    for (const user of users) {
        console.log(`\n--- Seeding data for user: ${user.email} ---`);
        console.log('Seeding clients...');
        const clientsData = [
            { name: 'Alice Smith', company_name: 'TechStart', document: '11.111.111/0001-11', email: `alice_${user.id.split('-')[0]}@techstart.com`, phone: '11999999991', status: 'ACTIVE' },
            { name: 'Bob Johnson', company_name: 'DesignFlow', document: '22.222.222/0001-22', email: `bob_${user.id.split('-')[0]}@designflow.com`, phone: '11999999992', status: 'ACTIVE' },
            { name: 'Charlie Brown', company_name: 'MarketGrowth', document: '33.333.333/0001-33', email: `charlie_${user.id.split('-')[0]}@marketgrowth.com`, phone: '11999999993', status: 'ACTIVE' }
        ];
        const clients = [];
        for (const c of clientsData) {
            const client = await prisma.client.create({ data: { ...c, user_id: user.id } });
            clients.push(client);
        }
        console.log('Seeding projects...');
        const projectsData = [
            { name: 'Redesign Landing Page', area: 'MARKETING', status: 'IN_PROGRESS', priority: 'HIGH', value: 5000, received: 3000 },
            { name: 'Desenvolvimento E-commerce', area: 'DEVELOPER', status: 'IN_PROGRESS', priority: 'URGENT', value: 15000, received: 10000 },
            { name: 'App de Entregas iOS/Android', area: 'DEVELOPER', status: 'PLANNING', priority: 'MEDIUM', value: 20000, received: 5000 },
            { name: 'Gestão de Tráfego Pago', area: 'MARKETING', status: 'PLANNING', priority: 'LOW', value: 4000, received: 2000 },
            { name: 'API de Pagamento Integrada', area: 'DEVELOPER', status: 'REVIEW', priority: 'HIGH', value: 8000, received: 8000 },
            { name: 'Criação de Identidade Visual', area: 'MARKETING', status: 'COMPLETED', priority: 'MEDIUM', value: 3000, received: 3000 },
            { name: 'SEO e Marketing de Conteúdo', area: 'MARKETING', status: 'COMPLETED', priority: 'LOW', value: 2500, received: 2500 },
            { name: 'Plataforma E-learning LMS', area: 'DEVELOPER', status: 'COMPLETED', priority: 'HIGH', value: 18000, received: 18000 }
        ];
        const projects = [];
        for (let i = 0; i < projectsData.length; i++) {
            const p = projectsData[i];
            const client = clients[i % clients.length];
            const expectedDelivery = new Date();
            expectedDelivery.setDate(expectedDelivery.getDate() + 30 + i * 5);
            const project = await prisma.project.create({
                data: {
                    user_id: user.id,
                    client_id: client.id,
                    name: p.name,
                    area: p.area,
                    status: p.status,
                    priority: p.priority,
                    project_value: p.value,
                    amount_received: p.received,
                    amount_pending: p.value - p.received,
                    expected_delivery_date: expectedDelivery,
                }
            });
            projects.push(project);
        }
        console.log('Seeding project expenses...');
        const expensesData = [
            { project_id: projects[0].id, title: 'Domínio Registrado .com', category: 'DOMAIN', value: 69.90 },
            { project_id: projects[0].id, title: 'Hospedagem Vercel Pro', category: 'HOSTING', value: 149.90 },
            { project_id: projects[1].id, title: 'ChatGPT Plus para Devs', category: 'AI', value: 120.00 },
            { project_id: projects[2].id, title: 'Licença Figma Pro Team', category: 'DESIGN', value: 90.00 },
            { project_id: projects[3].id, title: 'Anúncios Google/Meta Ads', category: 'ADS', value: 1000.00 },
            { project_id: projects[3].id, title: 'Freelancer Redator de Blog', category: 'FREELANCER', value: 600.00 }
        ];
        for (const e of expensesData) {
            await prisma.projectExpense.create({ data: e });
        }
        console.log('Seeding tasks...');
        const task1 = await prisma.task.create({
            data: {
                user_id: user.id,
                project_id: projects[0].id,
                title: 'Configurar Banco de Dados e Prisma',
                description: 'Implementar schemas, migrations e seeds iniciais',
                status: 'COMPLETED',
                priority: 'HIGH',
                estimated_hours: 8,
                due_date: getWeekDayDate(1)
            }
        });
        const task2 = await prisma.task.create({
            data: {
                user_id: user.id,
                project_id: projects[0].id,
                title: 'Desenvolver Telas de Autenticação',
                description: 'Criar login, cadastro e recuperação de senha',
                status: 'IN_PROGRESS',
                priority: 'MEDIUM',
                estimated_hours: 12,
                due_date: getWeekDayDate(3)
            }
        });
        const task3 = await prisma.task.create({
            data: {
                user_id: user.id,
                project_id: projects[1].id,
                title: 'Configurar Catálogo e Carrinho',
                description: 'Desenvolver o fluxo de compra e listagem de produtos',
                status: 'IN_PROGRESS',
                priority: 'URGENT',
                estimated_hours: 16,
                due_date: getWeekDayDate(2)
            }
        });
        console.log('Seeding subtasks...');
        await prisma.subtask.createMany({
            data: [
                { task_id: task1.id, text: 'Instalar bibliotecas do prisma', completed: true },
                { task_id: task1.id, text: 'Desenhar diagrama ERD', completed: true },
                { task_id: task2.id, text: 'Criar UI do Login no HeroUI', completed: true },
                { task_id: task2.id, text: 'Validar formulários com react-hook-form', completed: false },
                { task_id: task3.id, text: 'Criar componentes de cards de produtos', completed: true },
                { task_id: task3.id, text: 'Persistir itens do carrinho no localStorage', completed: false }
            ]
        });
        console.log('Seeding time entries...');
        const timeEntries = [
            { project_id: projects[0].id, task_id: task1.id, start_time: getWeekDayDate(0, 9), end_time: getWeekDayDate(0, 11), duration: 120, description: 'Desenho inicial do ERD' },
            { project_id: projects[0].id, task_id: task2.id, start_time: getWeekDayDate(0, 14), end_time: getWeekDayDate(0, 15), duration: 60, description: 'Desenvolvimento formulário login' },
            { project_id: projects[0].id, task_id: task2.id, start_time: getWeekDayDate(1, 9), end_time: getWeekDayDate(1, 13), duration: 240, description: 'Desenvolvimento das telas de autenticação' },
            { project_id: projects[1].id, task_id: task3.id, start_time: getWeekDayDate(2, 10), end_time: getWeekDayDate(2, 12, 30), duration: 150, description: 'Mock de catálogo e listagem' },
            { project_id: projects[1].id, task_id: task3.id, start_time: getWeekDayDate(3, 9), end_time: getWeekDayDate(3, 14), duration: 300, description: 'Integração de estado global do carrinho' },
            { project_id: projects[0].id, task_id: task2.id, start_time: getWeekDayDate(4, 9), end_time: getWeekDayDate(4, 12, 30), duration: 210, description: 'Testes e correções na autenticação' },
            { project_id: projects[0].id, task_id: task2.id, start_time: getWeekDayDate(5, 10), end_time: getWeekDayDate(5, 12), duration: 120, description: 'Ajuste fino de responsividade' },
            { project_id: projects[1].id, task_id: task3.id, start_time: getWeekDayDate(6, 15), end_time: getWeekDayDate(6, 16), duration: 60, description: 'Homologação e deploy' }
        ];
        for (const entry of timeEntries) {
            await prisma.timeEntry.create({ data: entry });
            const durationHours = Math.ceil(entry.duration / 60);
            await prisma.task.update({
                where: { id: entry.task_id },
                data: { worked_hours: { increment: durationHours } }
            });
            await prisma.project.update({
                where: { id: entry.project_id },
                data: { worked_hours: { increment: durationHours } }
            });
        }
        console.log('Seeding payments...');
        const paymentsData = [
            { project_id: projects[0].id, amount: 3000, due_date: new Date('2026-06-01'), payment_date: new Date('2026-06-01'), status: 'PAID' },
            { project_id: projects[0].id, amount: 2000, due_date: new Date('2026-07-01'), status: 'PENDING' },
            { project_id: projects[1].id, amount: 10000, due_date: new Date('2026-06-05'), payment_date: new Date('2026-06-05'), status: 'PAID' },
            { project_id: projects[1].id, amount: 5000, due_date: new Date('2026-07-05'), status: 'PENDING' }
        ];
        for (const p of paymentsData) {
            await prisma.payment.create({ data: p });
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
});
//# sourceMappingURL=seed.js.map