import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Grid3X3, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChannelCard } from "./ChannelCard";
import { ChannelListItem } from "./ChannelListItem";
import { channels } from "@/data/mockData";

type ViewMode = "grid" | "list";
type FilterType = "all" | "new" | "trending" | "high-volume";
type SortType = "volume" | "floor" | "members" | "pnl";

export function ChannelsShowcase() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("volume");

  const filteredAndSortedChannels = useMemo(() => {
    let result = [...channels];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.trader.name.toLowerCase().includes(query) ||
          c.trader.handle.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query)
      );
    }

    // Filter by type
    switch (filter) {
      case "new":
        result = result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "trending":
        result = result.filter((c) => c.priceChange24h > 5);
        break;
      case "high-volume":
        result = result.filter((c) => c.volume24h > 2000);
        break;
    }

    // Sort
    switch (sort) {
      case "volume":
        result.sort((a, b) => b.volume24h - a.volume24h);
        break;
      case "floor":
        result.sort((a, b) => b.floorPrice - a.floorPrice);
        break;
      case "members":
        result.sort((a, b) => b.minted - a.minted);
        break;
      case "pnl":
        result.sort((a, b) => b.trader.stats.lifetimePnl - a.trader.stats.lifetimePnl);
        break;
    }

    return result;
  }, [searchQuery, filter, sort]);

  return (
    <section id="channels" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Live Alpha Channels
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Buy access NFTs to join elite prediction traders' Discord rooms.
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="pro-card p-4 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by trader, handle, or channel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/50 border-border/50"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Filter */}
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <SelectTrigger className="w-[130px] bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="high-volume">High Volume</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
                <SelectTrigger className="w-[150px] bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">24h Volume</SelectItem>
                  <SelectItem value="floor">Floor Price</SelectItem>
                  <SelectItem value="members">Members</SelectItem>
                  <SelectItem value="pnl">PnL</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-md border border-border/50">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("grid")}
                  className="h-7 w-7"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("list")}
                  className="h-7 w-7"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Channels Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredAndSortedChannels.map((channel, index) => (
              <ChannelCard key={channel.id} channel={channel} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredAndSortedChannels.map((channel) => (
              <ChannelListItem key={channel.id} channel={channel} />
            ))}
          </div>
        )}

        {filteredAndSortedChannels.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No channels found matching your criteria.
          </div>
        )}
      </div>
    </section>
  );
}
