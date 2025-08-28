import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { TransactionCategory, TransactionCategoryType } from './entities/transaction-category.entity';
import { Account } from '../users/entities/Account.entity';
import { User } from '../users/entities/User.entity';
import { GeneratorService } from '../generator/generator.service';
import { CreateCategoryDto, CreateTransactionDto, UpdateTransactionDto } from './dto/transaction.dto';
import { categoriesMap } from 'src/common/types';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionCategory)
    private readonly transactionCategoryRepository: Repository<TransactionCategory>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly generatorService: GeneratorService,
  ) {}

  async create(user: User, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // Verify the account belongs to the user
    const account = await this.accountRepository.findOne({
      where: { id: createTransactionDto.accountId, userId: user.id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      account,
    });

    return this.transactionRepository.save(transaction);
  }

  async createFromText(user: User, text: string, accountId: number): Promise<Transaction[]> {
    // Verify the account belongs to the user
    const account = await this.accountRepository.findOne({
      where: { id: accountId, userId: user.id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Generate transaction data from text
    const generatedData = await this.generatorService.textGenerator(text);
    console.log("🚀 ~ TransactionService ~ createFromText ~ generatedData:", generatedData)

    const transactionList = []

    Object.entries(generatedData.data).forEach(([category, amount]: [string, number]) => {
      if (amount === 0) return;
      transactionList.push({
        amount,
        description: generatedData.text,
        categoryId: categoriesMap[category],
        accountId,
      });
    });

    const transactions = this.transactionRepository.create(transactionList);

    return this.transactionRepository.save(transactions);
  }

  async createFromAudio(user: User, audioFile: Express.Multer.File, accountId: number): Promise<Transaction[]> {
    // Verify the account belongs to the user
    const account = await this.accountRepository.findOne({
      where: { id: accountId, userId: user.id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Generate transaction data from audio
    const generatedData = await this.generatorService.audioGenerator(audioFile);
    console.log("🚀 ~ TransactionService ~ createFromAudio ~ generatedData:", generatedData)
    console.log("🚀 ~ TransactionService ~ createFromAudio ~ audioFile:", audioFile)
    
    const transactionList = []

    Object.entries(generatedData.data).forEach(([category, amount]: [string, number]) => {
      if (amount === 0) return;
      transactionList.push({
        amount,
        description: generatedData.text,
        categoryId: categoriesMap[category],
        accountId,
      });
    });

    const transactions = this.transactionRepository.create(transactionList);

    return this.transactionRepository.save(transactions);
  }

  async update(
    id: number,
    userId: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['account'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.account.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this transaction');
    }

    Object.assign(transaction, updateTransactionDto);
    return this.transactionRepository.save(transaction);
  }

  async remove(id: number, userId: number): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['account'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.account.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this transaction');
    }

    await this.transactionRepository.remove(transaction);
  }

  async findByUserId(userId: number, options?: {
    startDate?: Date;
    endDate?: Date;
    type?: TransactionType;
    categoryId?: number;
  }): Promise<Transaction[]> {
    const { startDate, endDate, type, categoryId } = options || {};
    
    const where: FindOptionsWhere<Transaction> = {
      account: { userId },
    };

    if (categoryId) {
      where.category = { id: categoryId };
    }

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = Between(startDate, new Date());
    }

    return this.transactionRepository.find({
      where,
      relations: ['category', 'account'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['category', 'account'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.account.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this transaction');
    }

    return transaction;
  }

  async findByAccountAndDateRange(
    accountId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        accountId,
        createdAt: Between(startDate, endDate),
      },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCategories(type?: TransactionCategoryType): Promise<TransactionCategory[]> {
    const where: FindOptionsWhere<TransactionCategory> = {};
    if (type) {
      where.type = type;
    }
    return this.transactionCategoryRepository.find({ where });
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<TransactionCategory> {
    const category = this.transactionCategoryRepository.create(createCategoryDto);
    return this.transactionCategoryRepository.save(category);
  }
}
