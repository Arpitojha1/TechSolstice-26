import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the cheapest available models
const CHAT_MODEL = 'gemini-2.5-flash-lite';
const EMBEDDING_MODEL = 'text-embedding-004';

/**
 * Generate chat completion using Gemini
 */
export async function generateChatResponse(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: CHAT_MODEL,
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API Error:', error.message);
    throw new Error('Failed to generate response from AI');
  }
}

/**
 * Generate embeddings for text using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error: any) {
    console.error('Embedding generation error:', error.message);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    // Gemini batch embeddings - process each individually for now
    // as batch API might have different interface requirements
    const embeddings: number[][] = [];

    for (const text of texts) {
      const embedding = await generateEmbedding(text);
      embeddings.push(embedding);

      // Small delay to avoid rate limiting
      if (texts.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return embeddings;
  } catch (error: any) {
    console.error('Batch embedding error:', error.message);
    throw new Error('Failed to generate batch embeddings');
  }
}
