import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly i18n: I18nService) {
    super();
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw (
        err || new UnauthorizedException(this.i18n.t('messages.errors.invalidCredentials'))
      );
    }
    return user;
  }
}
