import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly i18n: I18nService) {
    super({ usernameField: 'phone' });
  }

  async validate(phone: string, password: string): Promise<any> {
    if (!phone || !password)
      throw new HttpException(
        this.i18n.t('messages.errors.invalidCredentials'),
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.authService.validateUser(phone, password);
    if (!user) {
      throw new UnauthorizedException(this.i18n.t('messages.errors.invalidCredentials'));
    }
    // TODO: to be uncommented later
    else if (!user.isActive) {
      throw new UnauthorizedException(this.i18n.t('messages.errors.notActive'));
    }
    return user;
  }
}
