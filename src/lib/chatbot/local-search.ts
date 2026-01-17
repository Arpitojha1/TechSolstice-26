import Fuse from 'fuse.js';
import eventsData from '@/data/events.json';
import generalData from '@/data/general.json';

// --- TYPES ---
export interface SearchMatch {
  type: 'event' | 'category' | 'general';
  data: any;
  score: number; // 0 = perfect match, 1 = no match
  matchedOn?: string; // What keyword/name matched
}

// --- EVENT SEARCH CONFIG ---
const EVENT_SEARCH_OPTIONS = {
  keys: ['name'],
  threshold: 0.6,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true
};

const CATEGORY_SEARCH_OPTIONS = {
  keys: ['category'],
  threshold: 0.5,
  ignoreLocation: true,
  includeScore: true
};

// --- INDEXES ---
const eventIndex = new Fuse(eventsData, EVENT_SEARCH_OPTIONS);
const uniqueCategories = Array.from(new Set(eventsData.map(e => e.category)))
  .map(cat => ({ category: cat }));
const categoryIndex = new Fuse(uniqueCategories, CATEGORY_SEARCH_OPTIONS);

// --- STOPWORDS for cleaning queries ---
const STOPWORDS = new Set([
  'what', 'when', 'where', 'who', 'how', 'is', 'are', 'the', 'a', 'an',
  'tell', 'me', 'about', 'show', 'give', 'details', 'of', 'for', 'in', 'at', 'on', 'to'
]);

function cleanQuery(query: string): string {
  return query.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOPWORDS.has(w))
    .join(' ')
    .trim();
}

// --- SEARCH FUNCTIONS WITH SCORES ---

/**
 * Search for a specific event - returns match with score
 * Only matches if there's a meaningful event-like term in the query
 */
export function findEventWithScore(query: string): SearchMatch | null {
  const clean = cleanQuery(query);
  
  // Need at least 3 chars of meaningful content to search for an event
  if (clean.length < 3) return null;

  const results = eventIndex.search(clean);
  if (results.length > 0 && results[0].score !== undefined) {
    // Only accept good matches (score < 0.5)
    // Higher scores mean worse matches
    if (results[0].score > 0.5) return null;
    
    return {
      type: 'event',
      data: results[0].item,
      score: results[0].score,
      matchedOn: results[0].item.name
    };
  }
  return null;
}

/**
 * Search for a category - returns match with score
 */
export function findCategoryWithScore(query: string): SearchMatch | null {
  const clean = query.toLowerCase()
    .replace(/\b(list|show|all|events|in|the|of|for|where|is|are|category)\b/g, '')
    .trim();

  if (clean.length < 3) return null;

  const results = categoryIndex.search(clean);
  if (results.length > 0 && results[0].score !== undefined) {
    return {
      type: 'category',
      data: results[0].item.category,
      score: results[0].score,
      matchedOn: results[0].item.category
    };
  }
  return null;
}

/**
 * Search for General Info - returns match with score
 * Exact phrase matches get very low (good) scores
 */
export function findGeneralInfoWithScore(query: string): SearchMatch | null {
  const lowerQuery = query.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  let bestMatch: { entry: any; keyword: string; score: number } | null = null;
  
  for (const entry of generalData) {
    for (const keyword of entry.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      
      // Check if keyword appears in query
      if (lowerQuery.includes(lowerKeyword)) {
        // Calculate score - longer keyword = better match = lower score
        // Boost: if keyword is a significant portion of the query, give it a very good score
        const keywordRatio = lowerKeyword.length / lowerQuery.length;
        
        // If keyword covers more than 50% of the query, it's a great match
        let score: number;
        if (keywordRatio >= 0.8) {
          score = 0.05; // Almost exact match
        } else if (keywordRatio >= 0.5) {
          score = 0.15; // Good phrase match
        } else {
          score = 0.3; // Partial match
        }
        
        if (!bestMatch || score < bestMatch.score) {
          bestMatch = { entry, keyword, score };
        }
      }
    }
  }
  
  if (bestMatch) {
    return {
      type: 'general',
      data: bestMatch.entry,
      score: bestMatch.score,
      matchedOn: bestMatch.keyword
    };
  }
  return null;
}

/**
 * Run all searches and return all matches sorted by score
 */
export function searchAll(query: string): SearchMatch[] {
  const matches: SearchMatch[] = [];
  
  const eventMatch = findEventWithScore(query);
  if (eventMatch) matches.push(eventMatch);
  
  const categoryMatch = findCategoryWithScore(query);
  if (categoryMatch) matches.push(categoryMatch);
  
  const generalMatch = findGeneralInfoWithScore(query);
  if (generalMatch) matches.push(generalMatch);
  
  // Sort by score (lower = better)
  return matches.sort((a, b) => a.score - b.score);
}

// --- LEGACY FUNCTIONS (for backward compatibility) ---

export function findEvent(query: string) {
  const match = findEventWithScore(query);
  return match ? match.data : null;
}

export function findCategory(query: string) {
  const match = findCategoryWithScore(query);
  return match ? match.data : null;
}

export function findGeneralInfo(query: string) {
  const match = findGeneralInfoWithScore(query);
  return match ? match.data : null;
}

export function getEventsByCategory(category: string) {
  return eventsData.filter(e => e.category === category);
}