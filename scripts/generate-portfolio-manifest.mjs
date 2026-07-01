/**
 * generate-portfolio-manifest.mjs
 *
 * Scans apps/portfolio/src/assets/portfolio/projects/<slug>/index.md,
 * parses bilingual frontmatter, resolves images, and writes projects.json.
 *
 * Directories starting with '_' are skipped (templates, etc.).
 *
 * Usage: node scripts/generate-portfolio-manifest.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { matter } from './lib/frontmatter.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const PROJECTS_DIR = join(ROOT, 'apps/portfolio/src/assets/portfolio/projects');
const OUT_FILE = join(ROOT, 'apps/portfolio/src/assets/portfolio/projects.json');

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);

/** Sort images: cover.* or files starting with 01- come first. */
function sortImages(files) {
  return [...files].sort((a, b) => {
    const aBase = basename(a).toLowerCase();
    const bBase = basename(b).toLowerCase();
    const aFirst = aBase.startsWith('cover') || aBase.startsWith('01-');
    const bFirst = bBase.startsWith('cover') || bBase.startsWith('01-');
    if (aFirst && !bFirst) return -1;
    if (!aFirst && bFirst) return 1;
    return aBase.localeCompare(bBase);
  });
}

/** Resolve images: verbatim list from frontmatter or auto-collect from folder. */
function resolveImages(data, slugDir, slug) {
  // If frontmatter provides images (non-empty array), use them
  if (Array.isArray(data.images) && data.images.length > 0) {
    return data.images.map(img => {
      // Pass-through external URLs; resolve relative paths
      if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
        return img;
      }
      return `/assets/portfolio/projects/${slug}/${img}`;
    });
  }

  // Auto-collect from directory
  try {
    const files = readdirSync(slugDir)
      .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
      .map(f => `/assets/portfolio/projects/${slug}/${f}`);
    return sortImages(files);
  } catch {
    return [];
  }
}

function buildManifest() {
  let slugDirs;
  try {
    slugDirs = readdirSync(PROJECTS_DIR)
      .filter(name => !name.startsWith('_'))
      .filter(name => statSync(join(PROJECTS_DIR, name)).isDirectory());
  } catch {
    console.error(`[portfolio] Projects directory not found: ${PROJECTS_DIR}`);
    process.exit(1);
  }

  const projects = [];

  for (const slug of slugDirs) {
    const indexPath = join(PROJECTS_DIR, slug, 'index.md');
    let raw;
    try {
      raw = readFileSync(indexPath, 'utf-8');
    } catch {
      console.warn(`[portfolio] ⚠️  Skipping ${slug}: no index.md found`);
      continue;
    }

    const { data } = matter(raw);
    const slugDir = join(PROJECTS_DIR, slug);

    projects.push({
      id: data.id || slug,
      slug: data.slug || slug,
      type: data.type === 'personal' ? 'personal' : 'professional',
      platform: data.platform === 'mobile' ? 'mobile' : 'web',
      frameworks: Array.isArray(data.frameworks) ? data.frameworks : [],
      liveUrl: data.liveUrl || '',
      githubUrl: data.githubUrl || undefined,
      featured: Boolean(data.featured),
      completedAt: data.completedAt ? String(data.completedAt) : undefined,
      client: data.client || undefined,
      role: data.role || undefined,
      // Bilingual text objects
      title: { es: data.title_es || data.title || slug, en: data.title_en || data.title || slug },
      description: { es: data.description_es || '', en: data.description_en || '' },
      longDescription: { es: data.longDescription_es || '', en: data.longDescription_en || '' },
      challenges: {
        es: Array.isArray(data.challenges_es) ? data.challenges_es : [],
        en: Array.isArray(data.challenges_en) ? data.challenges_en : [],
      },
      solutions: {
        es: Array.isArray(data.solutions_es) ? data.solutions_es : [],
        en: Array.isArray(data.solutions_en) ? data.solutions_en : [],
      },
      results: {
        es: Array.isArray(data.results_es) ? data.results_es : [],
        en: Array.isArray(data.results_en) ? data.results_en : [],
      },
      images: resolveImages(data, slugDir, slug),
    });
  }

  // Sort by completedAt descending (newest first)
  projects.sort((a, b) => {
    if (!a.completedAt) return 1;
    if (!b.completedAt) return -1;
    return new Date(b.completedAt) - new Date(a.completedAt);
  });

  const manifest = {
    projects,
    lastUpdated: new Date().toISOString(),
  };

  writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`[portfolio] ✅ projects.json → ${projects.length} projects (${projects.filter(p => p.featured).length} featured)`);
}

buildManifest();
