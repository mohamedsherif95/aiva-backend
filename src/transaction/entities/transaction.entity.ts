import { Account } from '../../account/entities/account.entity';
import { TransactionCategory } from './transaction-category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'categoryId' })
  categoryId: number;

  @Column({ name: 'accountId' })
  accountId: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @ManyToOne(() => TransactionCategory, category => category.transactions)
  @JoinColumn({ name: 'categoryId' })
  category: TransactionCategory;

  @ManyToOne(() => Account, account => account.transactions)
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
