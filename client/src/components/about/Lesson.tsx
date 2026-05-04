import { BookOpen } from 'lucide-react';

export const Lesson = () => {
  return (
    <section className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-primary/30 bg-primary/10">
            <BookOpen size={15} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">How a lesson works</h2>
        </div>
        <div className="space-y-0">
          {[
            {
              step: '01',
              title: 'Concept',
              body: 'A plain-English explanation of the system component: what it is, why it exists, and the mental model that lets you reason about it.',
            },
            {
              step: '02',
              title: 'Bottleneck perspective',
              body: 'Where does this component become the limiting factor? What happens when it saturates, starves, or fails?',
            },
            {
              step: '03',
              title: 'Optimization perspective',
              body: 'The lever you pull to fix or mitigate the bottleneck, with concrete techniques and trade-offs explained.',
            },
            {
              step: '04',
              title: 'Flashcard review',
              body: 'Active recall cards that test the mental models you just built, not trivia, but the reasoning patterns you will use in production.',
            },
          ].map(({ step, title, body }, i, arr) => (
            <div key={step} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-xs text-primary">
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-border" style={{ minHeight: '2.5rem' }} />
                )}
              </div>
              <div className="pb-8">
                <div className="mb-1 text-sm font-semibold text-foreground">{title}</div>
                <div className="text-sm text-muted-foreground">{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
