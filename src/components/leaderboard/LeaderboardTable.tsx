import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

type TimeFrame = "24h" | "7d" | "30d" | "all";

interface LeaderboardTableProps {
  limit?: number;
  showHeader?: boolean;
}

export function LeaderboardTable({ limit, showHeader = true }: LeaderboardTableProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>("all");

  const timeframes: { value: TimeFrame; label: string }[] = [
    { value: "24h", label: "24h" },
    { value: "7d", label: "7d" },
    { value: "30d", label: "30d" },
    { value: "all", label: "All time" },
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
            <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Top traders by performance
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-md border border-border/50 w-fit">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf.value)}
                className="text-xs h-7 px-3"
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="glass-card overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-12 text-muted-foreground">#</TableHead>
              <TableHead className="text-muted-foreground">Trader</TableHead>
              <TableHead className="hidden md:table-cell text-muted-foreground text-right">Markets</TableHead>
              <TableHead className="hidden sm:table-cell text-muted-foreground text-right">PnL</TableHead>
              <TableHead className="hidden lg:table-cell text-muted-foreground text-right">Win Rate</TableHead>
              <TableHead className="hidden md:table-cell text-muted-foreground text-right">Members</TableHead>
              <TableHead className="hidden lg:table-cell text-muted-foreground text-right">Floor</TableHead>
              <TableHead className="text-muted-foreground text-right">Vol 24h</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((trader, index) => (
              <TableRow 
                key={trader.id} 
                className="border-border/30 hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {trader.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold text-xs flex-shrink-0">
                      {trader.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{trader.name}</p>
                      <p className="text-xs text-muted-foreground truncate">@{trader.handle}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-right text-sm">
                  {trader.stats.marketsTraded}
                </TableCell>
                <TableCell className={cn(
                  "hidden sm:table-cell text-right font-medium text-sm",
                  trader.stats.lifetimePnl > 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {trader.stats.lifetimePnl > 0 ? "+" : ""}{trader.stats.lifetimePnl}%
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right text-sm">
                  {trader.stats.winRate}%
                </TableCell>
                <TableCell className="hidden md:table-cell text-right text-sm">
                  {trader.members}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right text-sm">
                  {trader.floorPrice} EDGE
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {(trader.volume24h / 1000).toFixed(1)}k
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild className="text-accent hover:text-foreground">
                    <Link to={`/t/${trader.handle}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
