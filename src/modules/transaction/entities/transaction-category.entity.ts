import { Transaction } from './transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum TransactionCategoryType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

@Entity('transactionCategories')
export class TransactionCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: TransactionCategoryType,
    default: TransactionCategoryType.EXPENSE
  })
  type: 'income' | 'expense';

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];
}
