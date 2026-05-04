export interface LessonSummary {
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
  order?: number;
  lastUpdated?: string;
  flashcards?: string;
}

export interface Lesson extends LessonSummary {
  content: string;
}

export interface NavNode {
  name: string;
  slug: string;
  fullPath: string;
  type: 'category' | 'lesson';
  order: number;
  children?: NavNode[];
  summary?: LessonSummary;
  indexPath?: string;
}

export interface FlashcardItem {
  id?: string;
  front: string;
  back: string;
}
