import { useMemo } from "react";
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

export default function EquityChart() {
  const equityData = useMemo(() => generateEquityCurve(), []);

  return (
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
  );
}
