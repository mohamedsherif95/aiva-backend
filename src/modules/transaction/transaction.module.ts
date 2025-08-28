import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionCategory } from './entities/transaction-category.entity';
import { TransactionService } from './transaction.service';
import { Account } from '../users/entities/Account.entity';
import { GeneratorModule } from '../generator/generator.module';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionCategory, Account]),
    GeneratorModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TypeOrmModule, TransactionService],
})
export class TransactionModule {}
