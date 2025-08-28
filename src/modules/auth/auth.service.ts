import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  forwardRef,
  Inject
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/User.entity';
import { AssignableRolesIDs } from '../../common/types';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private readonly OTP_EXPIRY_MINUTES = 10;

  constructor(
    @Inject(forwardRef(() => UsersService))private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly i18n: I18nService,
    private readonly mailService: MailService,
  ) {}

  async validatePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserForValidation(phone);
    if (!user) throw new NotFoundException(this.i18n.t('messages.errors.notFound', {
      args: [{ objectName: 'User' }, { objectNameAr: 'المستخدم' }],
    }),);

    const isMatching = await this.validatePassword(pass.toString(), user.password.toString());
    if (!isMatching)
      throw new UnauthorizedException(this.i18n.t('messages.errors.invalidCredentials'));

    const { password, ...result } = user;
    return result;
  }

  async hashPassword(password: string) {
    const saltRounds = 10; // default 10
    return bcrypt.hash(password, saltRounds);
  }

  async signup(userData: Partial<User>) {
    const userExists = await this.usersService.findOne({
      email: userData.email,
    });
    if (userExists) {
      throw new BadRequestException(this.i18n.t('messages.errors.emailInUse'));
    }

    userData.password = await this.hashPassword(userData.password);

    const { password, ...user } = await this.usersService.create(userData);

    return user;
  }

  async login(user: any) {
    const payload = {
      id: user.id || user.userId,
      name: user.name,
      phone: user.phone,
      roleId: user.roleId,
      role: user.role,
    };
    return {
      user,
      accessToken: this.jwtService.sign(payload, { algorithm: 'HS256' }),
    };
  }
}
