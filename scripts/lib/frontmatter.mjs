/**
 * Shared utilities for content generators.
 * CommonJS gray-matter: use default import in .mjs files.
 */
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
/** @type {import('gray-matter')} */
const matter = require('gray-matter');

export { matter };

/**
 * Count words in a markdown string (strips code fences + HTML).
 * @param {string} text
 * @returns {number}
 */
export function wordCount(text) {
  return text
    .replace(/```[\s\S]*?```/g, '') // fenced code blocks
    .replace(/`[^`]+`/g, '')        // inline code
    .replace(/<[^>]+>/g, '')        // HTML tags
    .replace(/[#*_~>\[\]!]/g, '')   // markdown syntax chars
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

/**
 * Compute reading time in minutes (200 wpm, minimum 1).
 * @param {string} content markdown body (no frontmatter)
 * @returns {number}
 */
export function readingTime(content) {
  return Math.max(1, Math.ceil(wordCount(content) / 200));
}
