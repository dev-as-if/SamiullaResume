import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';

let client: GoogleGenerativeAI | null = null;

export const initializeGeminiClient = () => {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  try {
    client = new GoogleGenerativeAI(config.geminiApiKey);
    console.log('✅ Gemini API client initialized successfully');
    return client;
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
    throw error;
  }
};

export const getGeminiClient = (): GoogleGenerativeAI => {
  if (!client) {
    initializeGeminiClient();
  }
  return client!;
};

/**
 * Get Gemini model with optimized settings
 * Using latest models: gemini-2.5-flash, gemini-2.0-flash, or gemini-1.5-pro
 */
export const getGeminiModel = (modelName: string = 'gemini-2.5-flash') => {
  const client = getGeminiClient();
  
  // Map legacy model names to current ones
  const modelMapping: Record<string, string> = {
    'gemini-pro': 'gemini-2.5-flash',
    'gemini-pro-vision': 'gemini-2.5-flash',
  };
  
  const actualModel = modelMapping[modelName] || modelName;
  
  return client.getGenerativeModel({
    model: actualModel,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });
};
