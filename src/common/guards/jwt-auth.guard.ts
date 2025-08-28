import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IS_DEV_ONLY_KEY } from '../decorators/devOnly.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isDevOnly = this.reflector.getAllAndOverride<boolean>(
      IS_DEV_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (
      isDevOnly &&
      ['Production', 'Testing', 'beta'].includes(process.env.NODE_ENV)
    )
      return false;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    const request = context.switchToHttp().getRequest();
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          request.url === '/auth/logout' && 'User already logged out',
        )
      );
    }
    return user;
  }
}
