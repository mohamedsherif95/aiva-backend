import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const innerStatus = [HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.BAD_REQUEST].includes(status)
      ? status
      : HttpStatus.BAD_REQUEST;

    // Handle validation errors
    if (status === HttpStatus.BAD_REQUEST && Array.isArray((exception.getResponse() as any).errors)) {
      const validationErrors = (exception.getResponse() as any).errors;
      const errors = await this.formatValidationErrors(validationErrors);
      
      return response.status(HttpStatus.OK).json({
        status: innerStatus,
        message: 'Validation failed',
        errors,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // Handle other HTTP exceptions
    const message = this.getExceptionMessage(exception);
    response.status(
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? HttpStatus.INTERNAL_SERVER_ERROR
        : HttpStatus.OK,
    ).json({
      status: innerStatus,
      message: `${this.i18n.t('messages.errors.somethingWentWrong')} | ${message}`,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getExceptionMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'object' && response !== null) {
      return (response as any).message || exception.message;
    }
    return exception.message;
  }

  private async formatValidationErrors(validationErrors: any[]): Promise<Record<string, string[]>> {
    const errors: Record<string, string[]> = {};
    
    for (const error of validationErrors) {
      if (error.constraints) {
        const constraints = error.constraints as Record<string, string>;
        errors[error.property] = await Promise.all(
          Object.entries(constraints).map(async ([, message]) => {
            return this.i18n.t(`validation.${message}`, {
              args: {
                property: error.property,
                value: error.value,
              },
              defaultValue: message,
            });
          }),
        );
      }
    }
    
    return errors;
  }
}
