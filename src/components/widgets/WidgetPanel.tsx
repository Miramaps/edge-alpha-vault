import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { topGainers, newChannels, mostActive, type Channel } from "@/data/mockData";
import { cn } from "@/lib/utils";

type WidgetTab = "gainers" | "new" | "active";

interface WidgetItemProps {
  channel: Channel;
  showChange?: boolean;
}

function WidgetItem({ channel, showChange }: WidgetItemProps) {
  return (
    <Link
      to={`/t/${channel.trader.handle}`}
      className="flex items-center justify-between py-2.5 px-3 hover:bg-secondary/30 rounded-md transition-colors"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold text-xs flex-shrink-0">
          {channel.trader.name.charAt(0)}
        </div>
        <span className="text-sm text-foreground truncate">{channel.trader.name}</span>
      </div>
      <div className="text-right flex-shrink-0">
        {showChange ? (
          <span className={cn(
            "text-sm font-medium",
            channel.priceChange24h > 0 ? "text-emerald-400" : "text-red-400"
          )}>
            {channel.priceChange24h > 0 ? "+" : ""}{channel.priceChange24h}%
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">
            {channel.floorPrice} EDGE
          </span>
        )}
      </div>
    </Link>
  );
}

export function WidgetPanel() {
  const [activeTab, setActiveTab] = useState<WidgetTab>("gainers");

  const tabs: { value: WidgetTab; label: string; icon: typeof TrendingUp }[] = [
    { value: "gainers", label: "Top Gainers", icon: TrendingUp },
    { value: "new", label: "New", icon: Sparkles },
    { value: "active", label: "Most Active", icon: Activity },
  ];

  const getData = () => {
    switch (activeTab) {
      case "gainers":
        return topGainers;
      case "new":
        return newChannels;
      case "active":
        return mostActive;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card overflow-hidden"
    >
      {/* Tabs */}
      <div className="flex border-b border-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "text-foreground bg-secondary/30 border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-2">
        {getData().map((channel) => (
          <WidgetItem
            key={channel.id}
            channel={channel}
            showChange={activeTab === "gainers"}
          />
        ))}
      </div>
    </motion.div>
  );
}
