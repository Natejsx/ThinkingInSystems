import { useState, useCallback, useEffect } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { NavNode } from '@/types';
import { cn } from '@/lib/utils';

function abbr(slug: string): string {
  const last = slug.split('/').pop() ?? slug;
  return last.slice(0, 2).toUpperCase();
}

interface SidebarProps {
  tree: NavNode[];
  collapsed: boolean;
  onCollapseToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface DrillState {
  path: string[];
  animDir: 'forward' | 'back';
  animKey: number;
}

function getNodeAtPath(tree: NavNode[], path: string[]): NavNode | null {
  let current: NavNode[] = tree;
  for (const slug of path) {
    const found = current.find((n) => n.slug === slug);
    if (!found) return null;
    current = found.children ?? [];
  }
  return path.length > 0 ? (tree.find((n) => n.slug === path[path.length - 1]) ?? null) : null;
}

function getChildrenAtPath(tree: NavNode[], path: string[]): NavNode[] {
  if (path.length === 0) return tree;
  let current: NavNode[] = tree;
  for (const slug of path) {
    const found = current.find((n) => n.slug === slug);
    if (!found) return [];
    current = found.children ?? [];
  }
  return current;
}

function findNodeBySlug(nodes: NavNode[], slug: string): NavNode | null {
  for (const node of nodes) {
    if (node.slug === slug) return node;
    if (node.children) {
      const found = findNodeBySlug(node.children, slug);
      if (found) return found;
    }
  }
  return null;
}

function deriveDrillPath(pathname: string, tree: NavNode[]): string[] {
  const slug = pathname.replace(/^\/docs\/?/, '').replace(/\/$/, '');
  if (!slug) return [];
  const parts = slug.split('/');
  const path: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const pathSoFar = parts.slice(0, i + 1).join('/');
    const node = findNodeBySlug(tree, pathSoFar);
    if (node && (node.children?.length ?? 0) > 0) {
      path.push(pathSoFar);
    }
  }
  return path;
}

function SidebarContent({
  tree,
  collapsed,
  onCollapseToggle,
}: {
  tree: NavNode[];
  collapsed: boolean;
  onCollapseToggle: () => void;
}) {
  const location = useLocation();
  const [drill, setDrill] = useState<DrillState>(() => ({
    path: deriveDrillPath(location.pathname, tree),
    animDir: 'forward',
    animKey: 0,
  }));

  useEffect(() => {
    setDrill((d) => ({
      path: deriveDrillPath(location.pathname, tree),
      animDir: 'forward',
      animKey: d.animKey + 1,
    }));
  }, [location.pathname, tree]);

  const drillInto = useCallback((slug: string) => {
    setDrill((d) => ({ path: [...d.path, slug], animDir: 'forward', animKey: d.animKey + 1 }));
  }, []);

  const drillBack = useCallback(() => {
    setDrill((d) => ({ path: d.path.slice(0, -1), animDir: 'back', animKey: d.animKey + 1 }));
  }, []);

  const currentChildren = getChildrenAtPath(tree, drill.path);
  const currentParent = drill.path.length > 0 ? getNodeAtPath(tree, drill.path) : null;

  const animClass =
    drill.animDir === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  if (collapsed) {
    return (
      <div className="flex h-full w-12 flex-col items-center gap-1 border-r border-sidebar-border bg-sidebar py-3">
        <button
          onClick={onCollapseToggle}
          title="Expand sidebar"
          className="mb-2 flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <BookOpen size={15} />
        </button>
        {tree.map((node) => (
          <button
            key={node.slug}
            title={node.name}
            onClick={() => {
              onCollapseToggle();
              drillInto(node.slug);
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[10px] font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            {abbr(node.slug)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full w-56 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center justify-between border-b border-sidebar-border px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {drill.path.length === 0 ? 'Topics' : (currentParent?.name ?? 'Topics')}
        </span>
        <button
          onClick={onCollapseToggle}
          title="Collapse sidebar"
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft size={13} />
        </button>
      </div>

      {drill.path.length > 0 && (
        <button
          onClick={drillBack}
          className="flex items-center gap-2 border-b border-sidebar-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft size={12} /> Back
        </button>
      )}

      <div key={drill.animKey} className={`flex-1 overflow-y-auto py-1 ${animClass}`}>
        {currentChildren.map((node) => {
          const docPath = `/docs/${node.slug}`;
          const isActive =
            location.pathname === docPath || location.pathname.startsWith(docPath + '/');
          const hasChildren = (node.children?.length ?? 0) > 0;

          if (hasChildren) {
            if (node.indexPath) {
              return (
                <div
                  key={node.slug}
                  className={cn(
                    'mx-0.5 flex w-full items-center rounded-sm text-[13px] transition-colors hover:bg-sidebar-accent',
                    isActive
                      ? 'font-medium text-primary'
                      : 'text-sidebar-foreground/80 hover:text-sidebar-foreground'
                  )}
                >
                  <Link
                    to={`/docs/${node.indexPath}`}
                    onClick={() => drillInto(node.slug)}
                    className="flex-1 truncate px-3 py-2"
                  >
                    {node.name}
                  </Link>
                  <button
                    onClick={() => drillInto(node.slug)}
                    className="flex items-center px-2 py-2 text-muted-foreground/60 hover:text-foreground"
                  >
                    <ChevronRight size={12} className="shrink-0" />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={node.slug}
                onClick={() => drillInto(node.slug)}
                className={cn(
                  'mx-0.5 flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-[13px] transition-colors hover:bg-sidebar-accent',
                  isActive
                    ? 'font-medium text-primary'
                    : 'text-sidebar-foreground/80 hover:text-sidebar-foreground'
                )}
              >
                <span className="truncate">{node.name}</span>
                <ChevronRight size={12} className="shrink-0 text-muted-foreground/60" />
              </button>
            );
          }

          const href = node.indexPath ? `/docs/${node.indexPath}` : `/docs/${node.slug}`;

          return (
            <Link
              key={node.slug}
              to={href}
              className={cn(
                'mx-0.5 flex items-center rounded px-3 py-2 text-[13px] transition-all hover:bg-sidebar-accent',
                isActive
                  ? 'bg-primary/10 font-medium text-primary shadow-[0_0_10px_rgba(245,158,11,0.12)] ring-1 ring-primary/30'
                  : 'text-sidebar-foreground/80 hover:text-sidebar-foreground'
              )}
            >
              <span className="truncate">{node.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-sidebar-border px-3 py-2">
        <span className="text-[10px] text-muted-foreground/50">ThinkingInSystems v1.0</span>
      </div>
    </div>
  );
}

export function DocsSidebar({
  tree,
  collapsed,
  onCollapseToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      <aside className="hidden h-full shrink-0 md:flex">
        <SidebarContent tree={tree} collapsed={collapsed} onCollapseToggle={onCollapseToggle} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full">
            <div className="relative flex h-full">
              <SidebarContent tree={tree} collapsed={false} onCollapseToggle={onMobileClose} />
              <button
                onClick={onMobileClose}
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
