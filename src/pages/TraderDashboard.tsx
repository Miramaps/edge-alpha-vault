import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ExternalLink, Eye, Settings } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BuyModal } from "@/components/modals/BuyModal";
import { PerformanceOverview } from "@/components/trader/PerformanceOverview";
import { StyleRiskProfile } from "@/components/trader/StyleRiskProfile";
import { ChannelAnalyticsAccess } from "@/components/trader/ChannelAnalyticsAccess";
import { channels } from "@/data/mockData";

export default function TraderDashboard() {
  const { handle } = useParams<{ handle: string }>();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isOwnerMode, setIsOwnerMode] = useState(false);

  const channel = useMemo(() => {
    return channels.find((c) => c.trader.handle === handle);
  }, [handle]);

  if (!channel) {
  return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Channel not found</h1>
          <Button asChild>
            <Link to="/">Back to Channels</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Mock data for the new components
  const performanceData = {
    edgeScore: 86,
    winRate: channel.trader.stats.winRate,
    avgRoi: 4.2,
    thirtyDayReturn: 18.7,
    volatility: "Medium 1.9x avg swing",
  };

  const styleData = {
    primaryMarkets: channel.trader.tags,
    timeHorizon: "Swing (days)" as const,
    strategyNotes: "Focuses on early positioning in political markets, scaling in on mispriced odds and exiting before major news events. Combines fundamental analysis with sentiment tracking.",
    riskAppetite: "Balanced" as const,
    consistencyPercent: 72,
    maxDrawdown: -12.3,
  };

  const analyticsData = {
    members: channel.minted,
    maxMembers: channel.maxSupply,
    memberGrowth: 14,
    retentionPercent: 78,
    postsPerDay: 4.2,
    signalsPerWeek: "3-5",
    floorPrice: channel.floorPrice,
    volume24h: channel.volume24h,
  };

  return (
    <Layout>
      {/* Background image */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <img 
          src="/bg.jpg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative w-full px-6 md:px-10 lg:px-16 py-8 md:py-10">
        {/* Owner mode toggle (for demo) - hidden on mobile */}
        <div className="hidden md:flex justify-end mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOwnerMode(!isOwnerMode)}
            className="text-muted-foreground hover:text-foreground text-xs h-8"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            {isOwnerMode ? "Viewer Mode" : "Owner Mode"}
          </Button>
        </div>

        {/* Header */}
        <div
          className="rounded-xl bg-black/40 border border-white/[0.08] p-4 md:p-5 mb-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Trader Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold text-lg flex-shrink-0">
                {channel.trader.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {channel.trader.name}
                </h1>
                <p className="text-muted-foreground text-sm">@{channel.trader.handle}</p>
              </div>
              <div className="hidden sm:flex flex-wrap gap-1.5 ml-4">
                {channel.trader.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 text-[11px] rounded bg-accent/15 text-accent border border-accent/25"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="hero"
                size="sm"
                onClick={() => setIsBuyModalOpen(true)}
                disabled={channel.status === "closed"}
                className="h-9 text-sm"
              >
                Buy Access
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="h-9 text-sm"
              >
                <a href={channel.discordUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Discord
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Owner Mode Settings */}
        {isOwnerMode && (
          <div
            className="rounded-xl bg-black/40 border border-white/[0.08] p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">Channel Settings</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Channel Name</label>
                <input
                  type="text"
                  defaultValue={channel.name}
                  className="w-full px-3 py-1.5 bg-black/40 border border-white/[0.06] rounded-md text-foreground text-sm focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Discord Invite Link</label>
                <input
                  type="text"
                  defaultValue={channel.discordUrl}
                  className="w-full px-3 py-1.5 bg-black/40 border border-white/[0.06] rounded-md text-foreground text-sm focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>
            <Button variant="hero" size="sm" className="mt-3 h-8 text-sm">
              Save Changes
            </Button>
          </div>
        )}

        {/* Main Content Sections */}
        <div className="space-y-4">
          {/* Performance Overview */}
          <PerformanceOverview {...performanceData} />

          {/* Style and Risk Profile */}
          <StyleRiskProfile {...styleData} />

          {/* Channel Analytics & Access */}
          <ChannelAnalyticsAccess
            {...analyticsData}
            onBuyClick={() => setIsBuyModalOpen(true)}
            disabled={channel.status === "closed"}
          />
        </div>
      </div>

      <BuyModal
        channel={channel}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </Layout>
  );
}
