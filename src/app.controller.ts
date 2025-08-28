import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import envKeys from './config/envKeys';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): {key: string} {
    return {key: envKeys.GEMINI_API_KEY};
  }
}
