import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: Partial<Account>): Promise<Account> {
    const account = this.accountRepository.create(createAccountDto);
    return this.accountRepository.save(account);
  }

  async findById(id: number): Promise<Account | undefined> {
    return this.accountRepository.findOne({ 
      where: { id },
      relations: ['user', 'transactions'] 
    });
  }

  async findByUserId(userId: number): Promise<Account[]> {
    return this.accountRepository.find({ 
      where: { userId },
      relations: ['transactions']
    });
  }

  async update(id: number, updateAccountDto: Partial<Account>): Promise<Account | undefined> {
    await this.accountRepository.update(id, updateAccountDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
