import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountRepository } from './repositories/account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountRepository],
  exports: [TypeOrmModule, AccountRepository],
})
export class AccountModule {}
