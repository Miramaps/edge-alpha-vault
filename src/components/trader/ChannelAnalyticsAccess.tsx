
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
    <div
      className="rounded-xl bg-black/40 border border-white/[0.08] overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-foreground">Channel & Access</h2>
      </div>

      <div className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left - Channel Analytics */}
          <div className="space-y-2">
            <h3 className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
              Analytics
            </h3>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">Members</span>
              </div>
              <span className="text-xs font-medium text-foreground">
                {members}/{maxMembers}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">Growth (30d)</span>
              </div>
              <span className="text-xs font-medium text-emerald-400">+{memberGrowth}%</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">Retention</span>
              </div>
              <span className="text-xs font-medium text-foreground">{retentionPercent}%</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">Posts/day</span>
              </div>
              <span className="text-xs font-medium text-foreground">{postsPerDay}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">Signals/week</span>
              </div>
              <span className="text-xs font-medium text-foreground">{signalsPerWeek}</span>
            </div>
          </div>

          {/* Right - Access Card */}
          <div className="p-4 rounded-lg bg-black/30 border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              NFT Access
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Hold 1 NFT for Discord access. Sell to revoke.
            </p>

            {/* NFT Stats */}
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supply</span>
                <span className="text-foreground font-medium">{maxMembers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Floor</span>
                <span className="text-foreground font-medium">{floorPrice} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Vol</span>
                <span className="text-foreground font-medium">{(volume24h / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available</span>
                <span className="text-foreground font-medium">{seatsAvailable}</span>
              </div>
            </div>

            <Progress value={fillPercent} className="h-1 mb-4" />

            <Button
              variant="hero"
              onClick={onBuyClick}
              disabled={disabled}
              className="w-full h-9 text-sm"
            >
              Buy Access
            </Button>

            <button className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="w-3 h-3" />
              Marketplace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
