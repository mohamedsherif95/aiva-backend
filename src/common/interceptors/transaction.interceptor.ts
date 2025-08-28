import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Attach the queryRunner to the request
    const request = context.switchToHttp().getRequest();
    request.queryRunner = queryRunner;

    return next.handle().pipe(
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
      catchError(async (error) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw error;
      }),
    );
  }
}
