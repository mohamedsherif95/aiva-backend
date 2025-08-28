import * as dotenv from 'dotenv';

dotenv.config();

export const envKeys = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: 'gemini-1.5-flash',
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    mail: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        from: process.env.MAIL_FROM,
        fromName: process.env.MAIL_FROM_NAME,
    }
};