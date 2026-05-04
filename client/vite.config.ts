import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const CONTENT_DIR = path.resolve(__dirname, 'public/content');

function parseFrontmatter(raw: string): Record<string, unknown> {
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
  return result;
}

function walkDir(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, files);
    else files.push(full);
  }
  return files;
}

function getGitDate(filePath: string): string | undefined {
  try {
    const result = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return result || undefined;
  } catch {
    return undefined;
  }
}

function lessonMeta(): Plugin {
  const virtualId = 'virtual:lesson-meta';
  const resolvedId = '\0' + virtualId;
  const dateCache: Record<string, string> = {};

  function buildModule() {
    const allFiles = walkDir(CONTENT_DIR);
    const mdFiles = allFiles.filter((f) => f.endsWith('.md'));
    const jsonFiles = allFiles.filter((f) => f.endsWith('.json'));

    const meta: Record<string, unknown> = {};
    for (const file of mdFiles) {
      const raw = fs.readFileSync(file, 'utf-8');
      const fm = parseFrontmatter(raw);
      const rel = path.relative(CONTENT_DIR, file).replace(/\\/g, '/');
      const slug = rel.slice(0, -'.md'.length);
      if (!dateCache[file]) {
        const d = getGitDate(file);
        if (d) dateCache[file] = d;
      }
      meta[slug] = { ...fm, lastUpdated: dateCache[file] };
    }

    const quizFiles: Record<string, unknown> = {};
    for (const file of jsonFiles) {
      const rel = path.relative(CONTENT_DIR, file).replace(/\\/g, '/');
      try {
        quizFiles[rel] = JSON.parse(fs.readFileSync(file, 'utf-8'));
      } catch {
        quizFiles[rel] = [];
      }
    }

    return `export const meta = ${JSON.stringify(meta)};\nexport const quizFiles = ${JSON.stringify(quizFiles)};`;
  }

  return {
    name: 'lesson-meta',
    resolveId(id) {
      return id === virtualId ? resolvedId : null;
    },
    load(id) {
      return id === resolvedId ? buildModule() : null;
    },
    configureServer(server) {
      server.watcher.add(CONTENT_DIR);
      server.watcher.on('change', (file) => {
        if (
          file.startsWith(CONTENT_DIR) &&
          (file.endsWith('.md') || file.endsWith('.json'))
        ) {
          const mod = server.moduleGraph.getModuleById(resolvedId);
          if (mod) server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), lessonMeta()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
