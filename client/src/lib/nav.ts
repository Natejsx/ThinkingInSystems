import type { NavNode, LessonSummary } from '@/types';

const SLUG_OVERRIDES: Record<string, string> = {
  cpu: 'CPU',
  io: 'I/O',
  ipc: 'IPC',
  numa: 'NUMA',
  tlbs: 'TLBs',
  ebpf: 'eBPF',
  'tcp-internals': 'TCP Internals',
  'cap-theorem': 'CAP Theorem',
  'slis-slos-slas': 'SLIs, SLOs & SLAs',
  'distributed-systems': 'Distributed Systems',
  'identity-access-management': 'Identity & Access',
};

export function slugToTitle(slug: string): string {
  if (Object.prototype.hasOwnProperty.call(SLUG_OVERRIDES, slug)) {
    return SLUG_OVERRIDES[slug];
  }
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function sortNodes(nodes: NavNode[]): NavNode[] {
  return nodes
    .map((node) => ({
      ...node,
      children: node.children ? sortNodes(node.children) : undefined,
    }))
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name);
    });
}

export function buildNavTree(summaries: LessonSummary[]): NavNode[] {
  const root: NavNode[] = [];
  const nodeMap = new Map<string, NavNode>();

  for (const summary of summaries) {
    const parts = summary.slug.split('/');

    for (let depth = 1; depth <= parts.length; depth++) {
      const pathSoFar = parts.slice(0, depth).join('/');
      if (nodeMap.has(pathSoFar)) continue;

      const segment = parts[depth - 1];
      const isLeaf = depth === parts.length;
      const parentPath = depth > 1 ? parts.slice(0, depth - 1).join('/') : null;

      const isIndexFile = isLeaf && segment === parts[depth - 2];

      if (isIndexFile) {
        const parent = parentPath ? nodeMap.get(parentPath) : null;
        if (parent) {
          parent.indexPath = summary.slug;
          parent.summary = summary;
          parent.order = summary.order ?? parent.order;
          if (summary.title) parent.name = summary.title;
        }
        continue;
      }

      const node: NavNode = {
        name: isLeaf ? summary.title || slugToTitle(segment) : slugToTitle(segment),
        slug: pathSoFar,
        fullPath: '/' + pathSoFar,
        type: isLeaf ? 'lesson' : 'category',
        order: isLeaf ? (summary.order ?? 999) : 999,
        children: isLeaf ? undefined : [],
        summary: isLeaf ? summary : undefined,
      };

      nodeMap.set(pathSoFar, node);

      if (parentPath) {
        const parent = nodeMap.get(parentPath);
        if (parent?.children) {
          parent.children.push(node);
        }
      } else {
        root.push(node);
      }
    }
  }

  return sortNodes(root);
}

export function searchLessons(summaries: LessonSummary[], query: string): LessonSummary[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return summaries.filter(
    (s) =>
      s.title?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.tags?.some((t) => t.toLowerCase().includes(q))
  );
}

export function getLessonBySlug(
  summaries: LessonSummary[],
  slug: string
): LessonSummary | undefined {
  return summaries.find((s) => s.slug === slug);
}
