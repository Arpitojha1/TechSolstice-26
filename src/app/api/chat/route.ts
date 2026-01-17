import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/chatbot/rate-limiter';
import { formatEventDetails } from '@/lib/chatbot/formatter';
import { analyzeQuery, QueryIntent } from '@/lib/chatbot/analyzer';
import { findEvent, findCategory, getEventsByCategory } from '@/lib/chatbot/local-search';

export const runtime = 'nodejs';

const FALLBACK_MSG = `I didn't catch that. Could you check the spelling?`;

// 1. DEFINE FOLLOW-UP WORDS
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

    // --- PRIORITY 1: STATE CHECK (With Escape Hatch) ---
    if (currentContext === 'awaiting_category') {
      const categoryMatch = findCategory(message);
      if (categoryMatch) {
        // Success: Found the category
        const events = getEventsByCategory(categoryMatch);
        const list = events.map(e => `• **${e.name}**`).join('\n');
        return NextResponse.json({
          response: `Here are the **${categoryMatch}** events:\n\n${list}\n\nType an event name for details!`,
          context: null
        });
      } else {
        // ESCAPE HATCH: User ignored the question and asked something else (e.g. "Where is Robowars")
        // We drop the state and let the code below handle it.
        currentContext = null;
      }
    }

    const analysis = analyzeQuery(message);

    // --- PRIORITY 2: GREETING & GENERIC LIST ---
    if (analysis.intent === QueryIntent.GREETING) {
      return NextResponse.json({
        response: "Hello! I'm Spark. I can list events by category or give details on specific ones.",
        context: null
      });
    }

    if (analysis.intent === QueryIntent.LIST_REQUEST) {
      return NextResponse.json({
        response: "Sure! Which category are you interested in?\n\n• Coding and Development\n• Robotics and Hardware\n• Finance and Strategy\n• Quizzes and Tech Games\n• Creative and Design\n• Gaming Zone\n• Conclave",
        context: 'awaiting_category'
      });
    }

    // --- PRIORITY 3: FOLLOW-UP CHECK ---
    const isFollowUp = isPureFollowUp(message);

    if (isFollowUp && currentContext) {
      const contextEvent = findEvent(currentContext);
      if (contextEvent) {
        return NextResponse.json({
          response: formatEventDetails(contextEvent, message),
          context: contextEvent.name
        });
      }
    }

    // --- PRIORITY 4: SPECIFIC SEARCH ---

    // A. Try EVENT First
    const eventMatch = findEvent(message);
    if (eventMatch) {
      return NextResponse.json({
        response: formatEventDetails(eventMatch, message),
        context: eventMatch.name
      });
    }

    // B. Try CATEGORY Second
    const categoryMatch = findCategory(message);
    if (categoryMatch) {
      const events = getEventsByCategory(categoryMatch);
      const list = events.map(e => `• **${e.name}**`).join('\n');
      return NextResponse.json({
        response: `Here are the **${categoryMatch}** events:\n\n${list}\n\nType an event name for details!`,
        context: null
      });
    }

    // --- PRIORITY 5: FALLBACK ---
    return NextResponse.json({
      response: FALLBACK_MSG,
      context: currentContext
    });

  } catch (e: any) {
    console.error("Server Error:", e);
    return NextResponse.json({ response: "System error." }, { status: 500 });
  }
}