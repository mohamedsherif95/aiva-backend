import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { envKeys } from '../../config/envKeys';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: envKeys.mail.host,
        port: envKeys.mail.port,
        secure: envKeys.mail.secure,
        auth: {
          user: envKeys.mail.user,
          pass: envKeys.mail.pass,
        },
      },
      defaults: {
        from: `"${envKeys.mail.fromName}" <${envKeys.mail.from}>`,
      },
      template: {
        dir: join(process.cwd(), 'dist/src/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
