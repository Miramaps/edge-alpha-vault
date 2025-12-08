import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Users, TrendingUp, Target, BarChart3, Settings, Eye } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BuyModal } from "@/components/modals/BuyModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { channels, transactions, members } from "@/data/mockData";
import { cn } from "@/lib/utils";

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

  const supplyPercentage = (channel.minted / channel.maxSupply) * 100;

  const statCards = [
    {
      label: "Lifetime PnL",
      value: `+${channel.trader.stats.lifetimePnl}%`,
      icon: TrendingUp,
      positive: true,
    },
    {
      label: "Win Rate",
      value: `${channel.trader.stats.winRate}%`,
      icon: Target,
      positive: channel.trader.stats.winRate >= 55,
    },
    {
      label: "Markets Traded",
      value: channel.trader.stats.marketsTraded.toString(),
      icon: BarChart3,
    },
    {
      label: "Active Members",
      value: channel.minted.toString(),
      icon: Users,
    },
  ];

  return (
    <Layout>
      {/* Hero gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-glow-blue/10 rounded-full blur-[120px]" />

      <div className="container relative mx-auto px-4 py-12 md:py-16">
        {/* Owner mode toggle (for demo) */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOwnerMode(!isOwnerMode)}
            className="text-muted-foreground"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isOwnerMode ? "Viewer Mode" : "Owner Mode"}
          </Button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8 mb-8"
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
                    <span key={tag} className="tag">
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
              <Button variant="outline" size="lg" asChild>
                <a href={channel.discordUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Discord
                </a>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass-card bg-secondary/30 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="stat-label">{stat.label}</span>
                </div>
                <p className={cn(
                  "text-xl md:text-2xl font-bold",
                  stat.positive === true && "text-emerald-400",
                  stat.positive === false && "text-red-400",
                  stat.positive === undefined && "text-foreground"
                )}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Channel Settings (Owner Mode) */}
            {isOwnerMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">Channel Settings</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Channel Name</label>
                    <input
                      type="text"
                      defaultValue={channel.name}
                      className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                    <textarea
                      defaultValue={channel.description}
                      rows={3}
                      className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-foreground text-sm resize-none"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Discord Invite Link</label>
                      <input
                        type="text"
                        defaultValue={channel.discordUrl}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Pricing Model</label>
                      <select className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-foreground text-sm">
                        <option>Bonding Curve</option>
                        <option>Flat Price</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Max Supply</label>
                      <input
                        type="number"
                        defaultValue={channel.maxSupply}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Base Price (EDGE)</label>
                      <input
                        type="number"
                        defaultValue={channel.floorPrice}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-foreground text-sm"
                      />
                    </div>
                  </div>
                  <Button className="w-full sm:w-auto">Save Changes</Button>
                </div>
              </motion.div>
            )}

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-4 border-b border-border/50">
                <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Buyer</TableHead>
                    <TableHead className="text-muted-foreground">Seller</TableHead>
                    <TableHead className="text-muted-foreground text-right">Price</TableHead>
                    <TableHead className="text-muted-foreground text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="border-border/30">
                      <TableCell className="font-mono text-sm">{tx.buyer}</TableCell>
                      <TableCell className="font-mono text-sm">{tx.seller}</TableCell>
                      <TableCell className="text-right font-medium">{tx.price} EDGE</TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>

            {/* Members */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-4 border-b border-border/50">
                <h2 className="text-lg font-semibold text-foreground">Members</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Wallet</TableHead>
                    <TableHead className="text-muted-foreground">Username</TableHead>
                    <TableHead className="text-muted-foreground text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="border-border/30">
                      <TableCell className="font-mono text-sm">{member.wallet}</TableCell>
                      <TableCell className="text-sm">
                        {member.username || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Channel NFT Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Channel NFT</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Max Supply</span>
                  <span className="text-foreground font-medium">{channel.maxSupply}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Minted</span>
                  <span className="text-foreground font-medium">{channel.minted}</span>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Supply Usage</span>
                    <span className="text-foreground text-sm">{supplyPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={supplyPercentage} className="h-2" />
                </div>
                <div className="border-t border-border/50 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Floor Price</span>
                    <span className="text-foreground font-bold text-lg">{channel.floorPrice} EDGE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">24h Volume</span>
                    <span className="text-foreground font-medium">{(channel.volume24h / 1000).toFixed(1)}k EDGE</span>
                  </div>
                </div>
              </div>

              <Button
                variant="hero"
                className="w-full mt-6"
                onClick={() => setIsBuyModalOpen(true)}
                disabled={channel.status === "closed"}
              >
                Buy Access NFT
              </Button>
            </motion.div>

            {/* Token Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">EDGE Token</h2>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">$0.84</span>
                <span className="text-emerald-400 text-sm mb-1">+2.4%</span>
              </div>
              <p className="text-muted-foreground text-xs mt-2">Platform token price (stubbed)</p>
            </motion.div>
          </div>
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
