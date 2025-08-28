import { Account } from '../../account/entities/account.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @OneToMany(() => Account, account => account.user)
  accounts: Account[];
}
