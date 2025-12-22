import Fuzzysort from 'fuzzysort';
import aliases from './aliases.json';

/**
 * Query intent types
 */
export enum QueryIntent {
  SIMPLE_EVENT_LOOKUP = 'simple_event_lookup',    // Direct event queries (name, venue, time)
  EVENT_FILTER = 'event_filter',                  // Filter by category, date, time
  NEXT_EVENT = 'next_event',                      // "What's next?" queries
  COMPLEX_QUESTION = 'complex_question',          // Needs vector search + LLM
  OFF_TOPIC = 'off_topic',                        // Not related to fest
}

export interface QueryAnalysis {
  intent: QueryIntent;
  confidence: number;
  eventName?: string;
  category?: string;
  filterType?: 'date' | 'time' | 'category' | 'venue';
  filterValue?: string;
}

/**
 * Patterns for detecting query intents
 */
const PATTERNS = {
  // Simple event lookup patterns
  eventLookup: [
    /\b(?:when|what time|timing|time|schedule)\b.*\b(?:is|for|of)\b/i,
    /\b(?:where|venue|location|place)\b.*\b(?:is|for|of|held|happening)\b/i,
    /\b(?:what|tell me|info|information|details|about)\b.*\bevent\b/i,
    /\b(?:what is|what's|whats)\b/i,
    /\b(?:tell me about|describe|explain)\b/i,
  ],

  // Next event patterns
  nextEvent: [
    /\b(?:next|upcoming|coming up|what'?s next)\b/i,
    /\b(?:now|currently|right now|at the moment)\b/i,
  ],

  // Filter patterns
  categoryFilter: [
    /\b(?:all|list|show|get)\b.*\b(?:hackathons?|workshops?|competitions?|gaming|robotics?|coding|cultural)\b/i,
    /\b(?:hackathons?|workshops?|competitions?|gaming|robotics?|coding|cultural)\b.*\b(?:events?|list)\b/i,
  ],

  dateFilter: [
    /\b(?:on|events? on|happening on)\b.*\b(?:january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2})\b/i,
    /\b(?:today|tomorrow|this week|next week)\b/i,
  ],

  // Rules and instructions (needs LLM)
  rulesAndInstructions: [
    /\b(?:rules?|regulations?|how to|instructions?|guidelines?|eligibility|requirements?)\b/i,
    /\b(?:can i|am i allowed|is it allowed|allowed to)\b/i,
  ],

  // Off-topic patterns
  offTopic: [
    /\b(?:weather|movie|food|restaurant|hotel|booking|travel|flight)\b/i,
    // Don't mark as off-topic if it might be asking about an event
    // Remove the "what is" pattern - let it fall through to event lookup
  ],
};

/**
 * Common event name variations and keywords
 */
const EVENT_KEYWORDS = [
  'robowars', 'robo wars', 'robot wars', 'robotics',
  'hackathon', 'hack', 'coding marathon',
  'workshop', 'seminar', 'talk',
  'gaming', 'esports', 'game',
  'cultural', 'dance', 'music',
  'tech talk', 'keynote',
  'competition', 'contest',
  'cod', 'call of duty', 'call duty',
  'valorant', 'bgmi', 'fifa', 'clash royale',
  'ctf', 'capture flag', 'capture the flag',
  'webcraft', 'web craft',
  'drone', 'line follower',
  'maze runner',
];
/**
 * Analyze user query and determine intent
 */
export function analyzeQuery(query: string): QueryAnalysis {
  const normalizedQuery = query.toLowerCase().trim();

  // Check for off-topic queries first
  if (PATTERNS.offTopic.some(pattern => pattern.test(normalizedQuery))) {
    return {
      intent: QueryIntent.OFF_TOPIC,
      confidence: 0.9,
    };
  }

  // Check for next event queries
  if (PATTERNS.nextEvent.some(pattern => pattern.test(normalizedQuery))) {
    // Check if asking for specific category's next event
    const categoryMatch = normalizedQuery.match(/\b(hackathon|workshop|gaming|robotics?|coding|cultural|competition)\b/i);
    return {
      intent: QueryIntent.NEXT_EVENT,
      confidence: 0.95,
      category: categoryMatch ? categoryMatch[1] : undefined,
    };
  }

  // Check for category filter
  if (PATTERNS.categoryFilter.some(pattern => pattern.test(normalizedQuery))) {
    const categoryMatch = normalizedQuery.match(/\b(hackathons?|workshops?|competitions?|gaming|robotics?|coding|cultural)\b/i);
    return {
      intent: QueryIntent.EVENT_FILTER,
      confidence: 0.9,
      filterType: 'category',
      filterValue: categoryMatch ? categoryMatch[1].replace(/s$/, '') : undefined,
    };
  }

  // Check for date filter
  if (PATTERNS.dateFilter.some(pattern => pattern.test(normalizedQuery))) {
    return {
      intent: QueryIntent.EVENT_FILTER,
      confidence: 0.85,
      filterType: 'date',
    };
  }

  // Check for simple event lookup
  if (PATTERNS.eventLookup.some(pattern => pattern.test(normalizedQuery))) {
    const eventName = extractEventName(normalizedQuery);
    return {
      intent: QueryIntent.SIMPLE_EVENT_LOOKUP,
      confidence: eventName ? 0.9 : 0.7,
      eventName,
    };
  }

  // Check if query mentions rules/instructions (needs LLM)
  if (PATTERNS.rulesAndInstructions.some(pattern => pattern.test(normalizedQuery))) {
    return {
      intent: QueryIntent.COMPLEX_QUESTION,
      confidence: 0.85,
    };
  }

  // Check if query is just an event name or contains event keywords
  const eventName = extractEventName(normalizedQuery);
  if (eventName) {
    return {
      intent: QueryIntent.SIMPLE_EVENT_LOOKUP,
      confidence: 0.8,
      eventName,
    };
  }

  // Default: complex question requiring vector search + LLM
  return {
    intent: QueryIntent.COMPLEX_QUESTION,
    confidence: 0.5,
  };
}

/**
 * Extract event name from query using fuzzy matching
 */
export function extractEventName(query: string): string | undefined {
  const normalizedQuery = query.toLowerCase();
  // Check manual aliases first (e.g., "cod" -> "COD (Call of Duty)")
  try {
    const aliasKeys = Object.keys(aliases || {});
    for (const a of aliasKeys) {
      if (normalizedQuery.includes(a.toLowerCase())) {
        return (aliases as Record<string, string>)[a];
      }
    }
  } catch (e) {
    // ignore alias resolution errors
  }

  // Simple keyword matching for common events
  for (const keyword of EVENT_KEYWORDS) {
    if (normalizedQuery.includes(keyword)) {
      return keyword;
    }
  }

  return undefined;
}

/**
 * Fuzzy match event name against database event names
 * Handles spelling mistakes and variations
 */
export function fuzzyMatchEventName(
  query: string,
  eventNames: string[],
  threshold: number = -5000
): string | null {
  if (eventNames.length === 0) return null;

  // Extract potential event name from query
  // Remove common question words
  const cleanQuery = query
    .toLowerCase()
    .replace(/\b(what is|whats|what's|when is|where is|tell me about|show me|about|the)\b/gi, '')
    .trim();

  // Try exact match first (case insensitive)
  const exactMatch = eventNames.find(name =>
    name.toLowerCase() === cleanQuery ||
    cleanQuery.includes(name.toLowerCase()) ||
    name.toLowerCase().includes(cleanQuery)
  );

  if (exactMatch) return exactMatch;

  // Try fuzzy matching
  const results = Fuzzysort.go(cleanQuery, eventNames, {
    threshold,
    limit: 3, // Get top 3 matches
  });

  if (results.length > 0) {
    // Check if query contains keywords from the matched event
    for (const result of results) {
      const eventLower = result.target.toLowerCase();
      const eventWords = eventLower.split(/[\s\-\(\)]+/).filter(w => w.length > 2);

      // Check if any significant word from the event name is in the query
      const hasMatchingWord = eventWords.some(word =>
        cleanQuery.includes(word) || word.includes(cleanQuery)
      );

      if (hasMatchingWord || result.score > threshold) {
        return result.target;
      }
    }

    // Return best match if score is good enough
    if (results[0].score > threshold * 0.8) {
      return results[0].target;
    }
  }

  // If still no match, check aliases mapping: if query includes an alias, return canonical event name if present
  try {
    const aliasKeys = Object.keys(aliases || {});
    for (const a of aliasKeys) {
      if (cleanQuery.includes(a.toLowerCase())) {
        const canonical = (aliases as Record<string, string>)[a];
        const found = eventNames.find(n => n.toLowerCase() === canonical.toLowerCase());
        if (found) return found;
      }
    }
  } catch (e) {
    // ignore alias lookup errors
  }

  return null;
}/**
 * Extract date information from query
 */
export function extractDateInfo(query: string): {
  type: 'specific' | 'relative' | 'none';
  value?: string;
} {
  const normalizedQuery = query.toLowerCase();

  // Relative dates
  if (/\btoday\b/i.test(normalizedQuery)) {
    return { type: 'relative', value: 'today' };
  }
  if (/\btomorrow\b/i.test(normalizedQuery)) {
    return { type: 'relative', value: 'tomorrow' };
  }
  if (/\bthis week\b/i.test(normalizedQuery)) {
    return { type: 'relative', value: 'this_week' };
  }

  // Specific date patterns (simplified)
  const dateMatch = normalizedQuery.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-]?(\d{2,4})?\b/);
  if (dateMatch) {
    return { type: 'specific', value: dateMatch[0] };
  }

  const monthMatch = normalizedQuery.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})\b/i);
  if (monthMatch) {
    return { type: 'specific', value: monthMatch[0] };
  }

  return { type: 'none' };
}
