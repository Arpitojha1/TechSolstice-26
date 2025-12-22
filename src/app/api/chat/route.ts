import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { analyzeQuery, QueryIntent, fuzzyMatchEventName } from '@/lib/chatbot/query-router';
import { rateLimiter, validateQueryLength } from '@/lib/chatbot/rate-limiter';
import { chatCache, generateCacheKey } from '@/lib/chatbot/cache';
import { generateChatResponse } from '@/lib/chatbot/gemini-client';
import { getRelevantContext } from '@/lib/chatbot/vector-search';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatRequest {
  message: string;
  sessionId: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface ChatResponse {
  response: string;
  cached?: boolean;
  rateLimit?: {
    remaining: number;
    resetIn: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, sessionId, conversationHistory = [] } = body;

    // Validate input
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: message and sessionId' },
        { status: 400 }
      );
    }

    // Validate query length (max 25 words)
    const lengthValidation = validateQueryLength(message);
    if (!lengthValidation.valid) {
      return NextResponse.json(
        {
          error: `Query too long. Please limit your question to ${lengthValidation.maxWords} words or less. (You used ${lengthValidation.wordCount} words)`,
        },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = rateLimiter.checkLimit(sessionId);
    if (!rateLimit.allowed) {
      const resetInMinutes = Math.ceil(rateLimit.resetIn / 60000);
      return NextResponse.json(
        {
          error: `Rate limit exceeded. You've reached your limit of 20 messages per hour. Please try again in ${resetInMinutes} minutes.`,
          rateLimit: {
            remaining: 0,
            resetIn: rateLimit.resetIn,
          },
        },
        { status: 429 }
      );
    }

    // Check cache
    const cacheKey = generateCacheKey(message);
    const cachedResponse = chatCache.get(cacheKey);
    if (cachedResponse) {
      return NextResponse.json<ChatResponse>({
        response: cachedResponse,
        cached: true,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetIn: rateLimit.resetIn,
        },
      });
    }

    // Analyze query intent
    const analysis = analyzeQuery(message);

    let response: string;

    // Route based on intent
    switch (analysis.intent) {
      case QueryIntent.OFF_TOPIC:
        response = "I'm here to help you with questions about TechSolstice events, schedules, venues, and rules. Please ask me something related to the fest!";
        break;

      case QueryIntent.SIMPLE_EVENT_LOOKUP:
        response = await handleSimpleEventLookup(message, analysis.eventName);
        break;

      case QueryIntent.NEXT_EVENT:
        response = await handleNextEventQuery(analysis.category);
        break;

      case QueryIntent.EVENT_FILTER:
        response = await handleEventFilter(analysis.filterType!, analysis.filterValue);
        break;

      case QueryIntent.COMPLEX_QUESTION:
      default:
        response = await handleComplexQuestion(message, conversationHistory);
        break;
    }

    // Cache the response
    chatCache.set(cacheKey, response);

    return NextResponse.json<ChatResponse>({
      response,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetIn: rateLimit.resetIn,
      },
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your request. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Handle simple event lookup queries (venue, time, description)
 */
async function handleSimpleEventLookup(query: string, eventNameHint?: string): Promise<string> {
  const supabase = await createClient();

  // Get all event names for fuzzy matching
  const { data: events, error } = await supabase
    .from('events')
    .select('id, name, venue, time, date, shortDescription, longDescription, category');

  if (error || !events || events.length === 0) {
    return "I couldn't find any events right now. Please try again later or contact support.";
  }

  const eventNames = events.map(e => e.name);

  // Try to find the event using fuzzy matching
  const matchedEventName = eventNameHint
    ? fuzzyMatchEventName(eventNameHint, eventNames)
    : fuzzyMatchEventName(query, eventNames);

  if (!matchedEventName) {
    return `I couldn't find a specific event matching your query. Here are some available events: ${eventNames.slice(0, 5).join(', ')}. Please be more specific.`;
  }

  const event = events.find(e => e.name === matchedEventName);
  if (!event) {
    return "Sorry, I couldn't retrieve the event details. Please try again.";
  }

  // Determine what the user is asking about
  const queryLower = query.toLowerCase();

  // If user asked about time
  if (/\b(?:when|time|timing|schedule)\b/i.test(queryLower)) {
    return `${event.name} is scheduled on ${formatDate(event.date)} at ${formatTime(event.time)}.`;
  }

  // If user asked about venue/location
  if (/\b(?:where|venue|location|place)\b/i.test(queryLower)) {
    return `${event.name} will be held at ${event.venue || 'TBA'} on ${formatDate(event.date)}.`;
  }

  // If user explicitly asked "what is" or similar, return short description only
  if (/\b(?:what is|what's|whats|tell me about|describe|explain)\b/i.test(queryLower)) {
    return event.shortDescription || event.longDescription || `${event.name} - more details coming soon.`;
  }

  // If user asked for more details / full description
  if (/\b(?:more|details|full|long description|full description|give me more)\b/i.test(queryLower)) {
    return event.longDescription || event.shortDescription || `${event.name} - more details coming soon.`;
  }

  // General info about the event (plain-text)
  return formatEventInfo(event);
}

/**
 * Handle "what's next?" queries
 */
async function handleNextEventQuery(category?: string): Promise<string> {
  const supabase = await createClient();

  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0];

  let query = supabase
    .from('events')
    .select('*')
    .gte('date', currentDate)
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(1);

  if (category) {
    query = query.ilike('category', `%${category}%`);
  }

  const { data: events, error } = await query;

  if (error || !events || events.length === 0) {
    return category
      ? `No upcoming events found in the ${category} category.`
      : "No upcoming events found at the moment.";
  }

  const nextEvent = events[0];
  return `Next${category ? ` ${category}` : ''} event: ${formatEventInfo(nextEvent)}`;
}

/**
 * Handle event filtering by category, date, etc.
 */
async function handleEventFilter(filterType: string, filterValue?: string): Promise<string> {
  const supabase = await createClient();

  let query = supabase.from('events').select('*');

  if (filterType === 'category' && filterValue) {
    query = query.ilike('category', `%${filterValue}%`);
  }

  const { data: events, error } = await query.order('date').order('time');

  if (error || !events || events.length === 0) {
    return `No events found matching your criteria.`;
  }

  if (events.length > 10) {
    return `Found ${events.length} events. Here are the first 10:\n\n${events.slice(0, 10).map(e => `- ${e.name} - ${formatDate(e.date)} at ${formatTime(e.time)}`).join('\n')}`;
  }

  return `Found ${events.length} event(s):\n\n${events.map(e => formatEventInfo(e, true)).join('\n\n')}`;
}

/**
 * Handle complex questions using vector search + LLM
 */
async function handleComplexQuestion(query: string, conversationHistory: Array<{ role: string; content: string }>): Promise<string> {
  const supabase = await createClient();

  // Get ALL events from database for context
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date')
    .order('time');

  // Get relevant context from vector database (PDF content)
  const vectorContext = await getRelevantContext(query);

  // Build events context (exclude id and imageUrl when sending to LLM)
  let eventsContext = '';
  if (events && events.length > 0) {
    eventsContext = `\n\nAVAILABLE EVENTS AT TECHSOLSTICE:\n`;
    events.forEach(event => {
      const evLines: string[] = [];
      evLines.push(`${event.name}`);
      if (event.category) evLines.push(`Category: ${event.category}`);
      evLines.push(`Date: ${event.date || 'TBA'}`);
      evLines.push(`Time: ${event.time || 'TBA'}`);
      evLines.push(`Venue: ${event.venue || 'TBA'}`);
      if (event.shortDescription) evLines.push(`Description: ${event.shortDescription}`);
      if (event.prize_pool) evLines.push(`Prize Pool: ₹${event.prize_pool}`);
      eventsContext += `\n- ${evLines.join(' | ')}`;
    });
  }

  // Build system instruction with both PDF context and events data
  const systemInstruction = `You are a helpful assistant for TechSolstice, a technical fest. 
Your role is to answer questions about events, rules, schedules, and general fest information.

IMPORTANT GUIDELINES:
- Only answer questions related to TechSolstice fest
- Be concise and friendly
- Use the event data provided below to answer questions accurately
- If you don't know something, say so clearly
- Format your responses clearly with markdown
- Don't make up information not present in the context

${eventsContext}

${vectorContext ? `\nADDITIONAL INFORMATION FROM RULES & GUIDELINES:\n${vectorContext}` : ''}`;

  // Build conversation context
  let prompt = query;
  if (conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-3); // Last 3 exchanges
    const historyText = recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    prompt = `Previous conversation:\n${historyText}\n\nUser: ${query}`;
  }

  // Generate response using LLM
  try {
    const response = await generateChatResponse(prompt, systemInstruction);
    return response;
  } catch (err: any) {
    console.error('LLM error in complex question handler:', err?.message || err);
    // Fallback: return a short plain-text summary of events and a rate-limit style message
    if (events && events.length > 0) {
      const topEvents = events.slice(0, 5).map(e => `${e.name} (${formatDate(e.date)} at ${formatTime(e.time)})`).join('\n');
      return `Sorry, I'm having trouble contacting the language model right now. Here are some events you can ask about:\n${topEvents}\n\nPlease try again in a few moments.`;
    }
    return `Sorry, I'm having trouble contacting the language model right now. Please try again in a few moments.`;
  }
}

/**
 * Format event information
 */
function formatEventInfo(event: any, short: boolean = false): string {
  if (short) {
    return `- ${event.name} - ${formatDate(event.date)} at ${formatTime(event.time)} | ${event.venue || 'TBA'}`;
  }

  const lines = [];
  lines.push(`${event.name}`);
  lines.push(`Date: ${formatDate(event.date)}`);
  lines.push(`Time: ${formatTime(event.time)}`);
  lines.push(`Venue: ${event.venue || 'TBA'}`);
  lines.push(`${event.shortDescription || event.longDescription || 'More details coming soon!'}`);
  return lines.join('\n');
}

/**
 * Format date nicely
 */
function formatDate(date: string | null): string {
  if (!date) return 'TBA';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Format time nicely
 */
function formatTime(time: string | null): string {
  if (!time) return 'TBA';
  return time;
}
