import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, GitPullRequest } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { FlashcardDeck } from './FlashcardDeck';
import { getLessonBySlug, getFlashcardsForLesson } from '@/lib/content';
import type { Lesson, FlashcardItem } from '@/types';

const REPO_URL = 'https://github.com/Natejsx/ThinkingInSystems';

interface Props {
  slug: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function ordinal(n: number): string {
  if (n >= 11 && n <= 13) return `${n}th`;
  if (n % 10 === 1) return `${n}st`;
  if (n % 10 === 2) return `${n}nd`;
  if (n % 10 === 3) return `${n}rd`;
  return `${n}th`;
}

function formatDate(raw: string): string {
  const d = new Date(raw.includes('-') ? raw.replace(/-/g, '/') : raw);
  if (isNaN(d.getTime())) return raw;
  return `${MONTHS[d.getMonth()]} ${ordinal(d.getDate())}, ${d.getFullYear()}`;
}

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  for (const line of content.split('\n')) {
    const match = line.match(/^(#{2,3})(?!#)\s+(.+)/);
    if (!match) continue;
    const raw = match[2].trim();
    headings.push({
      level: match[1].length,
      text: raw.replace(/`([^`]+)`/g, '$1'),
      id: slugify(raw),
    });
  }
  return headings;
}

function Breadcrumb({ slug }: { slug: string }) {
  const parts = slug.split('/');
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      <Link to="/docs" className="transition-colors hover:text-primary">
        Docs
      </Link>
      {parts.map((part, i) => {
        const path = parts.slice(0, i + 1).join('/');
        const isLast = i === parts.length - 1;
        const label = part
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight size={11} className="text-muted-foreground/40" />
            {isLast ? (
              <span className="text-foreground/80">{label}</span>
            ) : (
              <Link to={`/docs/${path}`} className="transition-colors hover:text-primary">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function TableOfContents({ headings, activeId }: { headings: Heading[]; activeId: string }) {
  if (headings.length === 0) return null;
  return (
    <aside className="hidden w-52 shrink-0 xl:block">
      <div className="sticky top-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          On this page
        </p>
        <nav className="space-y-0.5">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`block truncate rounded py-1 text-xs transition-colors ${h.level === 3 ? 'pl-3' : ''} ${
                activeId === h.id
                  ? 'text-primary'
                  : 'text-muted-foreground/50 hover:text-muted-foreground'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export function DocPage({ slug }: Props) {
  const [lesson, setLesson] = useState<Lesson | null | 'loading'>('loading');
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setLesson('loading');
    setCards([]);
    getLessonBySlug(slug).then(async (l) => {
      setLesson(l);
      if (l) {
        const fc = await getFlashcardsForLesson(l);
        setCards(fc);
      }
    });
  }, [slug]);

  useEffect(() => {
    setActiveId('');
  }, [slug]);

  const headings = useMemo(
    () => (lesson && lesson !== 'loading' ? parseHeadings(lesson.content) : []),
    [lesson]
  );

  useEffect(() => {
    if (headings.length === 0) return;
    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );
    observerRef.current = observer;
    const timer = setTimeout(() => {
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });
    }, 100);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [headings]);

  if (lesson === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-muted-foreground">
          Lesson not found.{' '}
          <Link to="/docs" className="text-primary hover:underline">
            Browse topics
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-10 xl:flex xl:gap-14">
      <article className="min-w-0 flex-1">
        <Breadcrumb slug={slug} />

        <header className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-foreground">{lesson.title}</h1>
          {lesson.tags && lesson.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {lesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {lesson.description && (
            <p className="mb-3 leading-relaxed text-muted-foreground">{lesson.description}</p>
          )}
          {lesson.lastUpdated && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
              <Clock size={11} />
              <span>Last Updated: {formatDate(lesson.lastUpdated)}</span>
            </div>
          )}
        </header>

        <MarkdownRenderer content={lesson.content} />

        {cards.length > 0 && <FlashcardDeck cards={cards} />}

        <div className="mt-12 border-t border-[#2d2720] pt-6">
          <div
            className="flex items-start gap-3 rounded-lg border border-[#2d2720] px-4 py-4"
            style={{ backgroundColor: '#161210' }}
          >
            <GitPullRequest size={15} className="mt-0.5 shrink-0 text-[#584f48]" />
            <p className="text-xs leading-relaxed text-[#584f48]">
              See something wrong or outdated?{' '}
              <a
                href={`${REPO_URL}/issues/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary transition-colors hover:underline"
              >
                Open an issue
              </a>{' '}
              or{' '}
              <a
                href={`${REPO_URL}/blob/main/client/public/content/${slug}.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary transition-colors hover:underline"
              >
                contribute to this doc on GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </article>

      <TableOfContents headings={headings} activeId={activeId} />
    </div>
  );
}
