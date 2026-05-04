import { AlertTriangle, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  type: 'bottleneck' | 'optimization';
  children: ReactNode;
}

export function SystemCallout({ type, children }: Props) {
  const isBottleneck = type === 'bottleneck';
  return (
    <div
      className="system-callout-card not-prose rounded-lg border px-4 py-3"
      data-mindset={type}
      style={
        isBottleneck
          ? {
              borderColor: 'rgba(239, 68, 68, 0.4)',
              backgroundColor: 'rgba(239, 68, 68, 0.07)',
            }
          : {
              borderColor: 'rgba(245, 158, 11, 0.4)',
              backgroundColor: 'rgba(245, 158, 11, 0.07)',
            }
      }
    >
      <div
        className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: isBottleneck ? '#f87171' : '#f59e0b' }}
      >
        {isBottleneck ? <AlertTriangle size={12} /> : <TrendingUp size={12} />}
        {isBottleneck ? 'Bottleneck' : 'Optimization'}
      </div>
      <div className="space-y-1 text-sm leading-6" style={{ color: 'hsl(30 10% 72%)' }}>
        {children}
      </div>
    </div>
  );
}
