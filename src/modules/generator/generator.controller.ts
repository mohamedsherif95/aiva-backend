import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeneratorService } from './generator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('generator')
export class GeneratorController {
    constructor(private readonly generatorService: GeneratorService) {}

    @Post('text')
    @UseGuards(JwtAuthGuard)
    async generateFromText(@Body('text') text: string) {
        if (!text?.trim()) {
            throw new BadRequestException('Text input cannot be empty');
        }
        return this.generatorService.textGenerator(text);
    }

    @Post('audio')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('audio'))
    async generateFromAudio(
        @UploadedFile() audioFile: Express.Multer.File
    ) {
        if (!audioFile) {
            throw new BadRequestException('Audio file is required');
        }
        
        // Validate audio file type
        const allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
        if (!allowedMimeTypes.includes(audioFile.mimetype)) {
            throw new BadRequestException(
                `Unsupported file type. Allowed types: ${allowedMimeTypes.join(', ')}`
            );
        }

        return this.generatorService.audioGenerator(audioFile);
    }
}
