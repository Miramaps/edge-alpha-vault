import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Channel } from "@/data/mockData";

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

export function ChannelCard({ channel, index }: ChannelCardProps) {
  const capacityPercentage = (channel.minted / channel.maxSupply) * 100;
  const isOpen = channel.status === "open" || channel.status === "almost-full";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="pro-card-hover p-5 md:p-6 flex flex-col"
    >
      {/* Top Bar - Identity + Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            style={{ 
              background: 'hsl(16 20% 24%)', 
              color: 'hsl(30 4% 93%)' 
            }}
          >
            {channel.trader.name.charAt(0)}
          </div>
          {/* Name & Handle */}
          <div>
            <h3 className="text-base font-medium text-white leading-tight">
              {channel.trader.name}
            </h3>
            <p className="text-[13px] text-soft-muted">
              @{channel.trader.handle}
            </p>
          </div>
        </div>
        {/* Status Pill */}
        <span className={isOpen ? "status-open" : "status-closed"}>
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {channel.trader.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      {/* Middle - Metrics Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
        <div>
          <p className="stat-label">Floor</p>
          <p className="stat-value">{channel.floorPrice} EDGE</p>
        </div>
        <div>
          <p className="stat-label">Vol 24H</p>
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
          <p className="stat-value text-win">
            {channel.trader.stats.winRate}%
          </p>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div className="mb-2">
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${capacityPercentage}%` }}
          />
        </div>
      </div>
      <p className="text-[11px] text-soft-dim mb-5">
        Capacity: {channel.minted} / {channel.maxSupply} seats used
      </p>

      {/* Bottom - Helper Text + CTA */}
      <p className="text-[12px] text-soft-muted mb-4">
        Discord alpha room access via channel NFT.
      </p>

      <Link 
        to={`/t/${channel.trader.handle}`}
        className="btn-accent w-full text-center text-sm mt-auto"
      >
        View Channel
      </Link>
    </motion.div>
  );
}