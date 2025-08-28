import { Injectable, OnModuleInit } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { PromptService } from './prompt.service';


@Injectable()
export class GeneratorService implements OnModuleInit {
    constructor(
        private readonly geminiService: GeminiService,
        private readonly promptService: PromptService,
    ) {}

    async onModuleInit() {
        // Initialize categories when the module loads
        this.initializeCategories();
    }

    private initializeCategories() {
        // Initialize with default categories or fetch from database
        this.promptService.categories = [
            'income', 'food', 'transportation', 'utilities', 'entertainment', 
            'shopping', 'health', 'education', 'other'
        ];
    }

    async textGenerator(input: string) {
        if (!input?.trim()) {
            throw new Error('Input text cannot be empty');
        }

        try {
            const prompt = this.promptService.categorizeTextTransactions(input);
            const result = await this.geminiService.textGenerator(prompt);
            
            // Validate the response structure
            if (!result || typeof result !== 'object') {
                throw new Error('Invalid response format from AI service');
            }
            
            return result;
        } catch (error) {
            throw new Error(`Error generating text: ${error.message}`);
        }
    }

    async audioGenerator(audioFile: Express.Multer.File) {
        if (!audioFile?.buffer) {
            throw new Error('Audio file is required');
        }

        try {
            const prompt = this.promptService.categorizeAudioTransactions();
            const result = await this.geminiService.audioGenerator(prompt, audioFile);
            
            if (!result || typeof result !== 'object') {
                throw new Error('Invalid response format from AI service');
            }
            
            return result;
        } catch (error) {
            throw new Error(`Error processing audio: ${error.message}`);
        }
    }
    
    async speechToText(audioFile: Express.Multer.File): Promise<string> {
        if (!audioFile?.buffer) {
            throw new Error('Audio file is required');
        }

        try {
            const result = await this.geminiService.speechToText(audioFile);
            return result?.toString() || '';
        } catch (error) {
            throw new Error(`Error converting speech to text: ${error.message}`);
        }
    }
}