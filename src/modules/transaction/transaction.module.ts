import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionCategory } from './entities/transaction-category.entity';
import { TransactionRepository } from './repositories/transaction.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionCategory]),
  ],
  providers: [TransactionRepository],
  exports: [TypeOrmModule, TransactionRepository],
})
export class TransactionModule {}
