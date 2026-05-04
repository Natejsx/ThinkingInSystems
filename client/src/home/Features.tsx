import { Cpu, AlertTriangle, FileText, CreditCard, Search, TrendingUp } from 'lucide-react';

const FEATURES = [
  {
    icon: Cpu,
    title: 'Systems Thinking',
    description:
      'Every lesson teaches you to see any system as inputs, processing, outputs, and constraints, so you can reason about anything.',
  },
  {
    icon: AlertTriangle,
    title: 'Bottleneck Analysis',
    description:
      'Learn to identify the one constraint limiting your system. CPU saturation, memory pressure, I/O wait, lock contention, they all leave signatures.',
  },
  {
    icon: FileText,
    title: 'Structured Docs',
    description:
      'Reference-style markdown with clear mental models, real measurements, and code examples grounded in how production systems actually behave.',
  },
  {
    icon: CreditCard,
    title: 'Active Recall Cards',
    description:
      'Interactive flashcards at the end of every lesson. Flip, quiz yourself, and build durable mental models that survive the next on-call incident.',
  },
  {
    icon: Search,
    title: 'Instant Search',
    description:
      'Find any concept across the entire library instantly, from virtual memory to consensus algorithms.',
  },
  {
    icon: TrendingUp,
    title: 'Optimization Focus',
    description:
      'Every bottleneck gets a paired optimization. Theory and practice together, so you know what lever to pull and why it works.',
  },
];

export function Features() {
  return (
    <section className="relative border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground">
            Built for engineers who want to understand, not just operate
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            No surface-level overviews. Each lesson digs into mechanism, so you can reason about
            systems you have never seen before.
          </p>
        </div>

        <div className="stagger-animate grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.06)]"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Icon size={18} />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
