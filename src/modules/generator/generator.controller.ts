import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeneratorService } from './generator.service';
import { TransactionData } from './dto/transaction-data.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Generator')
@ApiBearerAuth()
@Controller('generator')
export class GeneratorController {
    constructor(private readonly generatorService: GeneratorService) {}

    @Post('text')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Generate transaction data from text input' })
    @ApiResponse({ status: 201, description: 'Successfully generated transaction data', type: TransactionData })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                text: { type: 'string', example: 'Bought groceries for $50 at Walmart today' }
            },
            required: ['text']
        }
    })
    async generateFromText(@Body('text') text: string): Promise<TransactionData> {
        if (!text?.trim()) {
            throw new BadRequestException('Text input cannot be empty');
        }
        return this.generatorService.textGenerator(text);
    }

    @Post('audio')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('audio'))
    @ApiOperation({ summary: 'Generate transaction data from audio input' })
    @ApiResponse({ status: 201, description: 'Successfully generated transaction data from audio', type: TransactionData })
    @ApiResponse({ status: 400, description: 'Invalid audio file' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                audio: {
                    type: 'string',
                    format: 'binary',
                    description: 'Audio file containing transaction information'
                }
            },
            required: ['audio']
        }
    })
    async generateFromAudio(
        @UploadedFile() audioFile: Express.Multer.File
    ): Promise<TransactionData> {
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
