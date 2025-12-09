import { motion } from "framer-motion";
import { Users, TrendingUp, Clock, MessageSquare, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ChannelAnalyticsAccessProps {
  members: number;
  maxMembers: number;
  memberGrowth: number;
  retentionPercent: number;
  postsPerDay: number;
  signalsPerWeek: string;
  floorPrice: number;
  volume24h: number;
  onBuyClick: () => void;
  disabled?: boolean;
}

export function ChannelAnalyticsAccess({
  members,
  maxMembers,
  memberGrowth,
  retentionPercent,
  postsPerDay,
  signalsPerWeek,
  floorPrice,
  volume24h,
  onBuyClick,
  disabled,
}: ChannelAnalyticsAccessProps) {
  const seatsAvailable = maxMembers - members;
  const fillPercent = (members / maxMembers) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] overflow-hidden"
    >
      <div className="p-5 border-b border-white/[0.05]">
        <h2 className="text-lg font-semibold text-foreground">Channel Analytics and Access</h2>
      </div>

      <div className="p-5">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Channel Analytics */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Channel Analytics
            </h3>

            {/* Members */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Members</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {members} / {maxMembers} seats filled
              </span>
            </div>

            {/* Member Growth */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Member Growth (30d)</span>
              </div>
              <span className="text-sm font-medium text-emerald-400">
                +{memberGrowth}%
              </span>
            </div>

            {/* Retention */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Retention</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {retentionPercent}% stay &gt; 30 days
              </span>
            </div>

            {/* Engagement */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Engagement</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {postsPerDay} posts/day in Discord
              </span>
            </div>

            {/* Signal Frequency */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Signal Frequency</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {signalsPerWeek} ideas/week
              </span>
            </div>
          </div>

          {/* Right - Access Card */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <h3 className="text-base font-semibold text-foreground mb-3">
              Access via Channel NFT
            </h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Hold 1 Channel NFT to stay in this Discord alpha. Selling the NFT removes access.
            </p>

            {/* NFT Stats */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Max Supply</span>
                <span className="text-foreground font-medium">{maxMembers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Floor</span>
                <span className="text-foreground font-medium">{floorPrice} SOL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">24h Volume</span>
                <span className="text-foreground font-medium">{(volume24h / 1000).toFixed(1)}k SOL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seats Available</span>
                <span className="text-foreground font-medium">{seatsAvailable} remaining</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
              <Progress value={fillPercent} className="h-1.5" />
            </div>

            {/* Buy Button */}
            <Button
              variant="hero"
              onClick={onBuyClick}
              disabled={disabled}
              className="w-full h-11"
            >
              Buy Access NFT
            </Button>

            {/* Marketplace Link */}
            <button className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              View on Marketplace
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
