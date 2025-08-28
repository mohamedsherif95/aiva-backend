import * as dotenv from 'dotenv';

dotenv.config();

export default {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: 'gemini-1.5-flash',
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
};