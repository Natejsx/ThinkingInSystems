import { Link } from 'react-router-dom';
import { Layers, ExternalLink } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { SystemMindset } from '@/components/about/SystemMindset';
import { Lesson } from '@/components/about/Lesson';

const CURRICULUM = [
  { order: '01', label: 'Foundations', desc: 'System model, throughput vs latency, Amdahl\'s Law, Little\'s Law' },
  { order: '02', label: 'CPU', desc: 'Cache hierarchy, branch prediction, NUMA, instruction parallelism' },
  { order: '03', label: 'Memory', desc: 'Virtual memory, paging, TLBs, allocators, garbage collection' },
  { order: '04', label: 'Processes', desc: 'Processes vs threads, context switching, scheduling, IPC' },
  { order: '05', label: 'Concurrency', desc: 'Locks, atomics, memory ordering, deadlock, lock-free structures' },
  { order: '06', label: 'I/O', desc: 'I/O models, disk internals, file systems, zero-copy' },
  { order: '07', label: 'Networking', desc: 'TCP internals, kernel networking, socket buffers, kernel bypass' },
  { order: '08', label: 'Observability', desc: 'Metrics, traces, logs, flamegraphs, eBPF, SLIs and SLOs' },
  { order: '09', label: 'Containers', desc: 'cgroups, namespaces, container internals, hypervisors' },
  { order: '10', label: 'Distributed Systems', desc: 'CAP theorem, consensus, clocks and ordering, replication' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="pt-14">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24">
          <div className="landing-grid-bg pointer-events-none absolute inset-0" />
          <div className="landing-radial-fade pointer-events-none absolute inset-0" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              About the Platform
            </div>
            <h1 className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="landing-gradient-text">Why ThinkingInSystems?</span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
              Most infrastructure resources teach you <em className="text-foreground">what to do</em>.
              This platform teaches you <em className="text-foreground">why it works</em>, so you can
              diagnose systems you have never seen before.
            </p>
          </div>
        </section>

        <SystemMindset />

        {/* What's covered */}
        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-primary/30 bg-primary/10">
                <Layers size={15} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">What's covered</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CURRICULUM.map(({ order, label, desc }) => (
                <div
                  key={order}
                  className="group flex gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-primary/40">{order}</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{label}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Lesson />

        {/* ThinkingIn* ecosystem */}
        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-1 font-mono text-xs text-primary/60">// ecosystem</div>
              <h2 className="mb-3 text-xl font-bold text-foreground">
                Part of the{' '}
                <a
                  href="https://thinkingInCode.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ThinkingIn*
                </a>{' '}
                series
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                ThinkingInSystems is one platform in a family of mindset-first engineering
                references. Each applies the same principle: instead of documenting APIs, teach the
                mental models that let you reason from first principles.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://thinkingInCode.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary transition-opacity hover:opacity-80"
                >
                  Visit ThinkingInCode.dev <ExternalLink size={13} />
                </a>
                <a
                  href="https://thinkingInSecurity.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary transition-opacity hover:opacity-80"
                >
                  Visit ThinkingInSecurity.dev <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-24 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Ready to start?</h2>
          <p className="mx-auto mb-8 max-w-md text-muted-foreground">
            Pick any topic and work through the lesson. The bottleneck and the optimization are
            waiting on the other side.
          </p>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
          >
            <span className="font-mono text-primary-foreground/60">$</span>
            Open the Docs
          </Link>
        </section>

        <Footer />
      </main>
    </div>
  );
}
