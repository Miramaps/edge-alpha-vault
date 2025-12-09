
import { cn } from "@/lib/utils";

interface StyleRiskProfileProps {
  primaryMarkets: string[];
  timeHorizon: 'Intraday' | 'Swing (days)' | 'Long-term (weeks+)';
  strategyNotes: string;
  riskAppetite: 'Conservative' | 'Balanced' | 'Aggressive';
  consistencyPercent: number;
  maxDrawdown: number;
}

export function StyleRiskProfile({
  primaryMarkets,
  timeHorizon,
  strategyNotes,
  riskAppetite,
  consistencyPercent,
  maxDrawdown,
}: StyleRiskProfileProps) {
  const timeHorizons = ['Intraday', 'Swing (days)', 'Long-term (weeks+)'];
  const riskLevels = ['Conservative', 'Balanced', 'Aggressive'];

  return (
    <div
      className="rounded-xl bg-black/40 backdrop-blur-sm border border-white/[0.08] overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-foreground">Style & Risk</h2>
      </div>

      <div className="p-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Primary Markets */}
            <div>
              <h3 className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
                Markets
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {primaryMarkets.map((market) => (
                  <span
                    key={market}
                    className="px-2 py-1 text-xs rounded bg-accent/10 text-accent border border-accent/20"
                  >
                    {market}
                  </span>
                ))}
              </div>
            </div>

            {/* Time Horizon */}
            <div>
              <h3 className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
                Time Horizon
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {timeHorizons.map((horizon) => (
                  <span
                    key={horizon}
                    className={cn(
                      "px-2 py-1 text-xs rounded border",
                      horizon === timeHorizon
                        ? "bg-accent text-white border-accent"
                        : "bg-black/30 text-muted-foreground border-white/[0.06]"
                    )}
                  >
                    {horizon}
                  </span>
                ))}
              </div>
            </div>

            {/* Strategy Notes */}
            <div>
              <h3 className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
                Strategy
              </h3>
              <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                {strategyNotes}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Risk Appetite */}
            <div>
              <h3 className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
                Risk Appetite
              </h3>
              <div className="flex gap-1.5">
                {riskLevels.map((level) => (
                  <span
                    key={level}
                    className={cn(
                      "px-2 py-1 text-xs rounded border flex-1 text-center",
                      level === riskAppetite
                        ? "bg-accent text-white border-accent"
                        : "bg-black/30 text-muted-foreground border-white/[0.06]"
                    )}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-black/30 border border-white/[0.06]">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Consistency</p>
                <span className="text-lg font-bold text-foreground">{consistencyPercent}%</span>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/[0.06]">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Max Drawdown</p>
                <span className="text-lg font-bold text-red-400">{maxDrawdown}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
