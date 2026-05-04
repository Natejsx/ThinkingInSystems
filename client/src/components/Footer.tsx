import { Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 text-center">
      <div className="mb-2 flex items-center justify-center gap-2">
        <Cpu size={14} className="text-primary" />
        <span className="text-sm font-medium text-foreground">ThinkingInSystems</span>
      </div>
      <p className="text-xs text-muted-foreground">
        A systems-first learning platform for engineers who want to reason from first principles. Part of the{' '}
        <a
          href="https://thinkingInCode.dev"
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          ThinkingIn*
        </a>{' '}
        ecosystem.
      </p>
    </footer>
  );
}
