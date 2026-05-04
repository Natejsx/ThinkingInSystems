import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { algoliasearch } from 'algoliasearch';
import { Search, X } from 'lucide-react';

interface SearchHit {
  objectID: string;
  slug: string;
  category: string;
  title: string;
  sectionTitle: string;
  sectionAnchor: string;
  sectionContent: string;
  _highlightResult?: {
    sectionTitle?: { value: string };
    title?: { value: string };
  };
  _snippetResult?: {
    sectionContent?: { value: string };
  };
}

const APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID as string | undefined;
const SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY as string | undefined;
const INDEX_NAME =
  (import.meta.env.VITE_ALGOLIA_INDEX_NAME as string | undefined) ?? 'thinkinginsystems';

let _client: ReturnType<typeof algoliasearch> | null = null;
function getClient() {
  if (!_client && APP_ID && SEARCH_KEY) {
    _client = algoliasearch(APP_ID, SEARCH_KEY);
  }
  return _client;
}

export function openSearch() {
  window.dispatchEvent(new CustomEvent('open-search'));
}

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const isConfigured = !!(APP_ID && SEARCH_KEY);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    };
    window.addEventListener('open-search', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-search', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHits([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  const search = useCallback(async (q: string) => {
    const client = getClient();
    if (!q.trim() || !client) {
      setHits([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await client.searchSingleIndex<SearchHit>({
        indexName: INDEX_NAME,
        searchParams: {
          query: q,
          hitsPerPage: 12,
          attributesToSnippet: ['sectionContent:25'],
          attributesToHighlight: ['sectionTitle', 'title'],
        },
      });
      setHits(res.hits);
      setSelectedIndex(0);
    } catch {
      setHits([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  const goToHit = useCallback(
    (hit: SearchHit) => {
      close();
      navigate(`/docs/${hit.slug}${hit.sectionAnchor ? `#${hit.sectionAnchor}` : ''}`);
    },
    [close, navigate]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => {
          const next = Math.min(i + 1, hits.length - 1);
          listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => {
          const prev = Math.max(i - 1, 0);
          listRef.current?.children[prev]?.scrollIntoView({ block: 'nearest' });
          return prev;
        });
      }
      if (e.key === 'Enter' && hits[selectedIndex]) {
        goToHit(hits[selectedIndex]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, hits, selectedIndex, close, goToHit]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="fixed inset-x-0 top-[10vh] z-50 mx-auto max-w-2xl px-4">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search size={15} className="shrink-0 text-muted-foreground/60" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics, concepts, systems..."
              className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
            {isLoading ? (
              <div className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <button
                onClick={close}
                className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {hits.length > 0 && (
            <ul ref={listRef} className="max-h-[min(58vh,400px)] overflow-y-auto py-1.5">
              {hits.map((hit, i) => {
                const headingHtml =
                  hit._highlightResult?.sectionTitle?.value ?? hit.sectionTitle;
                const snippetHtml =
                  hit._snippetResult?.sectionContent?.value ??
                  hit.sectionContent.slice(0, 120);
                const isSelected = i === selectedIndex;
                return (
                  <li key={hit.objectID}>
                    <button
                      className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected ? 'bg-primary/10' : 'hover:bg-secondary/60'
                      }`}
                      onClick={() => goToHit(hit)}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <Search size={13} className="mt-0.5 shrink-0 text-primary/40" />
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-primary/50">
                            {hit.category.replace(/-/g, ' ')}
                          </span>
                          {hit.title !== hit.sectionTitle && (
                            <>
                              <span className="text-muted-foreground/30">/</span>
                              <span className="truncate text-[11px] text-muted-foreground/60">
                                {hit.title}
                              </span>
                            </>
                          )}
                        </div>
                        <div
                          className="mb-0.5 truncate text-sm font-medium text-foreground [&_em]:font-semibold [&_em]:not-italic [&_em]:text-primary"
                          dangerouslySetInnerHTML={{ __html: headingHtml }}
                        />
                        <div
                          className="line-clamp-1 text-xs text-muted-foreground/60 [&_em]:font-medium [&_em]:not-italic [&_em]:text-foreground/80"
                          dangerouslySetInnerHTML={{ __html: snippetHtml }}
                        />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {query.trim() && !isLoading && hits.length === 0 && (
            <p className="px-4 py-10 text-center font-mono text-sm text-muted-foreground/40">
              No results for <span className="text-foreground/60">"{query}"</span>
            </p>
          )}

          {!query.trim() && (
            <p className="px-4 py-8 text-center font-mono text-xs text-muted-foreground/30">
              Start typing to search all lessons
            </p>
          )}

          <div className="flex items-center justify-between border-t border-border/40 px-4 py-2">
            <div className="flex items-center gap-4 font-mono text-[10px] text-muted-foreground/30">
              <span><kbd className="font-sans">↑↓</kbd> navigate</span>
              <span><kbd className="font-sans">↵</kbd> open</span>
              <span><kbd className="font-sans">esc</kbd> close</span>
            </div>
            {!isConfigured && (
              <span className="font-mono text-[10px] text-yellow-500/50">
                Algolia not configured
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
