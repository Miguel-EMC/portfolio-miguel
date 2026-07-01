/**
 * generate-blog-manifest.mjs
 *
 * Scans apps/portfolio/src/assets/blog/posts/*.md, parses frontmatter,
 * derives readingTime, and writes manifest.json.
 *
 * Files with a leading '_' are treated as templates and skipped.
 *
 * Usage: node scripts/generate-blog-manifest.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { matter, readingTime } from './lib/frontmatter.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const POSTS_DIR = join(ROOT, 'apps/portfolio/src/assets/blog/posts');
const OUT_FILE = join(ROOT, 'apps/portfolio/src/assets/blog/manifest.json');

/** Valid blog categories matching BlogCategory type. */
const VALID_CATEGORIES = new Set([
  'technology', 'programming', 'web-development',
  'mobile-development', 'devops', 'career', 'tutorials', 'general',
]);

function buildManifest() {
  let files;
  try {
    files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  } catch {
    console.error(`[blog] Posts directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  /** @type {Array<import('../apps/portfolio/src/app/interfaces/blog.interface').BlogPostMeta>} */
  const posts = [];
  const categorySet = new Set();

  for (const file of files) {
    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);

    // slug: frontmatter > filename without extension
    const slug = data.slug || basename(file, '.md');

    // Skip unpublished posts
    if (data.published === false) continue;

    const category = VALID_CATEGORIES.has(data.category) ? data.category : 'general';
    categorySet.add(category);

    posts.push({
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || '',
      author: data.author || 'Miguel Muzo',
      publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : new Date().toISOString(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,
      category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      coverImage: data.coverImage || '',
      readingTime: readingTime(content),
      featured: Boolean(data.featured),
      published: true,
    });
  }

  // Sort by publishedAt descending (newest first)
  posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  /** @type {import('../apps/portfolio/src/app/interfaces/blog.interface').BlogManifest} */
  const manifest = {
    posts,
    categories: Array.from(categorySet),
    lastUpdated: new Date().toISOString(),
  };

  writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`[blog] ✅ manifest.json → ${posts.length} posts, categories: [${[...categorySet].join(', ')}]`);
}

buildManifest();
