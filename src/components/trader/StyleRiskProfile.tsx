import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl bg-[#1A2C39] border border-[#2B475B] overflow-hidden"
    >
      <div className="p-5 border-b border-[#2B475B]">
        <h2 className="text-lg font-semibold text-white">Style and Risk Profile</h2>
      </div>

      <div className="p-5">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Primary Markets */}
            <div>
              <h3 className="text-xs font-medium text-[#6393B7] uppercase tracking-wide mb-3">
                Primary Markets
              </h3>
              <div className="flex flex-wrap gap-2">
                {primaryMarkets.map((market) => (
                  <span
                    key={market}
                    className="px-3 py-1.5 text-sm rounded-md bg-[#395E77]/30 text-[#6393B7] border border-[#395E77]/50"
                  >
                    {market}
                  </span>
                ))}
              </div>
            </div>

            {/* Time Horizon */}
            <div>
              <h3 className="text-xs font-medium text-[#6393B7] uppercase tracking-wide mb-3">
                Time Horizon
              </h3>
              <div className="flex flex-wrap gap-2">
                {timeHorizons.map((horizon) => (
                  <span
                    key={horizon}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md border transition-colors",
                      horizon === timeHorizon
                        ? "bg-[#4F7E9E] text-white border-[#6393B7]"
                        : "bg-[#2B475B]/30 text-[#6393B7]/60 border-[#395E77]/30"
                    )}
                  >
                    {horizon}
                  </span>
                ))}
              </div>
            </div>

            {/* Strategy Notes */}
            <div>
              <h3 className="text-xs font-medium text-[#6393B7] uppercase tracking-wide mb-3">
                Strategy Notes
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {strategyNotes}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Risk Appetite */}
            <div>
              <h3 className="text-xs font-medium text-[#6393B7] uppercase tracking-wide mb-3">
                Risk Appetite
              </h3>
              <div className="flex gap-2">
                {riskLevels.map((level) => (
                  <span
                    key={level}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md border flex-1 text-center transition-colors",
                      level === riskAppetite
                        ? "bg-[#4F7E9E] text-white border-[#6393B7]"
                        : "bg-[#2B475B]/30 text-[#6393B7]/60 border-[#395E77]/30"
                    )}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>

            {/* Consistency */}
            <div>
              <h3 className="text-xs font-medium text-[#6393B7] uppercase tracking-wide mb-3">
                Consistency
              </h3>
              <div className="p-4 rounded-lg bg-[#2B475B]/30 border border-[#395E77]/30">
                <span className="text-2xl font-bold text-white">{consistencyPercent}%</span>
                <span className="text-sm text-[#6393B7] ml-2">green days last 90 days</span>
              </div>
            </div>

            {/* Max Drawdown */}
            <div>
              <h3 className="text-xs font-medium text-[#6393B7] uppercase tracking-wide mb-3">
                Max Drawdown (Last 90 Days)
              </h3>
              <div className="p-4 rounded-lg bg-[#2B475B]/30 border border-[#395E77]/30">
                <span className="text-2xl font-bold text-red-400">{maxDrawdown}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
