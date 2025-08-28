import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptService {
    // TODO: query from DB when querying logic is implemented (abstract repo. pattern or else)
    categories: string[]

    categorizationPrompter() {
        return `
        - Read through and analyze the text (that could be in any language but your response MUST ALWAYS BE IN ENGLISH)
        - Respond SOLEY with a structured object that has two keys:
            1. text: containing the original text
            2. data: an object that categorizes my transactions in the following categories: ${this.categories}
        - Make sure to not overlap amounts between categories, if a transaction could belong to two or more categories, then only choose the most relevant one.
        `;
    };

    categorizeTextTransactions(input: string) {
        return `
            Considering this input text: ${input}
            ${this.categorizationPrompter()}
        `
    }
    
    categorizeAudioTransactions() {
        return `
        - Extract the text from this audio
        ${this.categorizationPrompter()}
        `;
    };
};
