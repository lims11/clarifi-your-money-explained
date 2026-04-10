import { useState } from 'react';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface ScoreFactor {
  name: string;
  description: string;
  score: number;
  maxScore: number;
  colour: string;
  tip: string | null;
}

export function FinancialHealthScore({ totalScore, factors }: { totalScore: number; factors: ScoreFactor[] }) {
  const [expanded, setExpanded] = useState(false);
  const colour = totalScore >= 75 ? '#1D9E75' : totalScore >= 50 ? '#EF9F27' : '#D85A30';

  return (
    <div className="clarifi-card">
      <div className="flex items-center gap-3">
        <Heart size={20} style={{ color: colour }} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Financial health score</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium" style={{ color: colour }}>{totalScore}/100</span>
              <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5">
                {expanded ? 'Hide' : 'Details'}
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${totalScore}%`, backgroundColor: colour }} />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 pt-3 border-t">
          {factors.map((f, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{f.name}</span>
                <span className="text-xs text-muted-foreground">{f.score}/{f.maxScore}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{f.description}</p>
              {f.tip && <p className="text-xs text-amber mb-1">💡 {f.tip}</p>}
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(f.score / f.maxScore) * 100}%`, backgroundColor: f.colour }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
