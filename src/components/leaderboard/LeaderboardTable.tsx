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
            <h2 className="text-2xl font-bold text-foreground">Top Traders</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Ranked by performance
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg border border-border/30 bg-black/40 w-fit">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timeframe === tf.value
                    ? "bg-accent/20 text-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
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
        className="rounded-xl overflow-hidden bg-black/60 border border-border/20"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border/20 hover:bg-transparent">
              <TableHead className="w-12 text-muted-foreground/60 text-xs font-normal uppercase tracking-wider">#</TableHead>
              <TableHead className="text-muted-foreground/60 text-xs font-normal uppercase tracking-wider">Trader</TableHead>
              <TableHead className="text-muted-foreground/60 text-xs font-normal uppercase tracking-wider text-right">Floor Price</TableHead>
              <TableHead className="hidden sm:table-cell text-muted-foreground/60 text-xs font-normal uppercase tracking-wider text-right">1d Change</TableHead>
              <TableHead className="hidden md:table-cell text-muted-foreground/60 text-xs font-normal uppercase tracking-wider text-right">Win Rate</TableHead>
              <TableHead className="hidden lg:table-cell text-muted-foreground/60 text-xs font-normal uppercase tracking-wider text-right">1d Vol</TableHead>
              <TableHead className="hidden md:table-cell text-muted-foreground/60 text-xs font-normal uppercase tracking-wider text-right">Members</TableHead>
              <TableHead className="hidden lg:table-cell text-muted-foreground/60 text-xs font-normal uppercase tracking-wider text-right">Markets</TableHead>
              <TableHead className="text-muted-foreground/60 text-xs font-normal uppercase tracking-wider text-right">Last 7d</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((trader, index) => (
              <TableRow 
                key={trader.id} 
                className="border-border/10 hover:bg-white/[0.02] transition-colors group"
              >
                <TableCell className="py-4">
                  <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                </TableCell>
                <TableCell className="py-4">
                  <Link to={`/t/${trader.handle}`} className="flex items-center gap-3 group-hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold text-sm flex-shrink-0">
                      {trader.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{trader.name}</p>
                      <p className="text-xs text-muted-foreground/60 truncate">@{trader.handle}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-right py-4">
                  <span className="text-sm font-medium text-foreground">{trader.floorPrice}</span>
                  <span className="text-xs text-muted-foreground/60 ml-1">SOL</span>
                </TableCell>
                <TableCell className={cn(
                  "hidden sm:table-cell text-right py-4 font-medium text-sm",
                  trader.priceChange24h > 0 ? "text-emerald-500" : trader.priceChange24h < 0 ? "text-red-500" : "text-muted-foreground"
                )}>
                  {trader.priceChange24h > 0 ? "+" : ""}{trader.priceChange24h}%
                </TableCell>
                <TableCell className="hidden md:table-cell text-right py-4">
                  <span className="text-sm text-foreground">{trader.stats.winRate}%</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right py-4">
                  <span className="text-sm text-foreground">{(trader.volume24h / 1000).toFixed(1)}k</span>
                  <span className="text-xs text-muted-foreground/60 ml-1">SOL</span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-right py-4 text-sm text-foreground">
                  {trader.members.toLocaleString()}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right py-4 text-sm text-foreground">
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
