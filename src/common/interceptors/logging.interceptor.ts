import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';
// import { ApiLog } from '../modules/admin/entities/apiLog.entity';

const EXCLUDED_ROUTES = [
  { method: 'GET', path: '/' },
  { method: 'POST', path: '/auth/login' },
  { method: 'POST', path: '/auth/register' },
  { method: 'GET', path: '/admin/dev/apiLogs' },
];

function safeJson(obj: any) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    console.log('>>>>> - safeJson - err:', err);
    return '[Unserializable]';
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const { method, url, body, query, params, user } = request;

    const shouldSkip = EXCLUDED_ROUTES.some((route) => {
      route.method === method && url === route.path;
      const sameMethod = route.method === method;
      const samePath = url === route.path;
      return !user || (sameMethod && samePath) || route.path.includes('dev');
    });

    if (shouldSkip) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (responseBody) => {
        context.switchToHttp().getResponse().statusCode;
        console.log('>>>>> - LoggingInterceptor - tap - response:', responseBody);

        // const log = this.dataSource.getRepository(ApiLog).create({
        //   method,
        //   url,
        //   userId: user?.id || null,
        //   requestBody: safeJson(body),
        //   queryParams: safeJson(query),
        //   pathParams: safeJson(params),
        //   responseBody: safeJson(responseBody),
        //   statusCode,
        // });

        // await this.dataSource.getRepository(ApiLog).save(log);
      }),
    );
  }
}
