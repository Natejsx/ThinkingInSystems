import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Cpu, Github, Menu, X, BookOpen, Info, Search, type LucideIcon } from 'lucide-react';
import { openSearch } from '@/components/search/SearchModal';

const NAV_LINKS: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Learn', to: '/docs', icon: BookOpen },
  { label: 'About', to: '/about', icon: Info },
];

export const Nav = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav
        className={cn(
          'fixed left-0 right-0 top-0 z-40 transition-all duration-300',
          scrolled
            ? 'h-12 border-b border-border/60 bg-background/90 backdrop-blur-md'
            : 'h-14 bg-transparent'
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="group flex flex-1 items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-primary/40 bg-primary/10 transition-colors group-hover:border-primary/70 group-hover:bg-primary/20">
              <Cpu size={14} className="text-primary" />
            </div>
            <span className="font-mono text-sm font-semibold text-foreground">
              ThinkingIn<span className="text-primary">Systems</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-6 text-sm md:flex">
            {NAV_LINKS.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative flex items-center gap-1.5 py-1 transition-colors',
                  isActive(to) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon size={14} />
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
              <Github size={16} />
            </a>
          </div>

          {/* Right: search + CTA + hamburger */}
          <div className="flex flex-1 items-center justify-end gap-3">
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
              className="hidden items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-xs font-semibold text-primary transition-colors hover:border-primary/70 hover:bg-primary/20 md:inline-flex"
            >
              <span className="opacity-50">$</span> Start Learning
            </Link>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 z-30 flex flex-col bg-background/95 backdrop-blur-md transition-all duration-200 md:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div className="mt-16 flex flex-col px-6 py-4">
          {NAV_LINKS.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 border-b border-border py-4 font-mono text-sm text-foreground transition-colors hover:text-primary"
            >
              <Icon size={15} className="text-primary/60" /> {label}
            </Link>
          ))}
          <Link
            to="/docs"
            className="flex items-center gap-3 border-b border-border py-4 font-mono text-sm text-foreground transition-colors hover:text-primary"
          >
            <span className="text-primary/60">$</span> Start Learning
          </Link>
          <a
            href="https://github.com/Natejsx/ThinkingInSystems"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-4 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="text-primary/60">$</span> GitHub
          </a>
        </div>
      </div>
    </>
  );
};
