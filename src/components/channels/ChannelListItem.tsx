import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Channel } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ChannelListItemProps {
  channel: Channel;
}

export function ChannelListItem({ channel }: ChannelListItemProps) {
  const supplyPercentage = (channel.minted / channel.maxSupply) * 100;

  const getStatusTag = () => {
    switch (channel.status) {
      case "open":
        return <span className="tag tag-success text-xs">Open</span>;
      case "almost-full":
        return <span className="tag tag-warning text-xs">Almost Full</span>;
      case "closed":
        return <span className="tag tag-closed text-xs">Closed</span>;
    }
  };

  return (
    <div className="glass-card p-4 flex items-center gap-4 hover:border-accent/30 transition-colors">
      {/* Avatar and Name */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold text-sm flex-shrink-0">
          {channel.trader.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-foreground text-sm truncate">{channel.trader.name}</h3>
          <p className="text-xs text-muted-foreground truncate">@{channel.trader.handle}</p>
        </div>
      </div>

      {/* Members */}
      <div className="hidden sm:block min-w-[100px]">
        <p className="stat-label">Members</p>
        <div className="flex items-center gap-2">
          <span className="stat-value text-sm">{channel.minted}/{channel.maxSupply}</span>
          <Progress value={supplyPercentage} className="h-1 w-12" />
        </div>
      </div>

      {/* Floor */}
      <div className="hidden md:block min-w-[80px]">
        <p className="stat-label">Floor</p>
        <p className="stat-value text-sm">{channel.floorPrice} EDGE</p>
      </div>

      {/* Volume */}
      <div className="hidden lg:block min-w-[80px]">
        <p className="stat-label">Vol 24h</p>
        <p className="stat-value text-sm">{(channel.volume24h / 1000).toFixed(1)}k</p>
      </div>

      {/* Win Rate */}
      <div className="hidden lg:block min-w-[60px]">
        <p className="stat-label">Win Rate</p>
        <p className={cn(
          "stat-value text-sm",
          channel.trader.stats.winRate >= 60 && "text-emerald-400"
        )}>
          {channel.trader.stats.winRate}%
        </p>
      </div>

      {/* Status */}
      <div className="hidden sm:block ml-auto">
        {getStatusTag()}
      </div>

      {/* Action */}
      <Button variant="outline" size="sm" asChild>
        <Link to={`/t/${channel.trader.handle}`}>View</Link>
      </Button>
    </div>
  );
}
