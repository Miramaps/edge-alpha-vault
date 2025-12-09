import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { leaderboardData } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { MiniTrendChart } from "./MiniTrendChart";

type TimeFrame = "1d" | "7d" | "30d" | "all";

interface LeaderboardTableProps {
  limit?: number;
  showHeader?: boolean;
}

export function LeaderboardTable({ limit, showHeader = true }: LeaderboardTableProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>("1d");

  const timeframes: { value: TimeFrame; label: string }[] = [
    { value: "all", label: "All" },
    { value: "30d", label: "30d" },
    { value: "7d", label: "7d" },
    { value: "1d", label: "1d" },
  ];

  const data = limit ? leaderboardData.slice(0, limit) : leaderboardData;

  return (
    <div>
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-white">Top Traders</h2>
            <p className="text-soft-dim text-sm mt-1">
              Ranked by performance
            </p>
          </div>

          <div 
            className="flex items-center gap-1 p-1 rounded-lg w-fit bg-black/30 border border-white/[0.06]"
          >
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timeframe === tf.value
                    ? "text-white"
                    : "text-soft-dim hover:text-soft"
                )}
                style={timeframe === tf.value ? { 
                  background: 'hsl(355 71% 51% / 0.2)',
                  color: 'hsl(355 71% 51%)'
                } : {}}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-black/40 backdrop-blur-sm border border-white/[0.08] overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow 
              className="hover:bg-transparent border-white/[0.06]"
            >
              <TableHead className="w-12 text-[11px] font-normal uppercase tracking-wider" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>#</TableHead>
              <TableHead className="text-[11px] font-normal uppercase tracking-wider" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>Trader</TableHead>
              <TableHead className="text-[11px] font-normal uppercase tracking-wider text-right" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>Floor Price</TableHead>
              <TableHead className="hidden sm:table-cell text-[11px] font-normal uppercase tracking-wider text-right" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>1d Change</TableHead>
              <TableHead className="hidden md:table-cell text-[11px] font-normal uppercase tracking-wider text-right" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>Win Rate</TableHead>
              <TableHead className="hidden lg:table-cell text-[11px] font-normal uppercase tracking-wider text-right" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>1d Vol</TableHead>
              <TableHead className="hidden md:table-cell text-[11px] font-normal uppercase tracking-wider text-right" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>Members</TableHead>
              <TableHead className="hidden lg:table-cell text-[11px] font-normal uppercase tracking-wider text-right" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>Markets</TableHead>
              <TableHead className="text-[11px] font-normal uppercase tracking-wider text-right" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>Last 7d</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((trader, index) => (
              <TableRow 
                key={trader.id} 
                className="transition-colors group hover:bg-white/[0.02] border-white/[0.04]"
              >
                <TableCell className="py-4">
                  <span className="text-sm font-medium text-soft-dim">{index + 1}</span>
                </TableCell>
                <TableCell className="py-4">
                  <Link to={`/t/${trader.handle}`} className="flex items-center gap-3 group-hover:opacity-80 transition-opacity">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 bg-black/30 text-muted-foreground"
                    >
                      {trader.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{trader.name}</p>
                      <p className="text-xs text-soft-dim truncate">@{trader.handle}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-right py-4">
                  <span className="text-sm font-medium text-white">{trader.floorPrice}</span>
                  <span className="text-xs text-soft-dim ml-1">EDGE</span>
                </TableCell>
                <TableCell className={cn(
                  "hidden sm:table-cell text-right py-4 font-medium text-sm",
                  trader.priceChange24h > 0 ? "text-win" : trader.priceChange24h < 0 ? "text-accent-red" : "text-soft-dim"
                )}
                style={trader.priceChange24h > 0 ? { color: 'hsl(142 71% 45%)' } : trader.priceChange24h < 0 ? { color: 'hsl(355 71% 51%)' } : {}}
                >
                  {trader.priceChange24h > 0 ? "+" : ""}{trader.priceChange24h}%
                </TableCell>
                <TableCell className="hidden md:table-cell text-right py-4">
                  <span className="text-sm" style={{ color: 'hsl(142 71% 45%)' }}>{trader.stats.winRate}%</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right py-4">
                  <span className="text-sm text-white">{(trader.volume24h / 1000).toFixed(1)}k</span>
                  <span className="text-xs text-soft-dim ml-1">EDGE</span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-right py-4 text-sm text-white">
                  {trader.members.toLocaleString()}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right py-4 text-sm text-white">
                  {trader.stats.marketsTraded.toLocaleString()}
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex justify-end">
                    <MiniTrendChart data={trader.trendData} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}