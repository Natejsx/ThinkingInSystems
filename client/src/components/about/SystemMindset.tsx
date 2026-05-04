import { ArrowRight, Cpu, AlertTriangle, Brain } from 'lucide-react';

const PILLARS = [
  {
    icon: ArrowRight,
    label: 'Inputs & Outputs',
    color: 'text-primary',
    border: 'border-primary/20',
    bg: 'bg-primary/10',
    description:
      'Every lesson starts by identifying what enters the system, what leaves it, and what the system promises to do in between.',
  },
  {
    icon: AlertTriangle,
    label: 'Bottleneck',
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/10',
    description:
      'Where does throughput collapse? Where does latency spike? Bottlenecks are always somewhere; the skill is finding them before they find you.',
  },
  {
    icon: Brain,
    label: 'Mental Model',
    color: 'text-yellow-400',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/10',
    description:
      'Both perspectives build the same mental model: inputs, processing, outputs, and constraints. You stop guessing and start reasoning.',
  },
];

export const SystemMindset = () => {
  return (
    <section className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground">The systems thinking approach</h2>
          <p className="text-muted-foreground">
            Every lesson is built around one framework: everything is a system.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, label, color, border, bg, description }) => (
            <div key={label} className={`rounded-xl border ${border} bg-card p-6`}>
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg border ${border} ${bg}`}
              >
                <Icon size={20} className={color} />
              </div>
              <h3 className={`mb-2 text-sm font-semibold ${color}`}>{label}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card px-6 py-5">
          <div className="mb-2 flex items-center gap-2">
            <Cpu size={14} className="text-primary" />
            <span className="font-mono text-xs font-semibold text-primary">The Framework</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
            <span className="rounded border border-primary/30 bg-primary/10 px-2 py-1 text-primary">Inputs</span>
            <span className="text-muted-foreground/50">→</span>
            <span className="rounded border border-border bg-secondary px-2 py-1 text-foreground">Processing</span>
            <span className="text-muted-foreground/50">→</span>
            <span className="rounded border border-primary/30 bg-primary/10 px-2 py-1 text-primary">Outputs</span>
            <span className="text-muted-foreground/50">|</span>
            <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-red-400">Constraints</span>
          </div>
        </div>
      </div>
    </section>
  );
};
