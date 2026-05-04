import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { getAllLessons, buildNavTree } from '@/lib/content';

const TOPIC_META: Record<string, { color: string; description: string }> = {
  foundations: {
    color: '#f59e0b',
    description: 'System model, throughput vs latency, Little\'s Law, Amdahl\'s Law',
  },
  cpu: {
    color: '#f97316',
    description: 'Cache hierarchy, branch prediction, NUMA, instruction-level parallelism',
  },
  memory: {
    color: '#eab308',
    description: 'Virtual memory, paging, heap, allocators, garbage collection',
  },
  processes: {
    color: '#fb923c',
    description: 'Processes vs threads, context switching, scheduling, signals, IPC',
  },
  concurrency: {
    color: '#ef4444',
    description: 'Locks, atomics, memory ordering, deadlock, lock-free structures',
  },
  io: {
    color: '#38bdf8',
    description: 'I/O models, disk internals, file systems, zero-copy, schedulers',
  },
  networking: {
    color: '#0ea5e9',
    description: 'TCP internals, kernel networking, socket buffers, kernel bypass',
  },
  observability: {
    color: '#a78bfa',
    description: 'Metrics, traces, logs, flamegraphs, eBPF, SLIs and SLOs',
  },
  containers: {
    color: '#34d399',
    description: 'cgroups, namespaces, container internals, hypervisors, overlay fs',
  },
  'distributed-systems': {
    color: '#22d3ee',
    description: 'CAP theorem, consensus, clocks, replication, backpressure',
  },
};

export function TopicsGrid() {
  const tree = useMemo(() => buildNavTree(getAllLessons()), []);

  return (
    <section className="relative border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground">Explore Topics</h2>
          <p className="text-muted-foreground">
            From CPU fundamentals to distributed systems, structured for progressive depth.
          </p>
        </div>

        <div className="stagger-animate grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tree.map((topic) => {
            const topicMeta = TOPIC_META[topic.slug] ?? { color: '#f59e0b', description: '' };
            const color = topicMeta.color;
            const lessonCount = topic.children?.length ?? 0;
            const href = topic.indexPath
              ? `/docs/${topic.indexPath}`
              : topic.children?.[0]?.summary?.slug
                ? `/docs/${topic.children[0].summary.slug}`
                : `/docs`;

            return (
              <Link
                key={topic.slug}
                to={href}
                className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.06)]"
              >
                <div
                  className="mb-3 flex h-8 w-8 items-center justify-center rounded text-[11px] font-bold"
                  style={{ background: `${color}18`, color }}
                >
                  {topic.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="mb-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {topic.name}
                </div>
                {topicMeta.description && (
                  <div className="mb-2 text-xs leading-relaxed text-muted-foreground">
                    {topicMeta.description}
                  </div>
                )}
                <div className="text-[10px] text-muted-foreground/50">
                  {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            Browse All Documentation →
          </Link>
        </div>
      </div>
    </section>
  );
}
