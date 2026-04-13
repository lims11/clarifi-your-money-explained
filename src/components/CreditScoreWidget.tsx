import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';

const SCORE_RANGES = [
  { label: 'Very Poor', min: 0, max: 560, colour: '#E24B4A' },
  { label: 'Poor', min: 561, max: 720, colour: '#D85A30' },
  { label: 'Fair', min: 721, max: 880, colour: '#EF9F27' },
  { label: 'Good', min: 881, max: 960, colour: '#1D9E75' },
  { label: 'Excellent', min: 961, max: 999, colour: '#059669' },
];

const getRating = (score: number) => SCORE_RANGES.find(r => score >= r.min && score <= r.max) || SCORE_RANGES[0];
const getScoreColour = (score: number) => getRating(score).colour;

const impactColours: Record<string, string> = {
  positive: '#1D9E75',
  warning: '#EF9F27',
  negative: '#D85A30',
  neutral: '#888780',
};

interface CreditScoreData {
  score: number;
  previous_score: number;
  provider: string;
  factors: Array<{ factor: string; impact: string; detail: string; weight: number }>;
}

export function CreditScoreWidget({ data }: { data: CreditScoreData }) {
  const [expanded, setExpanded] = useState(false);
  const { score, previous_score, provider, factors } = data;
  const change = score - previous_score;
  const rating = getRating(score);
  const colour = getScoreColour(score);

  // SVG arc gauge
  const pct = score / 999;
  const radius = 64;
  const cx = 80;
  const cy = 80;
  const startAngle = 150; // degrees from positive x-axis
  const sweepAngle = 240;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX = (angle: number) => cx + radius * Math.cos(toRad(angle));
  const arcY = (angle: number) => cy - radius * Math.sin(toRad(angle));

  const bgStartX = arcX(startAngle);
  const bgStartY = arcY(startAngle);
  const bgEndX = arcX(startAngle - sweepAngle);
  const bgEndY = arcY(startAngle - sweepAngle);

  const fillSweep = sweepAngle * pct;
  const fillEndX = arcX(startAngle - fillSweep);
  const fillEndY = arcY(startAngle - fillSweep);

  const describeBgArc = `M ${bgStartX} ${bgStartY} A ${radius} ${radius} 0 1 0 ${bgEndX} ${bgEndY}`;
  const describeFillArc = `M ${bgStartX} ${bgStartY} A ${radius} ${radius} 0 ${fillSweep > 180 ? 1 : 0} 0 ${fillEndX} ${fillEndY}`;

  return (
    <div className="sonfi-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-medium">Credit Score</h3>
          <p className="text-xs text-muted-foreground">Powered by {provider} · Updated today</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium" style={{ color: change > 0 ? '#1D9E75' : change < 0 ? '#D85A30' : '#888780' }}>
          {change > 0 ? <TrendingUp size={14} /> : change < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
          {change > 0 ? '+' : ''}{change} this month
        </div>
      </div>

      {/* Gauge + score */}
      <div className="flex items-center gap-6">
        <div className="relative w-40 h-32 flex-shrink-0">
          <svg viewBox="0 0 160 130" className="w-full h-full">
            {/* Background arc */}
            <path d={describeBgArc} fill="none" stroke="hsl(var(--muted))" strokeWidth={10} strokeLinecap="round" />
            {/* Score arc */}
            {pct > 0 && <path d={describeFillArc} fill="none" stroke={colour} strokeWidth={10} strokeLinecap="round" />}
            {/* Labels */}
            <text x={bgStartX - 4} y={bgStartY + 14} fontSize={10} fill="hsl(var(--muted-foreground))" textAnchor="middle">0</text>
            <text x={bgEndX + 4} y={bgEndY + 14} fontSize={10} fill="hsl(var(--muted-foreground))" textAnchor="middle">999</text>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: 6 }}>
            <span className="text-3xl font-semibold" style={{ color: colour }}>{score}</span>
            <span className="text-xs font-medium" style={{ color: colour }}>{rating.label}</span>
          </div>
        </div>

        {/* Score range bands */}
        <div className="flex-1 space-y-1.5">
          {SCORE_RANGES.map(range => {
            const isActive = score >= range.min && score <= range.max;
            return (
              <div key={range.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: range.colour, opacity: isActive ? 1 : 0.3 }} />
                <span className={`text-xs flex-1 ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>{range.label}</span>
                <span className="text-[10px] text-muted-foreground">{range.min}–{range.max}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable factors */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2.5 mt-4 text-xs font-medium hover:bg-muted transition-colors"
      >
        What's affecting my score?
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mt-4 space-y-6">
          <div>
            <p className="text-xs text-muted-foreground mb-4">These are the things that are impacting your score the most</p>
          </div>

          {/* Action Needed */}
          {factors.filter(f => f.impact === 'warning' || f.impact === 'negative').length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Action Needed</h4>
                <span className="text-xs text-primary font-medium">
                  {factors.filter(f => f.impact === 'warning' || f.impact === 'negative').length} topics
                </span>
              </div>
              <div className="space-y-2.5">
                {factors.filter(f => f.impact === 'warning' || f.impact === 'negative').map((f, i) => (
                  <div key={i} className="rounded-2xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: impactColours[f.impact] }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: impactColours[f.impact] }} />
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">High impact</span>
                    </div>
                    <p className="text-sm font-semibold">{f.factor}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monitor */}
          {factors.filter(f => f.impact === 'neutral').length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Monitor</h4>
                <span className="text-xs text-primary font-medium">
                  {factors.filter(f => f.impact === 'neutral').length} topics
                </span>
              </div>
              <div className="space-y-2.5">
                {factors.filter(f => f.impact === 'neutral').map((f, i) => (
                  <div key={i} className="rounded-2xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">Medium impact</span>
                    </div>
                    <p className="text-sm font-semibold">{f.factor}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doing Well */}
          {factors.filter(f => f.impact === 'positive').length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Doing well</h4>
                <span className="text-xs text-primary font-medium">
                  {factors.filter(f => f.impact === 'positive').length} topics
                </span>
              </div>
              <div className="space-y-2.5">
                {factors.filter(f => f.impact === 'positive').map((f, i) => (
                  <div key={i} className="rounded-2xl p-4 relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--primary) / 0.15)' }}>
                    {/* Confetti decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-30 pointer-events-none">
                      <svg viewBox="0 0 80 80" className="w-full h-full">
                        {[...Array(12)].map((_, j) => (
                          <g key={j}>
                            <circle cx={15 + (j % 4) * 18} cy={10 + Math.floor(j / 4) * 22} r={2} fill={['#E24B4A', '#1D9E75', '#EF9F27', '#7F77DD', '#378ADD', '#FF3464'][j % 6]} />
                            <path d={`M${20 + (j % 3) * 20},${15 + Math.floor(j / 3) * 18} q5,-8 2,5`} stroke={['#E24B4A', '#1D9E75', '#EF9F27', '#7F77DD'][j % 4]} strokeWidth={1.5} fill="none" />
                          </g>
                        ))}
                      </svg>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-4 h-4 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {f.weight >= 20 ? 'Medium' : 'Low'} impact
                      </span>
                    </div>
                    <p className="text-sm font-semibold">{f.factor}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground text-center pt-1">Scores are simulated for demo purposes · Not regulated financial advice</p>
        </div>
      )}
    </div>
  );
}
