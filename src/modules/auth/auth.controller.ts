import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/auth.dto';
import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { I18nService } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const data = await this.authService.signup(signupDto);
    return {
      status: HttpStatus.OK,
      message: this.i18n.t('messages.success.signup'),
      data: data,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Req() req) {
    const data = await this.authService.login(req.user);
    return {
      status: HttpStatus.OK,
      message: this.i18n.t('messages.success.login'),
      data: data,
    };
  }
}
