import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ProjectExpensesController, TaskExpensesController } from './expenses.controller';

@Module({
  controllers: [ProjectExpensesController, TaskExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
