import { Link } from 'react-router-dom';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Hero } from '@/home/Hero';
import { Features } from '@/home/Features';
import { TopicsGrid } from '@/home/TopicsGrid';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="pt-14">
        <Hero />
        <Features />
        <TopicsGrid />

        <section className="border-t border-border px-6 py-24 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Start thinking at the system level
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            Every lesson teaches you the mechanism, not just the symptom. Learn the mental models
            that let you reason about any system under pressure.
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
      </div>
    </div>
  );
}
