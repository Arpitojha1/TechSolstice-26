import { createClient } from '@/utils/supabase/server';
import { generateEmbedding } from './gemini-client';

export interface VectorSearchResult {
  content: string;
  similarity: number;
  metadata?: Record<string, any>;
}

/**
 * Search for similar content in the vector database
 * Uses cosine similarity with pgvector
 */
export async function searchSimilarContent(
  query: string,
  limit: number = 5,
  similarityThreshold: number = 0.7
): Promise<VectorSearchResult[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    const supabase = await createClient();

    // Perform vector similarity search using pgvector
    // Note: This assumes you have the pgvector extension enabled
    // and a table called 'knowledge_base' with an 'embedding' column
    const { data, error } = await supabase.rpc('match_knowledge_base', {
      query_embedding: queryEmbedding,
      match_threshold: similarityThreshold,
      match_count: limit,
    });

    if (error) {
      console.error('Vector search error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchSimilarContent:', error);
    return [];
  }
}

/**
 * Get relevant context from vector search for LLM
 */
export async function getRelevantContext(
  query: string,
  maxTokens: number = 2000
): Promise<string> {
  const results = await searchSimilarContent(query, 5, 0.6);

  if (results.length === 0) {
    return '';
  }

  // Combine results into context, respecting token limit
  let context = 'Relevant information from the knowledge base:\n\n';
  let currentLength = context.length;

  for (const result of results) {
    const addition = `${result.content}\n\n`;
    // Rough token estimation: 1 token ≈ 4 characters
    if ((currentLength + addition.length) / 4 > maxTokens) {
      break;
    }
    context += addition;
    currentLength += addition.length;
  }

  return context;
}

/**
 * SQL function to create in Supabase for vector matching
 * Run this in your Supabase SQL editor:
 * 
 * CREATE OR REPLACE FUNCTION match_knowledge_base(
 *   query_embedding vector(768),
 *   match_threshold float,
 *   match_count int
 * )
 * RETURNS TABLE (
 *   content text,
 *   similarity float,
 *   metadata jsonb
 * )
 * LANGUAGE sql STABLE
 * AS $$
 *   SELECT
 *     content,
 *     1 - (embedding <=> query_embedding) as similarity,
 *     metadata
 *   FROM knowledge_base
 *   WHERE 1 - (embedding <=> query_embedding) > match_threshold
 *   ORDER BY embedding <=> query_embedding
 *   LIMIT match_count;
 * $$;
 */
