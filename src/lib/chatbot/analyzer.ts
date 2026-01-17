export enum QueryIntent {
  GREETING = 'greeting',
  LIST_REQUEST = 'list_request', // "List all events", "Show me schedule"
  SPECIFIC_QUERY = 'query'       // "Robowars", "Coding events", "When is it"
}

export interface QueryAnalysis {
  intent: QueryIntent;
  originalQuery: string;
}

const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'greetings', 'yo', 'sup', 'start'];

// Phrases that mean "Show me EVERYTHING"
const STRICT_LIST_PHRASES = [
  'list', 'list all', 'list events', 'list all events',
  'show all', 'show events', 'show schedule', 'the schedule',
  'events', 'schedule', 'all events', 'what are the events'
];

export function analyzeQuery(query: string): QueryAnalysis {
  const norm = query.toLowerCase().trim().replace(/[^\w\s]/g, ''); // Remove punctuation

  // 1. Greeting
  if (GREETING_KEYWORDS.some(k => norm === k || norm.startsWith(k + ' '))) {
    return { intent: QueryIntent.GREETING, originalQuery: query };
  }

  // 2. Generic List Request (STRICT FIX)
  // Only trigger if the user says "list events" or "schedule".
  // If they say "list coding events", this will be FALSE, and it will go to SPECIFIC_QUERY.
  if (STRICT_LIST_PHRASES.some(phrase => norm === phrase)) {
    return { intent: QueryIntent.LIST_REQUEST, originalQuery: query };
  }

  // 3. Default (Specific Searches)
  // "List coding events" -> Goes here
  // "Where is Robowars" -> Goes here
  return { intent: QueryIntent.SPECIFIC_QUERY, originalQuery: query };
}