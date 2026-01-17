import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/chatbot/rate-limiter';
import { formatEventDetails } from '@/lib/chatbot/formatter';
import { analyzeQuery, QueryIntent } from '@/lib/chatbot/analyzer';
import { searchAll, SearchMatch, findEvent, getEventsByCategory } from '@/lib/chatbot/local-search';

export const runtime = 'nodejs';

const FALLBACK_MSG = `I couldn't find what you're looking for. Try asking about a specific event or type "list events" to see categories.`;

// Score threshold - if best match is worse than this, ask for clarification
const CONFIDENCE_THRESHOLD = 0.4;
// If two matches are within this difference, they're ambiguous
const AMBIGUITY_THRESHOLD = 0.1;

// Follow-up words for context-aware responses
const FOLLOW_UP_WORDS = new Set([
  'what', 'when', 'where', 'who', 'how', 'is', 'the', 'it', 'details', 'about',
  'prize', 'pool', 'money', 'cost', 'fee', 'pay', 'amount', 'cash',
  'venue', 'location', 'place', 'room', 'spot',
  'time', 'date', 'schedule', 'start', 'starts', 'end', 'ends', 'timing',
  'team', 'size', 'limit', 'members', 'solo', 'group', 'squad',
  'register', 'registration', 'link', 'signup',
  'contact', 'rule', 'rules', 'format',
  'at', 'in', 'on', 'for', 'to', 'of', 'a', 'an'
]);

function isPureFollowUp(message: string): boolean {
  const clean = message.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const words = clean.split(/\s+/);
  return words.every(w => FOLLOW_UP_WORDS.has(w));
}

/**
 * Format response based on match type
 */
function formatMatchResponse(match: SearchMatch, originalQuery: string): { response: string; context: string | null } {
  switch (match.type) {
    case 'event':
      return {
        response: formatEventDetails(match.data, originalQuery),
        context: match.data.name
      };
    case 'category':
      const events = getEventsByCategory(match.data);
      const list = events.map(e => `- **${e.name}**`).join('\n');
      return {
        response: `Here are the **${match.data}** events:\n\n${list}\n\nType an event name for details!`,
        context: null
      };
    case 'general':
      return {
        response: match.data.response,
        context: null
      };
    default:
      return { response: FALLBACK_MSG, context: null };
  }
}

/**
 * Generate clarification message when matches are ambiguous
 */
function formatClarificationMessage(matches: SearchMatch[]): string {
  const options = matches.slice(0, 3).map((m, i) => {
    switch (m.type) {
      case 'event':
        return `${i + 1}. Event: **${m.data.name}**`;
      case 'category':
        return `${i + 1}. Category: **${m.data}**`;
      case 'general':
        return `${i + 1}. General info about: **${m.matchedOn}**`;
      default:
        return '';
    }
  }).filter(Boolean);

  return `I found multiple matches. Did you mean:\n\n${options.join('\n')}\n\nPlease be more specific or choose one.`;
}

export async function POST(req: NextRequest) {
  let sessionId = 'unknown';

  try {
    const body = await req.json();
    const { message } = body;
    let currentContext = body.activeContext || null;
    sessionId = body.sessionId || 'unknown';

    if (!rateLimiter.checkLimit(sessionId).allowed) {
      return NextResponse.json({ response: "You're typing too fast!" }, { status: 429 });
    }

    // --- PRIORITY 1: STATE CHECK (Category Selection) ---
    if (currentContext === 'awaiting_category') {
      const matches = searchAll(message);
      const categoryMatch = matches.find(m => m.type === 'category');
      if (categoryMatch) {
        const result = formatMatchResponse(categoryMatch, message);
        return NextResponse.json({ response: result.response, context: result.context });
      }
      // Escape hatch: drop state and continue
      currentContext = null;
    }

    const analysis = analyzeQuery(message);

    // --- PRIORITY 2: GREETING ---
    if (analysis.intent === QueryIntent.GREETING) {
      return NextResponse.json({
        response: "Hello! I'm Spark. Ask me about any event, or type 'list events' to see all categories.",
        context: null
      });
    }

    // --- PRIORITY 3: LIST REQUEST ---
    if (analysis.intent === QueryIntent.LIST_REQUEST) {
      return NextResponse.json({
        response: "Which category would you like to explore?\n\n- Coding and Development\n- Robotics and Hardware\n- Finance and Strategy\n- Quizzes and Tech Games\n- Creative and Design\n- Gaming Zone\n- Conclave",
        context: 'awaiting_category'
      });
    }

    // --- PRIORITY 4: FOLLOW-UP CHECK ---
    if (isPureFollowUp(message) && currentContext) {
      const contextEvent = findEvent(currentContext);
      if (contextEvent) {
        return NextResponse.json({
          response: formatEventDetails(contextEvent, message),
          context: contextEvent.name
        });
      }
    }

    // --- PRIORITY 5: SMART SEARCH (Run ALL searches, pick best) ---
    const matches = searchAll(message);

    if (matches.length === 0) {
      return NextResponse.json({
        response: FALLBACK_MSG,
        context: currentContext
      });
    }

    const bestMatch = matches[0];
    const secondMatch = matches[1];

    // Check if best match is confident enough
    if (bestMatch.score > CONFIDENCE_THRESHOLD) {
      // Low confidence - ask for clarification if we have options
      if (matches.length > 1) {
        return NextResponse.json({
          response: formatClarificationMessage(matches),
          context: currentContext
        });
      }
      // Only one weak match - still try it
      const result = formatMatchResponse(bestMatch, message);
      return NextResponse.json({ response: result.response, context: result.context });
    }

    // Check for ambiguity between top matches
    if (secondMatch && Math.abs(bestMatch.score - secondMatch.score) < AMBIGUITY_THRESHOLD) {
      // Close scores - ask for clarification
      return NextResponse.json({
        response: formatClarificationMessage(matches),
        context: currentContext
      });
    }

    // Clear winner - return best match
    const result = formatMatchResponse(bestMatch, message);
    return NextResponse.json({ response: result.response, context: result.context });

  } catch (e: any) {
    console.error("Server Error:", e);
    return NextResponse.json({ response: "System error." }, { status: 500 });
  }
}