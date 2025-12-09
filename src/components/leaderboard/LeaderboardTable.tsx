import { useMemo, useState } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";

type TimeFrame = "1d" | "7d" | "30d" | "all";

interface LeaderboardTableProps {
  limit?: number;
  showHeader?: boolean;
}

// Mobile card component for each trader
function MobileTraderCard({ trader, index, channel }: { 
  trader: typeof leaderboardData[0]; 
  index: number;
  channel?: typeof channels[0];
}) {
  const navigate = useNavigate();
  
  return (
    <div
      onClick={() => navigate(`/t/${trader.handle}`)}
      className={cn(
        "p-3 rounded-lg border cursor-pointer transition-colors",
        index === 0 && "bg-accent/15 border-accent/40",
        index === 1 && "bg-white/10 border-white/20",
        index === 2 && "bg-white/5 border-white/15",
        index > 2 && "bg-black/30 border-white/[0.08] hover:bg-white/[0.04]"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <span
          className={cn(
            "w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full flex-shrink-0",
            index === 0 && "bg-accent text-white",
            index === 1 && "bg-white/20 text-white",
            index === 2 && "bg-white/10 text-white",
            index > 2 && "bg-transparent text-muted-foreground border border-white/10"
          )}
        >
          {index + 1}
        </span>
        
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-sm font-medium text-muted-foreground flex-shrink-0">
          {trader.name.charAt(0)}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{trader.name}</p>
          <p className="text-xs text-muted-foreground truncate">@{trader.handle}</p>
        </div>
        
        {/* Stats */}
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-medium text-white">{trader.floorPrice} <span className="text-xs text-muted-foreground">EDGE</span></p>
          <p className={cn(
            "text-xs font-medium",
            trader.priceChange24h > 0 ? "text-emerald-400" : trader.priceChange24h < 0 ? "text-red-400" : "text-muted-foreground"
          )}>
            {trader.priceChange24h > 0 ? "+" : ""}{trader.priceChange24h}%
          </p>
        </div>
      </div>
      
      {/* Bottom row with more stats */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground">Win: <span className="text-emerald-400 font-medium">{trader.stats.winRate}%</span></span>
          <span className="text-muted-foreground">Members: <span className="text-white font-medium">{trader.members}</span></span>
        </div>
        <MiniTrendChart data={trader.trendData} />
      </div>
    </div>
  );
}

export function LeaderboardTable({ limit, showHeader = true }: LeaderboardTableProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>("1d");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Top Channels</h2>
            <p className="text-soft-dim text-sm mt-1">Ranked by performance</p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg w-fit bg-black/30 border border-white/[0.06]">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timeframe === tf.value ? "text-white" : "text-soft-dim hover:text-soft"
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
        </div>
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
              <TableHead className="text-[11px] font-normal uppercase tracking-wider text-right" style={{ color: 'hsl(30 4% 93% / 0.56)' }}>Price</TableHead>
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

                const rowContent = (
                  <TableRow 
                    onClick={() => navigate(`/t/${trader.handle}`)}
                    className={cn(
                      "transition-all cursor-pointer group border-white/[0.04] hover:border-white/[0.08]",
                      index === 0 && "bg-accent/15 hover:bg-accent/25 ring-1 ring-accent/35 border-l-4 border-l-accent/70",
                      index === 1 && "bg-white/10 hover:bg-white/16 ring-1 ring-white/18 border-l-4 border-l-white/60",
                      index === 2 && "bg-white/6 hover:bg-white/12 ring-1 ring-white/12 border-l-4 border-l-white/45",
                      index > 2 && "hover:bg-white/[0.04]"
                    )}
                  >
                    <TableCell className="py-4">
                      <span
                        className={cn(
                          "inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full border",
                          index === 0 && "bg-accent text-white border-accent",
                          index === 1 && "bg-white/15 text-white border-white/30",
                          index === 2 && "bg-white/10 text-white border-white/25",
                          index > 2 && "text-soft-dim border-white/10 bg-transparent"
                        )}
                      >
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 bg-black/30 text-muted-foreground">
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
                    <TableCell 
                      className="text-right py-4 font-medium text-sm"
                      style={trader.priceChange24h > 0 ? { color: 'hsl(142 71% 45%)' } : trader.priceChange24h < 0 ? { color: 'hsl(355 71% 51%)' } : {}}
                    >
                      {trader.priceChange24h > 0 ? "+" : ""}{trader.priceChange24h}%
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <span className="text-sm" style={{ color: 'hsl(142 71% 45%)' }}>{trader.stats.winRate}%</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right py-4">
                      <span className="text-sm text-white">{(trader.volume24h / 1000).toFixed(1)}k</span>
                      <span className="text-xs text-soft-dim ml-1">EDGE</span>
                    </TableCell>
                    <TableCell className="text-right py-4 text-sm text-white">
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
                );

                return (
                  <HoverCard key={trader.id} openDelay={120} closeDelay={120}>
                    <HoverCardTrigger asChild>
                      {rowContent}
                    </HoverCardTrigger>
                    <HoverCardContent 
                      side="top"
                      align="center"
                      sideOffset={8}
                      className="w-[420px] max-w-[90vw] rounded-xl bg-black/90 backdrop-blur-md border border-white/[0.12] p-4 shadow-2xl"
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-sm font-medium text-white border border-white/10">
                              {trader.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-white text-sm truncate">{trader.name}</h3>
                              <p className="text-[11px] text-soft-dim truncate">@{trader.handle}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                              Rank #{index + 1}
                            </span>
                            {status && (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full border",
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
                        <p className="text-[11px] text-soft-dim mb-0.5">Price</p>
                        <p className="text-sm font-medium text-white">{priceLabel}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">24h Vol</p>
                        <p className="text-sm font-medium text-white">{volLabel}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">Capacity</p>
                        <p className="text-sm font-medium text-white">{supplyLabel}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-soft-dim mb-0.5">Markets Traded</p>
                        <p className="text-sm font-medium text-white">
                          {trader.stats.marketsTraded.toLocaleString()}
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
                      {channel && (
                        <div>
                          <p className="text-[11px] text-soft-dim mb-0.5">Discord</p>
                          <p className="text-sm font-medium text-white truncate">
                            {channel.discordUrl.replace(/^https?:\/\//, "")}
                          </p>
                        </div>
                      )}
                    </div>

                        {/* Risk & Channel Info */}
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.08]">
                          <div>
                            <p className="text-[10px] text-soft-dim uppercase tracking-wide mb-1">Max Drawdown</p>
                            <p className="text-sm font-medium text-red-400">-{trader.stats.maxDrawdown}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-soft-dim uppercase tracking-wide mb-1">Markets</p>
                            <p className="text-sm font-medium text-white">{trader.stats.marketsTraded}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-soft-dim uppercase tracking-wide mb-1">Consistency</p>
                            <p className="text-sm font-medium text-white">{trader.stats.consistency}%</p>
                          </div>
                        </div>

                        {/* Primary Markets */}
                        <div className="pt-3 border-t border-white/[0.08]">
                          <p className="text-[10px] text-soft-dim uppercase tracking-wide mb-2">Primary Markets</p>
                          <div className="flex flex-wrap gap-1.5">
                            {trader.stats.primaryMarkets.slice(0, 4).map((market, i) => (
                              <span key={i} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 border border-white/10 text-white">
                                {market}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Click hint */}
                        <p className="text-[10px] text-soft-dim text-center pt-2 border-t border-white/[0.06]">
                          Click to view full profile
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
