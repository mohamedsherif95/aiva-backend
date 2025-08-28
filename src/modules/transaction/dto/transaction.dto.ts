import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { PartialType } from '@nestjs/mapped-types';
import { TransactionCategoryType } from '../entities/transaction-category.entity';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  accountId: number;

  @IsEnum(TransactionType)
  type: TransactionType;
}

export class CreateTransactionWithTextDto {
  @IsString()
  text: string;

  @IsNumber()
  accountId: number;
}

export class CreateTransactionWithAudioDto {
  @IsNumber()
  accountId: number;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsEnum(TransactionCategoryType)
    type: 'income' | 'expense';
}