import React from 'react';
import { Clock, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';

/**
 * IntervalVisualizer - Visual Bar Chart and Sparkline for Rhythm Intervals
 * Replaces plain text numbers with intuitive side-by-side comparative bars and a tempo sparkline.
 */
export default function IntervalVisualizer({ intervalErrors = [], details = {} }) {
  if (!intervalErrors || intervalErrors.length === 0) return null;

  // Find max duration across all expected/actual for relative bar scaling (max 100%)
  const allDurations = intervalErrors.flatMap((e) => [e.expected || 0, e.actual || 0]);
  const maxMs = Math.max(...allDurations, 800);

  // Generate SVG coordinates for Sparkline (deviation curve)
  // Sparkline dimensions: width 240, height 50
  const sparkWidth = 240;
  const sparkHeight = 50;
  const points = intervalErrors.map((err, idx) => {
    const x = (idx / Math.max(1, intervalErrors.length - 1)) * (sparkWidth - 24) + 12;
    // deviation between 0% and 100% mapped to y: 0% is near bottom (y=38), 100% near top (y=8)
    const normalizedErr = Math.min(100, Math.max(0, err.percentage));
    const y = sparkHeight - 12 - (normalizedErr / 100) * (sparkHeight - 20);
    return { x, y, err: err.percentage };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="mt-6 border-2 border-[#E8DDC7] rounded-2xl p-4 sm:p-6 bg-white shadow-2xs">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E8DDC7]">
        <div>
          <span className="text-[11px] font-bold text-[#C9962F] uppercase tracking-wider block">
            Data Visualization
          </span>
          <h3 className="text-sm font-black text-[#3E1220] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C9962F]" />
            Rhythmic Interval Variance Breakdown
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <div className="flex items-center gap-1.5 text-stone-600">
            <span className="w-3 h-3 rounded-xs bg-[#E8DDC7] border border-stone-400 inline-block" />
            <span>Target Pattern</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-600">
            <span className="w-3 h-3 rounded-xs bg-[#27500A] inline-block" />
            <span>Your Tap</span>
          </div>
        </div>
      </div>

      {/* Comparative Dual Bar Chart */}
      <div className="space-y-4">
        {intervalErrors.map((err, idx) => {
          const expectedPct = Math.min(100, Math.round((err.expected / maxMs) * 100));
          const actualPct = Math.min(100, Math.round((err.actual / maxMs) * 100));
          const delta = err.actual - err.expected;
          const isOutlier = err.percentage >= 60;
          const isElevated = err.percentage > 35 && err.percentage < 60;

          // Bar color logic
          const actualColorClass = isOutlier
            ? 'bg-red-600'
            : isElevated
            ? 'bg-[#C9962F]'
            : 'bg-[#27500A]';

          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#FAF6EE]/50 border border-[#E8DDC7] space-y-2 hover:bg-[#FAF6EE] transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#3E1220]">
                  Interval #{idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 text-[11px]">
                    Δ {delta > 0 ? `+${delta}ms` : `${delta}ms`}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1 ${
                      isOutlier
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : isElevated
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-[#EFF6EC] text-[#27500A] border border-[#27500A]/30'
                    }`}
                  >
                    {isOutlier ? (
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-[#27500A]" />
                    )}
                    ±{err.percentage}% variance
                  </span>
                </div>
              </div>

              {/* Visual Bars Container */}
              <div className="space-y-1 pt-1">
                {/* Expected Bar */}
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[10px] uppercase font-bold text-stone-500 text-right shrink-0">
                    Target
                  </span>
                  <div className="flex-1 h-3.5 bg-stone-100 rounded-full overflow-hidden flex items-center">
                    <div
                      className="h-full bg-[#3E1220]/25 rounded-full transition-all duration-500 relative flex items-center justify-end pr-1.5"
                      style={{ width: `${expectedPct}%` }}
                    >
                      <span className="text-[9px] font-mono font-bold text-[#3E1220]">
                        {err.expected}ms
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actual Bar */}
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[10px] uppercase font-bold text-stone-500 text-right shrink-0">
                    Tap
                  </span>
                  <div className="flex-1 h-3.5 bg-stone-100 rounded-full overflow-hidden flex items-center">
                    <div
                      className={`h-full ${actualColorClass} rounded-full transition-all duration-500 relative flex items-center justify-end pr-1.5`}
                      style={{ width: `${actualPct}%` }}
                    >
                      <span className="text-[9px] font-mono font-bold text-white">
                        {err.actual}ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sparkline Deviation Trajectory */}
      <div className="mt-5 pt-4 border-t border-[#E8DDC7] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
            Rhythmic Tempo Trajectory
          </span>
          <p className="text-xs text-stone-600 mt-0.5">
            Variance curve across sequential rhythm taps (flat line = steady human cadence).
          </p>
        </div>

        {/* Inline SVG Sparkline */}
        <div className="bg-[#FAF6EE] p-2 rounded-xl border border-[#E8DDC7] shrink-0">
          <svg
            width={sparkWidth}
            height={sparkHeight}
            className="overflow-visible"
            aria-label="Deviation curve sparkline"
          >
            {/* Safe zone reference line (35% threshold) */}
            <line
              x1="0"
              y1={sparkHeight - 12 - 0.35 * (sparkHeight - 20)}
              x2={sparkWidth}
              y2={sparkHeight - 12 - 0.35 * (sparkHeight - 20)}
              stroke="#E8DDC7"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
            {/* Sparkline path */}
            <polyline
              fill="none"
              stroke="#C9962F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
            {/* Sparkline dots */}
            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={p.err >= 60 ? 4 : 3}
                fill={p.err >= 60 ? '#DC2626' : p.err > 35 ? '#C9962F' : '#27500A'}
                stroke="#FAF6EE"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
