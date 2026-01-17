import Fuse from 'fuse.js';
import eventsData from '@/data/events.json';

// --- CONFIGURATION ---
const EVENT_SEARCH_OPTIONS = {
  keys: ['name'],
  threshold: 0.6,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true
};

const CATEGORY_SEARCH_OPTIONS = {
  keys: ['category'],
  threshold: 0.4,
  ignoreLocation: true
};

const eventIndex = new Fuse(eventsData, EVENT_SEARCH_OPTIONS);

// Extract unique categories
const uniqueCategories = Array.from(new Set(eventsData.map(e => e.category)))
  .map(cat => ({ category: cat }));
const categoryIndex = new Fuse(uniqueCategories, CATEGORY_SEARCH_OPTIONS);

/**
 * Search for a specific event
 */
export function findEvent(query: string) {
  // Enhanced Cleaning: Removes "team size", "for", "starts at" so Fuse sees the name clearly
  const clean = query.toLowerCase()
    .replace(/\b(what|when|where|is|the|event|about|details|tell|me|starts|at|ends|time|team|size|for|price|cost)\b/g, '')
    .trim();

  if (clean.length < 2) return null;

  const results = eventIndex.search(clean);
  if (results.length > 0) {
    return results[0].item;
  }
  return null;
}

/**
 * Search for a category
 */
export function findCategory(query: string) {
  const clean = query.toLowerCase()
    .replace(/\b(list|show|all|events|in|the|of|for|where|is|are|category)\b/g, '')
    .trim();

  if (clean.length < 3) return null;

  const results = categoryIndex.search(clean);
  if (results.length > 0) {
    return results[0].item.category;
  }
  return null;
}

export function getEventsByCategory(category: string) {
  return eventsData.filter(e => e.category === category);
}