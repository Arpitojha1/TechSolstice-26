/**
 * PDF Ingestion Script
 * 
 * This script processes PDF files containing event rules and fest information,
 * chunks them into smaller pieces, generates embeddings, and stores them in Supabase.
 * 
 * Usage:
 *   npx tsx scripts/ingest-pdf.ts <path-to-pdf-file>
 * 
 * Prerequisites:
 *   1. Enable pgvector extension in Supabase
 *   2. Create knowledge_base table (see SQL below)
 *   3. Set GEMINI_API_KEY and Supabase credentials in .env.local
 */

import { readFileSync } from 'fs';
import { parse } from 'path';
// The `pdf-parse` package uses CommonJS; TypeScript may complain about default export.
// @ts-ignore
import pdf from 'pdf-parse';
import { createClient } from '@supabase/supabase-js';
import { generateEmbeddingsBatch } from '../src/lib/chatbot/gemini-client';

// Check for PDF file argument
if (process.argv.length < 3) {
  console.error('Usage: npx tsx scripts/ingest-pdf.ts <path-to-pdf-file>');
  process.exit(1);
}

const pdfPath = process.argv[2];

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GEMINI_API_KEY) {
  console.error('❌ Missing required environment variables:');
  if (!SUPABASE_URL) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_SERVICE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!GEMINI_API_KEY) console.error('  - GEMINI_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Chunk text into smaller pieces for better retrieval
 */
function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }

  return chunks;
}

/**
 * Clean and normalize text
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .replace(/[^\x20-\x7E\n]/g, '')
    .trim();
}

/**
 * Main ingestion function
 */
async function ingestPDF() {
  console.log('📄 Reading PDF file:', pdfPath);

  try {
    // Read and parse PDF
    const dataBuffer = readFileSync(pdfPath);
    const data = await pdf(dataBuffer);

    console.log('✅ PDF parsed successfully');
    console.log('   Pages:', data.numpages);
    console.log('   Text length:', data.text.length, 'characters');

    // Clean text
    const cleanedText = cleanText(data.text);
    console.log('✅ Text cleaned');

    // Chunk text
    const chunks = chunkText(cleanedText, 400, 50);
    console.log('✅ Text chunked into', chunks.length, 'pieces');

    // Generate embeddings in batches
    console.log('🔄 Generating embeddings...');
    const batchSize = 100;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      console.log(`   Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}...`);

      try {
        const embeddings = await generateEmbeddingsBatch(batch);
        allEmbeddings.push(...embeddings);

        // Rate limiting: wait 1 second between batches
        if (i + batchSize < chunks.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error: any) {
        console.error(`❌ Error processing batch: ${error.message}`);
        // Continue with next batch
      }
    }

    console.log('✅ Generated', allEmbeddings.length, 'embeddings');

    // Prepare data for insertion
    const fileName = parse(pdfPath).name;
    const records = chunks.slice(0, allEmbeddings.length).map((chunk, i) => ({
      content: chunk,
      embedding: allEmbeddings[i],
      metadata: {
        source: fileName,
        chunk_index: i,
        total_chunks: chunks.length,
      },
    }));

    // Insert into Supabase
    console.log('🔄 Inserting into Supabase...');

    const { data: inserted, error } = await supabase
      .from('knowledge_base')
      .insert(records);

    if (error) {
      console.error('❌ Error inserting into Supabase:', error.message);
      console.error('   Make sure the knowledge_base table exists (see SQL below)');
      process.exit(1);
    }

    console.log('✅ Successfully inserted', records.length, 'records into knowledge_base table');
    console.log('🎉 PDF ingestion complete!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run ingestion
console.log('🚀 Starting PDF ingestion...\n');
ingestPDF();

/**
 * SQL to create knowledge_base table in Supabase:
 * 
 * -- Enable pgvector extension
 * CREATE EXTENSION IF NOT EXISTS vector;
 * 
 * -- Create knowledge_base table
 * CREATE TABLE IF NOT EXISTS public.knowledge_base (
 *   id BIGSERIAL PRIMARY KEY,
 *   content TEXT NOT NULL,
 *   embedding vector(768),
 *   metadata JSONB,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Create index for faster vector search
 * CREATE INDEX ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops)
 * WITH (lists = 100);
 * 
 * -- Create the matching function
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
