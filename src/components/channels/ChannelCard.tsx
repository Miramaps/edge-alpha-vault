import { Link } from "react-router-dom";
import type { Channel } from "@/data/mockData";
import { TwitterIcon } from "@/components/icons/SocialIcons";

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

export function ChannelCard({ channel, index }: ChannelCardProps) {
  const capacityPercentage = (channel.minted / channel.maxSupply) * 100;
  const isOpen = channel.status === "open" || channel.status === "almost-full";

  return (
    <div
      className="rounded-2xl bg-black/40 backdrop-blur-sm border border-white/[0.08] p-5 md:p-6 flex flex-col hover:border-white/[0.12] transition-all duration-200"
    >
      {/* Top Bar - Identity + Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-black/30 text-muted-foreground"
          >
            {channel.trader.name.charAt(0)}
          </div>
          {/* Name & Handle with X link */}
          <div>
            <h3 className="text-base font-medium text-white leading-tight">
              {channel.trader.name}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-[13px] text-soft-muted">
                @{channel.trader.handle}
              </p>
              <a 
                href={`https://x.com/${channel.trader.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-soft-dim hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <TwitterIcon size={14} />
              </a>
            </div>
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
          <p className="stat-value">{channel.floorPrice} SOL</p>
        </div>
        <div>
          <p className="stat-label">Vol 24H</p>
          <p className="stat-value">{(channel.volume24h / 1000).toFixed(1)}k SOL</p>
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
    </div>
  );
}