import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { I18nValidationPipe } from './common/pipes/validation.pipe';
import { I18nService } from 'nestjs-i18n';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PostgresExceptionFilter } from './common/filters/postgres-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/global-exceptions.filter';
import { defaultAllowedOrigins } from './common/types';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.set('trust proxy', true);

  app.useGlobalFilters(new PostgresExceptionFilter(app.get(I18nService)));
  app.useGlobalFilters(new HttpExceptionFilter(app.get(I18nService)));

  app.use(requestIp.mw());


  app.enableCors({
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: async (origin: string, callback: any) => {
      if (defaultAllowedOrigins.includes(origin) || !origin || origin === 'null') {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  });

  app.useGlobalInterceptors(new LoggingInterceptor(app.get(DataSource)));
  
  // Add global validation pipe with i18n support
  const i18nService = app.get<I18nService<Record<string, any>>>(I18nService);
  app.useGlobalPipes(new I18nValidationPipe(i18nService));

  const APP_PORT = process.env.PORT || 8080;
  await app.listen(APP_PORT);
  console.log(`------> listening on port ${APP_PORT} - Env value ${process.env.NODE_ENV}`);
}
bootstrap();
