export enum QueryIntent {
  GREETING = 'greeting',
  LIST_REQUEST = 'list_request', // "List all events", "Show me schedule"
  GENERAL_INFO = 'general_info', // "Who is organizing?", "Rules", "Contact"
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

// Keywords that suggest looking in general.json
// These must be SPECIFIC phrases, not single generic words
const GENERAL_KEYWORDS = [
  // About TechSolstice specifically
  'techsolstice', 'about techsolstice', 'about the fest', 'what is techsolstice',
  // Organizers
  'who organizes', 'organized by', 'organizers', 'organizing committee',
  // Venue/Location (specific phrases)
  'fest venue', 'fest location', 'venue address', 'where is techsolstice',
  // Dates (specific phrases)
  'fest dates', 'when is techsolstice', 'fest schedule', 'fest timing',
  // Event count (specific phrases)
  'how many events', 'total events', 'number of events', 'event count', 'events count',
  // Eligibility
  'eligibility', 'who can join', 'can i participate', 'outsiders allowed',
  // Socials
  'instagram', 'linkedin', 'social media', 'official handles',
  // Contact (specific phrases)
  'contact number', 'phone number', 'email address', 'how to contact', 'helpdesk',
  // Registration & Passes
  'how to register', 'registration process', 'pass price', 'ticket price', 'entry fee'
];

export function analyzeQuery(query: string): QueryAnalysis {
  const norm = query.toLowerCase().trim().replace(/[^\w\s]/g, ''); // Remove punctuation

  // 1. Greeting
  if (GREETING_KEYWORDS.some(k => norm === k || norm.startsWith(k + ' '))) {
    return { intent: QueryIntent.GREETING, originalQuery: query };
  }

  // 2. Generic List Request (STRICT)
  // Only trigger if user says "list events" or "schedule".
  if (STRICT_LIST_PHRASES.some(phrase => norm === phrase)) {
    return { intent: QueryIntent.LIST_REQUEST, originalQuery: query };
  }

  // 3. General Info / Rules Request
  // Check this BEFORE specific events so "Rules for Robowars" is caught here first.
  if (GENERAL_KEYWORDS.some(k => norm.includes(k))) {
    return { intent: QueryIntent.GENERAL_INFO, originalQuery: query };
  }

  // 4. Default (Specific Searches)
  return { intent: QueryIntent.SPECIFIC_QUERY, originalQuery: query };
}