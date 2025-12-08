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
      className="rounded-xl bg-[#1A2C39] border border-[#2B475B] overflow-hidden"
    >
      <div className="p-5 border-b border-[#2B475B]">
        <h2 className="text-lg font-semibold text-white">Channel Analytics and Access</h2>
      </div>

      <div className="p-5">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Channel Analytics */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium text-[#6393B7] uppercase tracking-wide mb-4">
              Channel Analytics
            </h3>

            {/* Members */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#2B475B]/20 border border-[#395E77]/20">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#6393B7]" />
                <span className="text-sm text-[#6393B7]">Members</span>
              </div>
              <span className="text-sm font-medium text-white">
                {members} / {maxMembers} seats filled
              </span>
            </div>

            {/* Member Growth */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#2B475B]/20 border border-[#395E77]/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-[#6393B7]" />
                <span className="text-sm text-[#6393B7]">Member Growth (30d)</span>
              </div>
              <span className="text-sm font-medium text-emerald-400">
                +{memberGrowth}%
              </span>
            </div>

            {/* Retention */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#2B475B]/20 border border-[#395E77]/20">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#6393B7]" />
                <span className="text-sm text-[#6393B7]">Retention</span>
              </div>
              <span className="text-sm font-medium text-white">
                {retentionPercent}% stay &gt; 30 days
              </span>
            </div>

            {/* Engagement */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#2B475B]/20 border border-[#395E77]/20">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#6393B7]" />
                <span className="text-sm text-[#6393B7]">Engagement</span>
              </div>
              <span className="text-sm font-medium text-white">
                {postsPerDay} posts/day in Discord
              </span>
            </div>

            {/* Signal Frequency */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#2B475B]/20 border border-[#395E77]/20">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-[#6393B7]" />
                <span className="text-sm text-[#6393B7]">Signal Frequency</span>
              </div>
              <span className="text-sm font-medium text-white">
                {signalsPerWeek} ideas/week
              </span>
            </div>
          </div>

          {/* Right - Access Card */}
          <div className="p-5 rounded-xl bg-[#2B475B]/40 border border-[#395E77]/40">
            <h3 className="text-base font-semibold text-white mb-3">
              Access via Channel NFT
            </h3>
            <p className="text-sm text-[#6393B7] mb-5 leading-relaxed">
              Hold 1 Channel NFT to stay in this Discord alpha. Selling the NFT removes access.
            </p>

            {/* NFT Stats */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#6393B7]">Max Supply</span>
                <span className="text-white font-medium">{maxMembers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6393B7]">Current Floor</span>
                <span className="text-white font-medium">{floorPrice} SOL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6393B7]">24h Volume</span>
                <span className="text-white font-medium">{(volume24h / 1000).toFixed(1)}k SOL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6393B7]">Seats Available</span>
                <span className="text-white font-medium">{seatsAvailable} remaining</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
              <Progress value={fillPercent} className="h-1.5 bg-[#395E77]/30" />
            </div>

            {/* Buy Button */}
            <Button
              onClick={onBuyClick}
              disabled={disabled}
              className="w-full h-11 bg-[#4F7E9E] hover:bg-[#6393B7] text-white font-medium"
            >
              Buy Access NFT
            </Button>

            {/* Marketplace Link */}
            <button className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-[#6393B7] hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              View on Marketplace
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
