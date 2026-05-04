import { meta as lessonMetaRaw, quizFiles } from 'virtual:lesson-meta';
import type { LessonSummary, Lesson, FlashcardItem } from '@/types';
import { buildNavTree, searchLessons } from './nav';

export { buildNavTree, searchLessons };

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

export function getAllLessons(): LessonSummary[] {
  return Object.entries(lessonMetaRaw).map(([slug, data]) => ({
    slug,
    ...(data as Omit<LessonSummary, 'slug'>),
  }));
}

export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
  try {
    const res = await fetch(`/content/${slug}.md`);
    if (!res.ok) return null;
    const raw = await res.text();
    const content = stripFrontmatter(raw);
    const summaries = getAllLessons();
    const summary = summaries.find((s) => s.slug === slug);
    return summary ? { ...summary, content } : { slug, title: slug, content };
  } catch {
    return null;
  }
}

export async function getFlashcardsForLesson(lesson: LessonSummary): Promise<FlashcardItem[]> {
  if (!lesson.flashcards) return [];
  const dir = lesson.slug.split('/').slice(0, -1).join('/');
  const key = dir ? `${dir}/${lesson.flashcards}` : lesson.flashcards;
  const cached = quizFiles[key];
  if (cached) return cached as FlashcardItem[];
  try {
    const res = await fetch(`/content/${key}`);
    if (!res.ok) return [];
    return (await res.json()) as FlashcardItem[];
  } catch {
    return [];
  }
}
