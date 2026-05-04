import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { Link } from 'react-router-dom';
import { SystemCallout } from './docs/SystemCallout';

/* rehypeCallouts: tags blockquotes with data-callout based on [!TYPE] marker */
function rehypeCallouts() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'blockquote') return;
      const first = node.children.find(
        (c): c is Element => c.type === 'element' && c.tagName === 'p'
      );
      if (!first) return;
      const text = first.children.find((c) => c.type === 'text');
      if (!text || text.type !== 'text') return;
      const match = text.value.match(
        /^\[!(NOTE|WARNING|TIP|BOTTLENECK|OPTIMIZATION)\]\s*/i
      );
      if (!match) return;
      const calloutType = match[1].toLowerCase();
      node.properties = { ...node.properties, 'data-callout': calloutType };
      text.value = text.value.slice(match[0].length);
    });
  };
}

/* rehypePairSystemCallouts: wraps BOTTLENECK+OPTIMIZATION siblings in .mindset-pair */
function rehypePairSystemCallouts() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const children = node.children as Element[];
      let i = 0;
      while (i < children.length - 1) {
        const a = children[i];
        const b = children[i + 1];
        const aIsBottleneck =
          a.type === 'element' &&
          a.tagName === 'blockquote' &&
          (a.properties as Record<string, unknown>)?.['data-callout'] === 'bottleneck';
        const bIsOptimization =
          b.type === 'element' &&
          b.tagName === 'blockquote' &&
          (b.properties as Record<string, unknown>)?.['data-callout'] === 'optimization';
        if (aIsBottleneck && bIsOptimization) {
          const wrapper: Element = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['mindset-pair'] },
            children: [a, b],
          };
          children.splice(i, 2, wrapper);
        } else {
          i++;
        }
      }
    });
  };
}

const CALLOUT_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> =
  {
    note: {
      label: 'Note',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.07)',
      border: 'rgba(245, 158, 11, 0.4)',
    },
    warning: {
      label: 'Warning',
      color: '#f87171',
      bg: 'rgba(239, 68, 68, 0.07)',
      border: 'rgba(239, 68, 68, 0.4)',
    },
    tip: {
      label: 'Tip',
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.07)',
      border: 'rgba(52, 211, 153, 0.4)',
    },
  };

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeCallouts, rehypePairSystemCallouts]}
        components={{
          code({ node, className: cls, children, ...props }) {
            const match = /language-(\w+)/.exec(cls || '');
            const lang = match?.[1] ?? '';
            const isBlock = node?.position?.start?.line !== node?.position?.end?.line;

            if (!match || !isBlock) {
              return (
                <code className={cls} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <SyntaxHighlighter
                style={oneDark}
                language={lang}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  background: 'hsl(24 8% 7%)',
                }}
                codeTagProps={{
                  style: { background: 'none', border: 'none', padding: 0 },
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },

          blockquote({ node, children, ...props }) {
            const calloutType = (node as Element)?.properties?.['data-callout'] as
              | string
              | undefined;

            if (calloutType === 'bottleneck' || calloutType === 'optimization') {
              return (
                <SystemCallout type={calloutType}>{children}</SystemCallout>
              );
            }

            if (calloutType && CALLOUT_CONFIG[calloutType]) {
              const cfg = CALLOUT_CONFIG[calloutType];
              return (
                <div
                  className="not-prose my-4 rounded-lg border px-4 py-3"
                  style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
                >
                  <div
                    className="mb-1 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: cfg.color }}
                  >
                    {cfg.label}
                  </div>
                  <div className="text-sm leading-6" style={{ color: 'hsl(30 10% 72%)' }}>
                    {children}
                  </div>
                </div>
              );
            }

            return <blockquote {...props}>{children}</blockquote>;
          },

          a({ href, children, ...props }) {
            if (href?.startsWith('/')) {
              return <Link to={href}>{children}</Link>;
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },

          pre({ children }) {
            return <>{children}</>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
