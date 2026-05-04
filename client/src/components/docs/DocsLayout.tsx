import { useState, useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Menu, Cpu, Github, Search } from 'lucide-react';
import { DocsSidebar } from './DocsSidebar';
import { DocsHome } from './DocsHome';
import { DocPage } from './DocPage';
import { getAllLessons, buildNavTree } from '@/lib/content';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { openSearch } from '@/components/search/SearchModal';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
];

export function DocsLayout() {
  const { '*': splat } = useParams();
  const location = useLocation();
  const isMobile = useIsMobile();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const lessons = useMemo(() => getAllLessons(), []);
  const tree = useMemo(() => buildNavTree(lessons), [lessons]);

  const slug = splat?.trim() ?? '';
  const isHome = !slug || location.pathname === '/docs' || location.pathname === '/docs/';

  const currentSlug = useMemo(() => {
    if (!slug) return '';
    const parts = slug.split('/');
    const lastPart = parts[parts.length - 1];
    const indexSlug = `${slug}/${lastPart}`;
    const hasIndex = lessons.some((l) => l.slug === indexSlug);
    if (hasIndex && !lessons.some((l) => l.slug === slug)) return indexSlug;
    return slug;
  }, [slug, lessons]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-background/90 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isMobile) setMobileOpen((o) => !o);
              else setCollapsed((c) => !c);
            }}
            aria-label="Toggle sidebar"
            className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Menu size={18} />
          </button>

          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded border border-primary/40 bg-primary/10 transition-colors group-hover:border-primary/70 group-hover:bg-primary/20">
              <Cpu size={12} className="text-primary" />
            </div>
            <span className="font-mono text-sm font-semibold text-foreground">
              ThinkingIn<span className="text-primary">Systems</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-5 text-sm md:flex">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative py-1 transition-colors',
                  isActive(to) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
                {isActive(to) && (
                  <span className="absolute bottom-0 left-0 right-0 h-px rounded-full bg-primary" />
                )}
              </Link>
            ))}
            <a
              href="https://github.com/Natejsx/ThinkingInSystems"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github size={15} />
            </a>
          </nav>

          <button
            onClick={openSearch}
            aria-label="Search"
            className="hidden items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-foreground md:flex"
          >
            <Search size={12} />
            <span>Search</span>
            <kbd className="ml-auto rounded border border-border/60 px-1 py-0.5 font-sans text-[10px] text-muted-foreground/50">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={openSearch}
            aria-label="Search"
            className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          >
            <Search size={16} />
          </button>

          <Link
            to="/docs"
            className={cn(
              'hidden items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary transition-colors hover:border-primary/70 hover:bg-primary/20 md:inline-flex',
              isActive('/docs') && 'border-primary/60 bg-primary/15'
            )}
          >
            <span className="opacity-50">$</span> Docs
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <DocsSidebar
          tree={tree}
          collapsed={collapsed && !isMobile}
          onCollapseToggle={() => {
            if (isMobile) setMobileOpen((o) => !o);
            else setCollapsed((c) => !c);
          }}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          {isHome ? <DocsHome tree={tree} lessons={lessons} /> : <DocPage slug={currentSlug} />}
        </main>
      </div>
    </div>
  );
}
