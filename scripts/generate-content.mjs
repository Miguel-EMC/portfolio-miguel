#!/usr/bin/env node
/**
 * Build-time content generator.
 * Scans /information/blog/ and /information/portfolio/ for *.lang.md files,
 * parses frontmatter, validates, computes readingTime, and emits:
 *   assets/blog/manifest.{en,es}.json + assets/blog/posts/{slug}.{lang}.md
 *   assets/portfolio/manifest.{en,es}.json + assets/portfolio/posts/{slug}.{lang}.md
 *
 * Usage:
 *   node scripts/generate-content.mjs           # one-shot
 *   node scripts/generate-content.mjs --watch   # re-run on file change
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, watch } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INFO_DIR = join(ROOT, 'information');
const ASSETS_DIR = join(ROOT, 'apps/portfolio/src/assets');

const SUPPORTED_LANGS = ['en', 'es'];

const VALID_BLOG_CATEGORIES = new Set([
  'technology', 'programming', 'web-development', 'mobile-development',
  'devops', 'career', 'tutorials', 'general',
]);

// ── helpers ────────────────────────────────────────────────────────────────

async function walkDir(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkDir(full)));
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.md') &&
      !entry.name.startsWith('_')
    ) {
      results.push(full);
    }
  }
  return results;
}

function parseLangFromPath(filePath) {
  const name = basename(filePath, '.md');
  const dotIdx = name.lastIndexOf('.');
  if (dotIdx < 0) return null;
  const lang = name.slice(dotIdx + 1);
  const slug = name.slice(0, dotIdx);
  if (!SUPPORTED_LANGS.includes(lang)) return null;
  return { slug, lang };
}

function computeReadingTime(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

// ── blog ────────────────────────────────────────────────────────────────────

function processBlogFile(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const { data: fm, content: body } = matter(raw);
  const parsed = parseLangFromPath(filePath);
  if (!parsed) {
    console.warn(`[blog] skip ${basename(filePath)} — cannot determine lang from filename`);
    return null;
  }
  const { slug, lang } = parsed;

  const errors = [];
  if (!fm.title) errors.push('title');
  if (!fm.excerpt) errors.push('excerpt');
  if (!fm.category) errors.push('category');
  if (!fm.publishedAt) errors.push('publishedAt');
  if (fm.category && !VALID_BLOG_CATEGORIES.has(fm.category)) {
    errors.push(`category "${fm.category}" not valid (valid: ${[...VALID_BLOG_CATEGORIES].join(', ')})`);
  }
  if (errors.length) {
    console.error(`[blog] ERROR in ${basename(filePath)}: missing/invalid fields: ${errors.join(', ')}`);
    process.exitCode = 1;
    return null;
  }

  const meta = {
    slug: fm.slug || slug,
    lang,
    title: fm.title,
    excerpt: fm.excerpt,
    author: fm.author || 'Miguel',
    publishedAt: new Date(fm.publishedAt).toISOString(),
    ...(fm.updatedAt ? { updatedAt: new Date(fm.updatedAt).toISOString() } : {}),
    category: fm.category,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    coverImage: fm.coverImage || '',
    readingTime: computeReadingTime(body),
    featured: Boolean(fm.featured),
    published: fm.published !== false,
  };

  return { meta, body: raw, slug: meta.slug, lang, filePath };
}

async function generateBlog() {
  const files = await walkDir(join(INFO_DIR, 'blog'));
  const parsed = files.map(processBlogFile).filter(Boolean);

  const bySlug = new Map();
  for (const item of parsed) {
    if (!bySlug.has(item.slug)) bySlug.set(item.slug, {});
    bySlug.get(item.slug)[item.lang] = item;
  }

  const postsOut = join(ASSETS_DIR, 'blog', 'posts');
  ensureDir(postsOut);

  const manifests = { en: [], es: [] };

  for (const [slug, langs] of bySlug) {
    for (const targetLang of SUPPORTED_LANGS) {
      const item = langs[targetLang] || langs[Object.keys(langs)[0]];
      manifests[targetLang].push(item.meta);

      const destFile = join(postsOut, `${slug}.${targetLang}.md`);
      copyFileSync(item.filePath, destFile);
    }
  }

  const categories = [...new Set(parsed.map(p => p.meta.category))];
  const lastUpdated = new Date().toISOString();

  for (const lang of SUPPORTED_LANGS) {
    const sorted = manifests[lang]
      .filter(p => p.published)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const manifest = { posts: sorted, categories, lastUpdated };
    const outPath = join(ASSETS_DIR, 'blog', `manifest.${lang}.json`);
    writeFileSync(outPath, JSON.stringify(manifest, null, 2));
    console.log(`[blog] wrote manifest.${lang}.json (${sorted.length} posts)`);
  }
}

// ── portfolio ───────────────────────────────────────────────────────────────

function processPortfolioFile(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const { data: fm, content: body } = matter(raw);
  const parsed = parseLangFromPath(filePath);
  if (!parsed) {
    console.warn(`[portfolio] skip ${basename(filePath)} — cannot determine lang from filename`);
    return null;
  }
  const { slug, lang } = parsed;

  const errors = [];
  if (!fm.title) errors.push('title');
  if (!fm.description) errors.push('description');
  if (!fm.type) errors.push('type');
  if (!fm.frameworks?.length) errors.push('frameworks');
  if (errors.length) {
    console.error(`[portfolio] ERROR in ${basename(filePath)}: missing/invalid fields: ${errors.join(', ')}`);
    process.exitCode = 1;
    return null;
  }

  const meta = {
    slug: fm.slug || slug,
    lang,
    id: fm.id || slug,
    title: fm.title,
    description: fm.description,
    type: fm.type,
    frameworks: Array.isArray(fm.frameworks) ? fm.frameworks : [],
    images: Array.isArray(fm.images) ? fm.images : [],
    ...(fm.liveUrl ? { liveUrl: fm.liveUrl } : {}),
    ...(fm.githubUrl ? { githubUrl: fm.githubUrl } : {}),
    featured: Boolean(fm.featured),
    ...(fm.completedAt ? { completedAt: fm.completedAt } : {}),
    ...(fm.client ? { client: fm.client } : {}),
    ...(fm.role ? { role: fm.role } : {}),
  };

  return { meta, body: raw, slug: meta.slug, lang, filePath };
}

async function generatePortfolio() {
  const files = await walkDir(join(INFO_DIR, 'portfolio'));
  const parsed = files.map(processPortfolioFile).filter(Boolean);

  const bySlug = new Map();
  for (const item of parsed) {
    if (!bySlug.has(item.slug)) bySlug.set(item.slug, {});
    bySlug.get(item.slug)[item.lang] = item;
  }

  const postsOut = join(ASSETS_DIR, 'portfolio', 'posts');
  ensureDir(postsOut);

  const manifests = { en: [], es: [] };

  for (const [slug, langs] of bySlug) {
    for (const targetLang of SUPPORTED_LANGS) {
      const item = langs[targetLang] || langs[Object.keys(langs)[0]];
      manifests[targetLang].push(item.meta);

      const destFile = join(postsOut, `${slug}.${targetLang}.md`);
      copyFileSync(item.filePath, destFile);
    }
  }

  const lastUpdated = new Date().toISOString();

  for (const lang of SUPPORTED_LANGS) {
    const sorted = manifests[lang].sort((a, b) =>
      a.featured === b.featured ? 0 : a.featured ? -1 : 1
    );
    const manifest = { projects: sorted, lastUpdated };
    const outPath = join(ASSETS_DIR, 'portfolio', `manifest.${lang}.json`);
    writeFileSync(outPath, JSON.stringify(manifest, null, 2));
    console.log(`[portfolio] wrote manifest.${lang}.json (${sorted.length} projects)`);
  }
}

// ── main ────────────────────────────────────────────────────────────────────

async function generate() {
  console.log('[generate-content] scanning information/...');
  ensureDir(join(ASSETS_DIR, 'blog', 'posts'));
  ensureDir(join(ASSETS_DIR, 'portfolio', 'posts'));
  await generateBlog();
  await generatePortfolio();
  console.log('[generate-content] done.');
}

const isWatch = process.argv.includes('--watch');

if (isWatch) {
  await generate();
  console.log('[generate-content] watching information/ for changes...');

  let debounce;
  const watcher = watch(INFO_DIR, { recursive: true }, (_, filename) => {
    if (!filename || !filename.endsWith('.md')) return;
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      console.log(`[generate-content] change detected (${filename}), regenerating...`);
      await generate();
    }, 150);
  });

  process.on('SIGINT', () => { watcher.close(); process.exit(0); });
} else {
  await generate();
}
