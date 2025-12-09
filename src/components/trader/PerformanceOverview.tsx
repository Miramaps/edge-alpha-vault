import { lazy, Suspense } from "react";
import { TrendingUp, Target, Percent, Calendar, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Lazy load Recharts to prevent blocking page render
const LazyChart = lazy(() => import("./EquityChart"));

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ElementType;
  positive?: boolean;
}

function StatCard({ label, value, subtext, icon: Icon, positive }: StatCardProps) {
  return (
    <div className="p-3 rounded-lg bg-black/30 border border-white/[0.06]">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-accent" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className={cn(
        "text-lg font-bold",
        positive === true && "text-emerald-400",
        positive === false && "text-red-400",
        positive === undefined && "text-foreground"
      )}>
        {value}
      </p>
      {subtext && (
        <p className="text-[10px] text-muted-foreground">{subtext}</p>
      )}
    </div>
  );
}

interface PerformanceOverviewProps {
  edgeScore: number;
  winRate: number;
  avgRoi: number;
  thirtyDayReturn: number;
  volatility: string;
}

export function PerformanceOverview({
  edgeScore,
  winRate,
  avgRoi,
  thirtyDayReturn,
  volatility,
}: PerformanceOverviewProps) {
  return (
    <div className="rounded-xl bg-black/40 border border-white/[0.08] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-foreground">Performance</h2>
      </div>

      <div className="p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          <StatCard
            label="Edge"
            value={edgeScore.toString()}
            icon={TrendingUp}
          />
          <StatCard
            label="Win Rate"
            value={`${winRate}%`}
            icon={Target}
            positive={winRate >= 55}
          />
          <StatCard
            label="Avg ROI"
            value={`+${avgRoi}%`}
            icon={Percent}
            positive={true}
          />
          <StatCard
            label="30d Return"
            value={`${thirtyDayReturn > 0 ? '+' : ''}${thirtyDayReturn}%`}
            icon={Calendar}
            positive={thirtyDayReturn > 0}
          />
          <StatCard
            label="Volatility"
            value={volatility.split(' ')[0]}
            subtext={volatility.split(' ').slice(1).join(' ')}
            icon={Activity}
          />
        </div>

        {/* Equity Curve Chart - Lazy Loaded */}
        <div>
          <h3 className="text-xs text-muted-foreground mb-2">Equity Curve (90d)</h3>
          <div className="h-32 w-full">
            <Suspense fallback={<div className="h-32 w-full bg-black/20 rounded animate-pulse" />}>
              <LazyChart />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
