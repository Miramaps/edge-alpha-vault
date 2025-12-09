import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { leaderboardData, channels } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { MiniTrendChart } from "./MiniTrendChart";

type TimeFrame = "1d" | "7d" | "30d" | "all";

interface LeaderboardTableProps {
  limit?: number;
  showHeader?: boolean;
}

export function LeaderboardTable({ limit, showHeader = true }: LeaderboardTableProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>("1d");
  const navigate = useNavigate();

  const timeframes: { value: TimeFrame; label: string }[] = [
    { value: "all", label: "All" },
    { value: "30d", label: "30d" },
    { value: "7d", label: "7d" },
    { value: "1d", label: "1d" },
  ];

  const data = limit ? leaderboardData.slice(0, limit) : leaderboardData;

  const channelByTraderId = useMemo(() => {
    const map = new Map<string, (typeof channels)[number]>();
    channels.forEach((c) => map.set(c.trader.id, c));
    return map;
  }, []);

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
            <h2 className="text-2xl font-bold text-white">Top Channels</h2>
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
        className="rounded-xl bg-black/40 backdrop-blur-sm border border-white/[0.08] overflow-x-auto"
      >
        <Table className="min-w-[600px]">
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
            {data.map((trader, index) => {
              const channel = channelByTraderId.get(trader.id);
              const status = channel?.status;
              const supplyLabel = channel ? `${channel.minted}/${channel.maxSupply}` : "—";
              const priceLabel = channel ? `${channel.floorPrice} EDGE` : `${trader.floorPrice} EDGE`;
              const volLabel = channel ? `${(channel.volume24h / 1000).toFixed(1)}k EDGE` : `${(trader.volume24h / 1000).toFixed(1)}k EDGE`;

              return (
              <HoverCard key={trader.id} openDelay={120} closeDelay={120}>
                <HoverCardTrigger asChild>
                  <TableRow 
                    onClick={() => navigate(`/t/${trader.handle}`)}
                    className={cn(
                      "transition-all cursor-pointer group border-white/[0.04] hover:border-white/[0.08] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
                      index === 0 &&
                        "bg-accent/15 hover:bg-accent/25 ring-1 ring-accent/35 border-l-4 border-l-accent/70 shadow-[0_8px_30px_rgba(213,45,62,0.18)]",
                      index === 1 &&
                        "bg-white/10 hover:bg-white/16 ring-1 ring-white/18 border-l-4 border-l-white/60 shadow-[0_6px_22px_rgba(255,255,255,0.12)]",
                      index === 2 &&
                        "bg-white/6 hover:bg-white/12 ring-1 ring-white/12 border-l-4 border-l-white/45 shadow-[0_6px_18px_rgba(255,255,255,0.1)]",
                      index > 2 && "hover:bg-white/[0.04]"
                    )}
                  >
                      <TableCell className="py-4">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full border",
                            index === 0 && "bg-accent text-white border-accent shadow-[0_6px_18px_rgba(213,45,62,0.3)]",
                            index === 1 && "bg-white/15 text-white border-white/30 shadow-[0_4px_14px_rgba(255,255,255,0.18)]",
                            index === 2 && "bg-white/10 text-white border-white/25 shadow-[0_3px_12px_rgba(255,255,255,0.14)]",
                            index > 2 && "text-soft-dim border-white/10 bg-transparent"
                          )}
                        >
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 bg-black/30 text-muted-foreground"
                          >
                            {trader.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white text-sm truncate">{trader.name}</p>
                            <p className="text-xs text-soft-dim truncate">@{trader.handle}</p>
                          </div>
                        </div>
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
                </HoverCardTrigger>
                <HoverCardContent 
                  side="top"
                  align="center"
                  sideOffset={0}
                  alignOffset={0}
                  className="pointer-events-auto fixed left-1/2 top-6 -translate-x-1/2 w-[640px] max-w-[95vw] rounded-xl bg-black/60 backdrop-blur-lg border border-white/[0.08] p-3.5 shadow-2xl"
                >
                  <div className="space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-sm truncate">{trader.name}</h3>
                        <p className="text-[11px] text-soft-dim mt-0.5 truncate">@{trader.handle}</p>
                        {channel?.description && (
                          <p className="text-[11px] text-soft-dim mt-1 line-clamp-2">
                            {channel.description}
                          </p>
                        )}
                        {status && (
                          <span
                            className={cn(
                              "mt-2 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-full border",
                              status === "open" && "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
                              status === "almost-full" && "border-amber-400/50 text-amber-300 bg-amber-500/10",
                              status === "closed" && "border-white/20 text-soft-dim bg-white/5"
                            )}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {status === "almost-full" ? "Almost full" : status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/20 whitespace-nowrap">
                          Rank #{index + 1}
                        </span>
                        <div className="mt-2 text-[11px] text-soft-dim">
                          Daily change{" "}
                          <span
                            className={cn(
                              "font-medium",
                              trader.priceChange24h > 0 ? "text-win" : trader.priceChange24h < 0 ? "text-accent-red" : "text-soft"
                            )}
                          >
                            {trader.priceChange24h > 0 ? "+" : ""}
                            {trader.priceChange24h}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {trader.tags && trader.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {trader.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-accent border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Snapshot rows */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/[0.05]">
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">Floor</p>
                        <p className="text-sm font-medium text-white">{priceLabel}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">24h Vol</p>
                        <p className="text-sm font-medium text-white">{volLabel}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">Supply</p>
                        <p className="text-sm font-medium text-white">{supplyLabel}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">Members</p>
                        <p className="text-sm font-medium text-white">
                          {trader.members.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">Lifetime PNL</p>
                        <p className="text-sm font-medium text-white">
                          {trader.stats.lifetimePnl > 0 ? "+" : ""}{trader.stats.lifetimePnl}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">Win Rate</p>
                        <p className="text-sm font-medium" style={{ color: 'hsl(142 71% 45%)' }}>
                          {trader.stats.winRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">Markets Traded</p>
                        <p className="text-sm font-medium text-white">
                          {trader.stats.marketsTraded.toLocaleString()}
                        </p>
                      </div>
                      {channel && (
                        <div>
                          <p className="text-[11px] text-soft-dim mb-0.5">Discord</p>
                          <p className="text-sm font-medium text-white truncate">
                            {channel.discordUrl.replace(/^https?:\/\//, "")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Call to action */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                      <p className="text-[11px] text-soft-dim">
                        Click row for full profile
                      </p>
                      <button
                        onClick={() => navigate(`/t/${trader.handle}`)}
                        className="text-[11px] font-semibold text-accent hover:underline"
                      >
                        View trader
                      </button>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}