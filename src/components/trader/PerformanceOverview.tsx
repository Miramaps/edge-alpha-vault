import { motion } from "framer-motion";
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
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-accent" />
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className={cn(
        "text-2xl font-bold",
        positive === true && "text-emerald-400",
        positive === false && "text-red-400",
        positive === undefined && "text-foreground"
      )}>
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] overflow-hidden"
    >
      <div className="p-5 border-b border-white/[0.05]">
        <h2 className="text-lg font-semibold text-foreground">Performance Overview</h2>
      </div>

      <div className="p-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatCard
            label="Edge Score"
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
            label="Avg ROI / Trade"
            value={`+${avgRoi}%`}
            icon={Percent}
            positive={true}
          />
          <StatCard
            label="30-Day Return"
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
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Equity Curve (Last 90 Days)</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickFormatter={(value) => `${value}d`}
                />
                <YAxis 
                  domain={[80, 140]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--accent) / 0.3)',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  labelFormatter={(value) => `Day ${value}`}
                  formatter={(value: number) => [value.toFixed(1), 'Index']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
