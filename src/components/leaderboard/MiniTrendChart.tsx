import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface MiniTrendChartProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

export function MiniTrendChart({ 
  data, 
  width = 80, 
  height = 32,
  className 
}: MiniTrendChartProps) {
  const { path, isPositive } = useMemo(() => {
    if (data.length < 2) return { path: "", isPositive: true };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return { x, y };
    });

    const pathData = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      
      // Smooth curve using quadratic bezier
      const prev = points[i - 1];
      const cpX = (prev.x + point.x) / 2;
      return `${acc} Q ${cpX} ${prev.y} ${point.x} ${point.y}`;
    }, "");

    const isPositive = data[data.length - 1] >= data[0];
    
    return { path: pathData, isPositive };
  }, [data, width, height]);

  return (
    <svg 
      width={width} 
      height={height} 
      className={cn("flex-shrink-0", className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={path}
        fill="none"
        stroke={isPositive ? "hsl(142 76% 36%)" : "hsl(0 72% 51%)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
