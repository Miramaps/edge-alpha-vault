
import { TrendingUp, Target, Percent, Calendar, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Generate mock equity curve data
const generateEquityCurve = () => {
  const data = [];
  let value = 100;
  for (let i = 0; i <= 90; i += 3) {
    const change = (Math.random() - 0.4) * 4;
    value = Math.max(80, Math.min(140, value + change));
    data.push({ day: i, value: Math.round(value * 10) / 10 });
  }
  data[data.length - 1].value = Math.max(data[data.length - 1].value, 118);
  return data;
};

const equityData = generateEquityCurve();

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
    <div
      className="rounded-xl bg-black/40 backdrop-blur-sm border border-white/[0.08] overflow-hidden"
    >
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

        {/* Equity Curve Chart */}
        <div>
          <h3 className="text-xs text-muted-foreground mb-2">Equity Curve (90d)</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                  tickFormatter={(value) => `${value}d`}
                />
                <YAxis 
                  domain={[80, 140]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--accent) / 0.3)',
                    borderRadius: '6px',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px'
                  }}
                  labelFormatter={(value) => `Day ${value}`}
                  formatter={(value: number) => [value.toFixed(1), 'Index']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--accent))"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3, fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
