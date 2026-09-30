import dotenv from 'dotenv';
dotenv.config();

export const config = {
  appName: process.env.APP_NAME || 'EduGenie',
  appVersion: process.env.APP_VERSION || '1.0.0',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  maxInputLength: parseInt(process.env.MAX_INPUT_LENGTH || '12000', 10),
  port: parseInt(process.env.PORT || '3000', 10),
};
