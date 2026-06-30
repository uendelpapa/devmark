import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Cookie parser (required for refresh token cookies)
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Devmark API')
    .setDescription('API RESTful para o sistema de gestão de projetos Devmark')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e sessão')
    .addTag('dashboard', 'Dados agregados do dashboard')
    .addTag('clients', 'Gestão de clientes')
    .addTag('projects', 'Gestão de projetos')
    .addTag('tasks', 'Gestão de tarefas')
    .addTag('payments', 'Controle de pagamentos')
    .addTag('project-expenses', 'Custos gerais do projeto')
    .addTag('task-expenses', 'Custos específicos da tarefa')
    .addTag('assets', 'Arquivos do projeto')
    .addTag('events', 'Calendário de eventos')
    .addTag('project-tags', 'Tags de projetos')
    .addTag('time-entries', 'Timer / Entradas de tempo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Devmark API running on http://localhost:${port}`);
  console.log(`📄 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
