import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor() {}

  onModuleInit() {
    this.logger.log('Scheduler service initialized');
  }
}
