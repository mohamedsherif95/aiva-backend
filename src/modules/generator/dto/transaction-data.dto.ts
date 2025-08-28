import { ApiProperty } from '@nestjs/swagger';

export class TransactionData {
    @ApiProperty({
        description: 'The processed text input or transcription from audio',
        example: 'Bought groceries for $50 at Walmart today'
    })
    text: string;

    @ApiProperty({
        description: 'Structured transaction data',
        example: {
            amount: 50,
            currency: 'USD',
            merchant: 'Walmart',
            category: 'groceries',
            date: '2025-08-28T12:34:56.789Z',
            description: 'Grocery shopping at Walmart'
        }
    })
    data: Record<string, any>;
}
