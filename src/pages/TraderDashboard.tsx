import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      {/* Background - fixed to cover entire viewport */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial" />
        
        {/* Grainy noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.7' numOctaves='1' seed='15' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-12 md:py-16 max-w-5xl">
        {/* Owner mode toggle (for demo) */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOwnerMode(!isOwnerMode)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isOwnerMode ? "Viewer Mode" : "Owner Mode"}
          </Button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-black/40 backdrop-blur-sm border border-white/[0.08] p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Trader Info */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold text-2xl flex-shrink-0">
                {channel.trader.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {channel.trader.name}
                </h1>
                <p className="text-muted-foreground mb-3">@{channel.trader.handle}</p>
                <div className="flex flex-wrap gap-2">
                  {channel.trader.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2.5 py-1 text-xs rounded-md bg-accent/15 text-accent border border-accent/25"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="hero"
                size="lg"
                onClick={() => setIsBuyModalOpen(true)}
                disabled={channel.status === "closed"}
              >
                Buy Access NFT
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                asChild
              >
                <a href={channel.discordUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Discord
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Owner Mode Settings */}
        {isOwnerMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-black/40 backdrop-blur-sm border border-white/[0.08] p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Channel Settings</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Channel Name</label>
                <input
                  type="text"
                  defaultValue={channel.name}
                  className="w-full px-3 py-2 bg-black/40 border border-accent/20 rounded-md text-foreground text-sm focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Discord Invite Link</label>
                <input
                  type="text"
                  defaultValue={channel.discordUrl}
                  className="w-full px-3 py-2 bg-black/40 border border-accent/20 rounded-md text-foreground text-sm focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>
            <Button variant="hero" className="mt-4">
              Save Changes
            </Button>
          </motion.div>
        )}

        {/* Main Content Sections */}
        <div className="space-y-6">
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
