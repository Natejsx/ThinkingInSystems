import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { NavNode } from '@/types';
import { openSearch } from '@/components/search/SearchModal';

const TOPIC_COLORS: Record<string, string> = {
  foundations: '#f59e0b',
  cpu: '#f97316',
  memory: '#eab308',
  processes: '#fb923c',
  concurrency: '#ef4444',
  io: '#38bdf8',
  networking: '#0ea5e9',
  observability: '#a78bfa',
  containers: '#34d399',
  'distributed-systems': '#22d3ee',
};

function topicColor(slug: string): string {
  const key = slug.split('/')[0];
  return TOPIC_COLORS[key] ?? '#f59e0b';
}

interface Props {
  tree: NavNode[];
  lessons?: unknown[];
}

export function DocsHome({ tree }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-1 text-3xl font-bold text-foreground">Documentation</h1>
      <p className="mb-8 text-muted-foreground">
        Learn how systems work through the inputs, processing, outputs, and constraints framework.
      </p>

      <button
        onClick={openSearch}
        className="mb-10 flex w-full items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground/60 transition-colors hover:border-primary/40 hover:bg-secondary hover:text-muted-foreground"
      >
        <Search size={15} className="shrink-0" />
        <span className="flex-1 text-left">Search topics, processes, concepts...</span>
        <kbd className="rounded border border-border/60 px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground/30">
          ⌘K
        </kbd>
      </button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tree.map((topic) => {
          const color = topicColor(topic.slug);
          const lessonCount = topic.children?.length ?? 0;
          const href = topic.indexPath
            ? `/docs/${topic.indexPath}`
            : topic.children?.[0]?.summary?.slug
              ? `/docs/${topic.children[0].summary.slug}`
              : `/docs/${topic.slug}`;

          return (
            <Link
              key={topic.slug}
              to={href}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div
                className="mb-2 flex h-8 w-8 items-center justify-center rounded text-[11px] font-bold"
                style={{ background: `${color}18`, color }}
              >
                {topic.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="mb-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {topic.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {lessonCount} {lessonCount === 1 ? 'topic' : 'topics'}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
