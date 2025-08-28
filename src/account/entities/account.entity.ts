import { User } from '../../user/entities/user.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'userId' })
  userId: number;

  @ManyToOne(() => User, user => user.accounts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];
}
