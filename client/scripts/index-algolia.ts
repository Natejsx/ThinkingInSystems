import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { algoliasearch } from 'algoliasearch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../public/content');
const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME ?? 'thinkinginsystems';

interface FrontMatter {
  title?: string;
  description?: string;
  tags?: string[];
  order?: number;
}

interface AlgoliaRecord {
  objectID: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  order: number;
  sectionTitle: string;
  sectionAnchor: string;
  sectionContent: string;
}

function parseFrontmatter(raw: string): FrontMatter {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const result: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      result[key] = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else if (val !== '' && !isNaN(Number(val))) {
      result[key] = Number(val);
    } else {
      result[key] = val.replace(/^['"]|['"]$/g, '');
    }
  }
  return result as FrontMatter;
}

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/gm, '')
    .replace(/\[!(?:BOTTLENECK|OPTIMIZATION|NOTE|WARNING|TIP)\]/g, '')
    .replace(/^>\s?/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_\n]+)_{1,3}/g, '$1')
    .replace(/^\|[-| :]+\|$/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

interface Section {
  title: string;
  anchor: string;
  content: string;
}

function splitSections(content: string, lessonTitle: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split('\n');

  let currentTitle = lessonTitle;
  let currentAnchor = '';
  let currentLines: string[] = [];

  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    if (h2) {
      const stripped = stripMarkdown(currentLines.join('\n'));
      if (stripped.trim().length > 30) {
        sections.push({ title: currentTitle, anchor: currentAnchor, content: stripped });
      }
      currentTitle = h2[1].replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1').trim();
      currentAnchor = slugify(h2[1]);
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  const lastText = stripMarkdown(currentLines.join('\n'));
  if (lastText.trim().length > 30) {
    sections.push({ title: currentTitle, anchor: currentAnchor, content: lastText });
  }

  return sections;
}

function walkDir(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, files);
    else if (entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

async function main() {
  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;

  if (!appId || !adminKey) {
    console.error('Set ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY in .env');
    process.exit(1);
  }

  const client = algoliasearch(appId, adminKey);
  const records: AlgoliaRecord[] = [];

  for (const file of walkDir(CONTENT_DIR)) {
    const raw = fs.readFileSync(file, 'utf-8');
    const meta = parseFrontmatter(raw);
    const content = stripFrontmatter(raw);
    const rel = path.relative(CONTENT_DIR, file).replace(/\\/g, '/');
    const slug = rel.slice(0, -'.md'.length);
    const category = slug.split('/')[0];
    const title = meta.title ?? slug.split('/').pop() ?? slug;

    for (const section of splitSections(content, title)) {
      records.push({
        objectID: section.anchor ? `${slug}#${section.anchor}` : slug,
        slug,
        category,
        title,
        description: meta.description ?? '',
        tags: meta.tags ?? [],
        order: meta.order ?? 999,
        sectionTitle: section.title,
        sectionAnchor: section.anchor,
        sectionContent: section.content.slice(0, 600),
      });
    }
  }

  console.log('Configuring index settings...');
  await client.setSettings({
    indexName: INDEX_NAME,
    indexSettings: {
      searchableAttributes: [
        'sectionTitle',
        'title',
        'sectionContent',
        'description',
        'tags',
      ],
      attributesToSnippet: ['sectionContent:25'],
      attributesToHighlight: ['sectionTitle', 'title'],
      customRanking: ['asc(order)'],
      attributesForFaceting: ['category', 'tags'],
    },
  });

  console.log(`Indexing ${records.length} records to "${INDEX_NAME}"...`);
  await client.replaceAllObjects({
    indexName: INDEX_NAME,
    objects: records as unknown as Record<string, unknown>[],
  });
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
