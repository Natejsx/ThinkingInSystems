import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { FlashcardItem } from '@/types';

interface Props {
  cards: FlashcardItem[];
}

function CardMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const isBlock = node?.position?.start?.line !== node?.position?.end?.line;
          if (match && isBlock) {
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: '0.5rem 0',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  background: 'hsl(24 8% 7%)',
                }}
                codeTagProps={{ style: { background: 'none', border: 'none', padding: 0 } }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          }
          return (
            <code
              className="rounded border border-border bg-secondary px-1 py-0.5 font-mono text-[0.8em] text-primary"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
        p({ children }) {
          return <p className="mb-1 leading-relaxed last:mb-0">{children}</p>;
        },
        strong({ children }) {
          return (
            <strong className="font-semibold" style={{ color: 'hsl(30 10% 78%)' }}>
              {children}
            </strong>
          );
        },
        ul({ children }) {
          return <ul className="mb-1 list-disc pl-4 leading-relaxed">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="mb-1 list-decimal pl-4 leading-relaxed">{children}</ol>;
        },
        li({ children }) {
          return <li className="mb-0.5">{children}</li>;
        },
        table({ children }) {
          return (
            <div className="my-2 overflow-x-auto">
              <table className="w-full border-collapse text-xs">{children}</table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border border-border bg-secondary px-2 py-1 text-left font-semibold text-foreground">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-border px-2 py-1 text-muted-foreground">{children}</td>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function FlashcardDeck({ cards }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const prev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const next = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  }, [cards.length]);

  const flip = useCallback(() => setFlipped((f) => !f), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === ' ') {
        e.preventDefault();
        flip();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, flip]);

  if (!cards.length) return null;

  const card = cards[index];
  const progress = ((index + 1) / cards.length) * 100;

  return (
    <section className="mt-10 border-t border-border pt-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Flashcards</h3>
        <span className="text-xs text-muted-foreground">
          {index + 1} / {cards.length}
        </span>
      </div>

      <div className="mb-5 h-0.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="flashcard-scene mb-5 cursor-pointer select-none"
        onClick={flip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && flip()}
        title="Click or press Space to flip"
      >
        <div className={`flashcard-inner min-h-[140px] ${flipped ? 'flipped' : ''}`}>
          <div className="flashcard-face flex flex-col justify-center rounded-xl border border-border bg-card px-6 py-5">
            <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-primary">
              Question
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground">
              <CardMarkdown content={card.front} />
            </div>
            <div className="mt-4 text-[10px] text-muted-foreground/50">click to reveal</div>
          </div>
          <div className="flashcard-face flashcard-back flex flex-col justify-center rounded-xl border border-primary/30 bg-card px-6 py-5">
            <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-primary">
              Answer
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground">
              <CardMarkdown content={card.back} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ChevronLeft size={13} /> Prev
        </button>

        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
                setIndex(i);
              }}
              className="transition-all duration-200"
              style={{
                width: i === index ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === index ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          Next <ChevronRight size={13} />
        </button>
      </div>

      <p className="mt-3 text-center text-[10px] text-muted-foreground/50">
        ← → to navigate · Space to flip
      </p>
    </section>
  );
}
