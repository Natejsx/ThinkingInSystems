declare module 'virtual:lesson-meta' {
  import type { LessonSummary } from './index';
  export const meta: Record<string, Omit<LessonSummary, 'slug'>>;
  export const quizFiles: Record<string, unknown>;
}
