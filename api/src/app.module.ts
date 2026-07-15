import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { PaymentsModule } from './payments/payments.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AssetsModule } from './assets/assets.module';
import { EventsModule } from './events/events.module';
import { TagsModule } from './tags/tags.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AiModule } from './ai/ai.module';
import { LogsModule } from './logs/logs.module';
import { ServicesModule } from './services/services.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ClientsModule,
    ProjectsModule,
    TasksModule,
    PaymentsModule,
    ExpensesModule,
    AssetsModule,
    EventsModule,
    TagsModule,
    TimeEntriesModule,
    DashboardModule,
    AiModule,
    LogsModule,
    ServicesModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
