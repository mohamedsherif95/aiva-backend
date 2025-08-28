import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { PostgresErrorCodes } from '../types';
import { I18nService } from 'nestjs-i18n';

@Catch(QueryFailedError)
export class PostgresExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    console.log('>>>>> - PostgresExceptionFilter - exception:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Unexpected database error';

    switch ((exception as any).code) {
      case PostgresErrorCodes.uniqueConstraint.code:
        status = HttpStatus.BAD_REQUEST;
        message = PostgresErrorCodes.uniqueConstraint.message;
        if (exception.message.includes('uniq_bus_trip_date'))
          message = this.i18n.t('messages.errors.busInUse');
        else if ((exception as any).detail.includes('serialNumber'))
          message = this.i18n.t('messages.errors.serialNumberInUse');
        break;
      case PostgresErrorCodes.foreignKey.code:
        status = HttpStatus.BAD_REQUEST;
        message = PostgresErrorCodes.foreignKey.message;
        break;
      case PostgresErrorCodes.notNull.code:
        status = HttpStatus.BAD_REQUEST;
        message = PostgresErrorCodes.notNull.message;
        break;
      case PostgresErrorCodes.stringLengthLimit.code:
        status = HttpStatus.BAD_REQUEST;
        message = PostgresErrorCodes.stringLengthLimit.message;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Unexpected database error';
    }

    response.status(status).json({
      status: status,
      message,
    });
  }
}
