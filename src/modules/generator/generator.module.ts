import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { PromptService } from './prompt.service';
import { GeminiService } from './gemini.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [GeneratorController],
  imports: [CommonModule],
  providers: [GeneratorService, PromptService, GeminiService],
  exports: [GeneratorService]
})
export class GeneratorModule {}
