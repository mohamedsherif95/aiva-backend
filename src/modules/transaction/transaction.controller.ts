import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Query,
    Req,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Request } from 'express';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { TransactionService } from './transaction.service';
  import {
    CreateTransactionDto,
    CreateTransactionWithTextDto,
    CreateTransactionWithAudioDto,
    UpdateTransactionDto,
    CreateCategoryDto,
  } from './dto/transaction.dto';
  import { Transaction } from './entities/transaction.entity';
  import { TransactionCategory } from './entities/transaction-category.entity';
  
  @UseGuards(JwtAuthGuard)
  @Controller('transactions')
  export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}
  
    @Post()
    async create(
      @Req() req: Request,
      @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
      return this.transactionService.create(req.user as any, createTransactionDto);
    }
  
    @Post('fromText')
    async createFromText(
      @Req() req: Request,
      @Body() createTransactionDto: CreateTransactionWithTextDto,
    ): Promise<Transaction[]> {
      return this.transactionService.createFromText(
        req.user as any,
        createTransactionDto.text,
        createTransactionDto.accountId,
      );
    }
  
    @Post('fromAudio')
    @UseInterceptors(FileInterceptor('audio'))
    async createFromAudio(
      @Req() req: Request,
      @UploadedFile() audioFile: Express.Multer.File,
      @Body() body: { accountId: number },
    ): Promise<Transaction[]> {
      return this.transactionService.createFromAudio(
        req.user as any,
        audioFile,
        body.accountId,
      );
    }
  
    @Get()
    async findAll(
      @Req() req: Request,
      @Query('startDate') startDate?: string,
      @Query('endDate') endDate?: string,
      @Query('categoryId') categoryId?: number,
    ): Promise<Transaction[]> {
      return this.transactionService.findByUserId((req.user as any).id, {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      });
    }
  
    @Get('categories')
    async getCategories(
      @Query('type') type?: 'income' | 'expense',
    ): Promise<TransactionCategory[]> {
      return this.transactionService.getCategories(type as any);
    }
  
    @Post('categories')
    async createCategory(
      @Body() createCategoryDto: CreateCategoryDto,
    ): Promise<TransactionCategory> {
      return this.transactionService.createCategory(createCategoryDto);
    }

      
    @Get(':id')
    async findOne(
      @Req() req: Request,
      @Param('id') id: string,
    ): Promise<Transaction> {
      return this.transactionService.findOne(parseInt(id), (req.user as any).id);
    }
  
    @Put(':id')
    async update(
      @Req() req: Request,
      @Param('id') id: string,
      @Body() updateTransactionDto: UpdateTransactionDto,
    ): Promise<Transaction> {
      return this.transactionService.update(
        parseInt(id),
        (req.user as any).id,
        updateTransactionDto,
      );
    }
  
    @Delete(':id')
    async remove(
      @Req() req: Request,
      @Param('id') id: string,
    ): Promise<void> {
      return this.transactionService.remove(parseInt(id), (req.user as any).id);
    }
  }