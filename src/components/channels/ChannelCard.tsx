import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Channel } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

export function ChannelCard({ channel, index }: ChannelCardProps) {
  const supplyPercentage = (channel.minted / channel.maxSupply) * 100;

  const getStatusTag = () => {
    switch (channel.status) {
      case "open":
        return <span className="tag tag-success">Open</span>;
      case "almost-full":
        return <span className="tag tag-warning">Almost Full</span>;
      case "closed":
        return <span className="tag tag-closed">Closed</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-xl p-5 flex flex-col bg-gradient-to-br from-zinc-900/90 to-black/80 border border-accent/30 hover:border-accent/60 transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold text-sm">
            {channel.trader.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{channel.trader.name}</h3>
            <p className="text-xs text-muted-foreground">@{channel.trader.handle}</p>
          </div>
        </div>
        {getStatusTag()}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {channel.trader.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded bg-accent/15 text-accent border border-accent/25"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="stat-label">Floor</p>
          <p className="stat-value">{channel.floorPrice} EDGE</p>
        </div>
        <div>
          <p className="stat-label">Vol 24h</p>
          <p className="stat-value">{(channel.volume24h / 1000).toFixed(1)}k EDGE</p>
        </div>
        <div>
          <p className="stat-label">Members</p>
          <p className="stat-value">
            {channel.minted} / {channel.maxSupply}
          </p>
        </div>
        <div>
          <p className="stat-label">Win Rate</p>
          <p className={cn(
            "stat-value",
            channel.trader.stats.winRate >= 60 && "text-emerald-400"
          )}>
            {channel.trader.stats.winRate}%
          </p>
        </div>
      </div>

      {/* Supply Progress */}
      <div className="mb-4">
        <Progress value={supplyPercentage} className="h-1.5" />
      </div>

      {/* Discord hint */}
      <p className="text-xs text-muted-foreground mb-4">
        Discord alpha room access via NFT
      </p>

      {/* Action */}
      <Button variant="hero" className="w-full mt-auto" asChild>
        <Link to={`/t/${channel.trader.handle}`}>View Channel</Link>
      </Button>
    </motion.div>
  );
}
