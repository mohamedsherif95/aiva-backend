import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeneratorModule } from './generator/generator.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'ar',
      loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      loader: I18nJsonLoader,
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
    }),
    GeneratorModule, 
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
