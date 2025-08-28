import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { envKeys } from '../../Config/envKeys';
import { UtilsService } from 'src/common/utils.service';

@Injectable()
export class GeminiService {
    private readonly AIGenAgent: GoogleGenerativeAI;
    private readonly model: any;

    constructor(private readonly utils: UtilsService) {      
        this.AIGenAgent = new GoogleGenerativeAI(envKeys.GEMINI_API_KEY);
        this.model = this.AIGenAgent.getGenerativeModel({ model: envKeys.GEMINI_MODEL });
    }

    async textGenerator(prompt: string) {
        const response = await this.model.generateContent(prompt);

        const result = response.response.candidates[0].content.parts[0].text;

        return this.utils.parseJson(result);
    }

    async audioGenerator(prompt: string, file: Express.Multer.File) {
        const audio = {
            inlineData: {
                data: file.buffer.toString('base64'),
                mimeType: file.mimetype
            }
        }
        const response = await this.model.generateContent([audio, prompt]);

        const result = response.response.candidates[0].content.parts[0].text;
        
        return this.utils.parseJson(result);
    }

    async speechToText(file: Express.Multer.File) {
        const audio = {
            inlineData: {
                data: file.buffer.toString('base64'),
                mimeType: file.mimetype
            }
        }
        const response = await this.model.generateContent([audio, "Extract the text from this audio"]);

        return response.response.candidates[0].content.parts[0].text;
    }
}
