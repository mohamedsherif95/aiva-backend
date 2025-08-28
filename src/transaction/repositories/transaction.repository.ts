import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionCategory, TransactionCategoryType } from '../entities/transaction-category.entity';

type CreateTransactionDto = {
  amount: number;
  description?: string;
  categoryId: number;
  accountId: number;
};

type CreateCategoryDto = {
  name: string;
  type: TransactionCategoryType;
};

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionCategory)
    private readonly categoryRepository: Repository<TransactionCategory>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(transaction);
  }

  async findById(id: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ 
      where: { id },
      relations: ['category', 'account'] 
    });
  }

  async findByAccountId(accountId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({ 
      where: { accountId },
      relations: ['category'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByAccountAndDateRange(
    accountId: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        accountId,
        createdAt: Between(startDate, endDate)
      },
      relations: ['category'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(
    id: number, 
    updateTransactionDto: Partial<Omit<CreateTransactionDto, 'id'>>
  ): Promise<Transaction | null> {
    await this.transactionRepository.update(id, updateTransactionDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }

  async getCategories(type?: TransactionCategoryType): Promise<TransactionCategory[]> {
    const where: FindOptionsWhere<TransactionCategory> = {};
    if (type) {
      where.type = type;
    }
    return this.categoryRepository.find({ where });
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<TransactionCategory> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }
}
