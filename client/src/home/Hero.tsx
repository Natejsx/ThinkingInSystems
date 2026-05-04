import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { getAllLessons, buildNavTree } from '@/lib/content';
import { meta as lessonMetaRaw, quizFiles } from 'virtual:lesson-meta';

const TERMINAL_LINES = [
  { prompt: '$', text: ' understand what the system is doing' },
  { prompt: '$', text: ' find where the bottleneck actually is' },
  { prompt: '$', text: ' reason from first principles' },
];

const DIAGRAM_STEPS = [
  { label: 'Inputs', color: '#f59e0b', desc: 'requests, data, events' },
  { label: 'Processing', color: '#fb923c', desc: 'cpu, memory, i/o' },
  { label: 'Outputs', color: '#f59e0b', desc: 'results, side effects' },
];

export function Hero() {
  const lessonCount = useMemo(() => Object.keys(lessonMetaRaw).length, []);
  const cardCount = useMemo(() => Object.keys(quizFiles).length, []);
  const topicCount = useMemo(() => buildNavTree(getAllLessons()).length, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-20">
      <div className="landing-grid-bg pointer-events-none absolute inset-0" />
      <div className="landing-radial-fade pointer-events-none absolute inset-0" />

      {/* Faint background symbols */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {(
          [
            { sym: '→',  top:  4, left:  3, px: 48, alpha: 0.06, rot: -12 },
            { sym: '∑',  top:  8, left: 18, px: 36, alpha: 0.04, rot:   8 },
            { sym: 'λ',  top:  3, left: 42, px: 64, alpha: 0.03, rot:  -6 },
            { sym: 'O',  top:  6, left: 62, px: 48, alpha: 0.04, rot:  15 },
            { sym: '/',  top:  2, left: 80, px: 56, alpha: 0.05, rot: -20 },
            { sym: 'n',  top: 12, left: 92, px: 36, alpha: 0.04, rot:  10 },
            { sym: '#',  top: 22, left:  7, px: 80, alpha: 0.03, rot:  18 },
            { sym: '~',  top: 28, left: 30, px: 36, alpha: 0.04, rot:  -9 },
            { sym: '[',  top: 32, left: 52, px: 56, alpha: 0.03, rot:   5 },
            { sym: '%',  top: 25, left: 72, px: 48, alpha: 0.05, rot: -14 },
            { sym: '|',  top: 18, left: 88, px: 64, alpha: 0.04, rot:   3 },
            { sym: 'τ',  top: 45, left:  2, px: 48, alpha: 0.05, rot:  22 },
            { sym: '&',  top: 50, left: 20, px: 36, alpha: 0.03, rot:  -7 },
            { sym: '_',  top: 55, left: 45, px: 56, alpha: 0.04, rot:  12 },
            { sym: '→',  top: 48, left: 65, px: 48, alpha: 0.03, rot: -18 },
            { sym: '}',  top: 42, left: 84, px: 56, alpha: 0.05, rot:   9 },
            { sym: '1',  top: 62, left:  8, px: 64, alpha: 0.03, rot: -15 },
            { sym: 'μ',  top: 68, left: 28, px: 48, alpha: 0.04, rot:  20 },
            { sym: '$',  top: 72, left: 55, px: 36, alpha: 0.05, rot:  -8 },
            { sym: '<',  top: 65, left: 76, px: 56, alpha: 0.03, rot:  14 },
            { sym: '∞',  top: 58, left: 94, px: 48, alpha: 0.04, rot: -22 },
            { sym: '{',  top: 80, left:  1, px: 48, alpha: 0.04, rot:  11 },
            { sym: '#',  top: 82, left: 38, px: 56, alpha: 0.03, rot:  -5 },
            { sym: '~',  top: 78, left: 68, px: 64, alpha: 0.04, rot:  17 },
            { sym: 'O',  top: 85, left: 88, px: 48, alpha: 0.05, rot: -13 },
          ] as const
        ).map(({ sym, top, left, px, alpha, rot }, i) => (
          <span
            key={i}
            className="absolute font-mono font-bold"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${px}px`,
              color: `hsl(38 92% 50% / ${alpha})`,
              transform: `rotate(${rot}deg)`,
            }}
          >
            {sym}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: text content */}
          <div className="flex flex-col items-start text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Systems Education Platform
            </div>

            <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
              <span className="landing-gradient-text">ThinkingIn</span>
              <br />
              <span className="landing-gradient-text">Systems</span>
            </h1>

            <div className="mb-8 w-full max-w-md rounded-xl border border-border bg-card/60 px-6 py-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
              </div>
              {TERMINAL_LINES.map((line, i) => (
                <div
                  key={i}
                  className="animate-fade-in-up font-mono text-sm leading-7"
                  style={{ animationDelay: `${0.2 + i * 0.15}s` }}
                >
                  <span className="font-semibold text-primary">{line.prompt}</span>
                  <span className="text-foreground/80">{line.text}</span>
                  {i === TERMINAL_LINES.length - 1 && <span className="terminal-cursor ml-0.5" />}
                </div>
              ))}
            </div>

            <div
              className="flex animate-fade-in-up flex-wrap items-center gap-3"
              style={{ animationDelay: '0.7s' }}
            >
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                <span className="font-mono text-primary-foreground/60">$</span>
                Start Learning
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                Explore Topics
              </Link>
            </div>

            <div
              className="mt-10 flex animate-fade-in flex-wrap items-center gap-8"
              style={{ animationDelay: '1s' }}
            >
              {[
                { value: lessonCount, label: 'Lessons' },
                { value: cardCount, label: 'Flashcard Decks' },
                { value: topicCount, label: 'Topic Areas' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: system diagram */}
          <div
            className="flex animate-fade-in items-center justify-center"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
              <div className="mb-6 font-mono text-xs text-muted-foreground/50">
                // the mental model
              </div>

              <div className="flex flex-col gap-3">
                {DIAGRAM_STEPS.map(({ label, color, desc }, i) => (
                  <div key={label}>
                    <div className="flex items-center gap-3 rounded-lg border px-4 py-3"
                      style={{ borderColor: `${color}30`, backgroundColor: `${color}0c` }}>
                      <div className="h-2 w-2 rounded-full" style={{ background: color }} />
                      <div className="flex-1">
                        <div className="font-mono text-xs font-semibold" style={{ color }}>
                          {label}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground/50">{desc}</div>
                      </div>
                    </div>
                    {i < DIAGRAM_STEPS.length - 1 && (
                      <div className="flex items-center justify-center py-1">
                        <span className="font-mono text-sm text-muted-foreground/30">↓</span>
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <div className="flex-1">
                      <div className="font-mono text-xs font-semibold text-red-400">
                        Constraints
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground/50">
                        throughput, latency, capacity
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4 font-mono text-[10px] text-muted-foreground/30">
                every system has all four
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
