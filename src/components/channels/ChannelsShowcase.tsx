import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Channel as ChannelType } from '@/data/mockData';
import { app as firebaseApp } from '@/lib/firebase';
import { ref as dbRef, getDatabase, onValue } from 'firebase/database';
import { Grid3X3, List, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ChannelCard } from "./ChannelCard";
import { ChannelListItem } from "./ChannelListItem";

type ViewMode = "grid" | "list";
type FilterType = "all" | "new" | "trending" | "high-volume";
type SortType = "volume" | "floor" | "members" | "pnl";
const MARKET_CATEGORIES = [
  "all",
  "sports",
  "politics",
  "crypto",
  "macro",
  "finance",
  "tech",
  "weather",
  "nfts",
  "elections",
  "ai",
  "defi",
  "stocks",
  "nba",
  "web3",
  "events",
] as const;
type MarketCategory = typeof MARKET_CATEGORIES[number];
const MARKET_CATEGORY_LABELS: Record<MarketCategory, string> = {
  all: "All Categories",
  sports: "Sports",
  politics: "Politics",
  crypto: "Crypto",
  macro: "Macro",
  finance: "Finance",
  tech: "Tech",
  weather: "Weather",
  nfts: "NFTs",
  elections: "Elections",
  ai: "AI",
  defi: "DeFi",
  stocks: "Stocks",
  nba: "NBA",
  web3: "Web3",
  events: "Events",
};

export function ChannelsShowcase() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("volume");
  const [category, setCategory] = useState<MarketCategory>("all");

  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);

  // Subscribe to `channels` in Realtime Database and map to UI Channel shape
  useEffect(() => {
    try {
      const db = getDatabase(firebaseApp);
      const ref = dbRef(db, 'channels');
      const unsub = onValue(ref, (snapshot) => {
        const data = snapshot.val() || {};
        console.debug('RTDB channels snapshot:', data);
        const list: ChannelType[] = Object.entries(data).map(([key, value]) => {
          const obj: any = value as any;
          const traderName = obj.channelName || obj.id || 'Unknown';
          const traderHandle = (obj.twitterHandle || obj.twitter || obj.id || '').replace('@', '') || String(obj.id);
          const minted = Number(obj.currentMemberCount || obj.minted || 0);
          const maxSupply = Number(obj.totalAllowedCount || obj.maxSupply || 0);
          const floorPrice = Number(obj.price || obj.floorPrice || 0);
          const volume24h = Number(obj.volume24hr || obj.volume24h || 0);
          const winRate = Number(obj.winRate || (obj.trader?.stats?.winRate) || 0);

          return {
            id: String(obj.id || key),
            trader: {
              id: String(obj.id || key),
              name: traderName,
              handle: traderHandle,
              avatar: obj.profileImageUrl || obj.profileImage || undefined,
              tags: (obj.tags || (obj.markets ? String(obj.markets).split(/[,\s]+/) : [])) as string[],
              verified: false,
              stats: {
                lifetimePnl: 0,
                winRate: winRate,
                marketsTraded: 0,
                edgeScore: 0,
                avgROI: Number(obj.avgRoi || obj.avgROI || 0),
                thirtyDayReturn: Number(obj.return30d || 0),
                maxDrawdown: Number(obj.maxDrawdown || 0),
                consistency: Number(obj.consistency || 0),
                primaryMarkets: (obj.markets ? String(obj.markets).split(/[,\s]+/) : []),
              },
            },
            name: traderName + ' Alpha',
            description: obj.description || '',
            discordUrl: obj.discordUrl || obj.discordHandle || '',
            maxSupply: maxSupply,
            minted: minted,
            floorPrice: floorPrice,
            volume24h: volume24h,
            priceChange24h: 0,
            status:
              maxSupply > 0
                ? minted >= maxSupply
                  ? 'closed'
                  : minted >= Math.floor(maxSupply * 0.95)
                    ? 'almost-full'
                    : 'open'
                : 'open',
            createdAt: obj.createdAt || new Date().toISOString(),
          } as ChannelType;
        });

        // sort newest first
        list.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
        setChannels(list);
        setLoadingChannels(false);
      });

      return () => unsub();
    } catch (err) {
      console.error('Failed to subscribe to channels:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // Filter by market category (e.g., sports, politics)
    if (category !== "all") {
      const selected = category.toLowerCase();
      result = result.filter((c) =>
        c.trader.tags.some((tag) => tag.toLowerCase() === selected)
      );
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
  }, [searchQuery, filter, sort, category]);

  return (
    <section id="channels" className="py-4">
      <div>
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">
            Live Alpha Channels
          </h2>
          <p className="text-muted-foreground text-sm">
            Subscribe with EDGE tokens to join elite prediction traders' Discord rooms.
          </p>
        </div>

        {/* Toolbar */}
        <div
          className="rounded-xl bg-black/40 border border-white/[0.08] p-3 mb-4"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by trader, handle, or channel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-black/30 border-white/[0.06]"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Filter */}
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <SelectTrigger className="w-[130px] bg-black/30 border-white/[0.06]">
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
                <SelectTrigger className="w-[150px] bg-black/30 border-white/[0.06]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">24h Volume</SelectItem>
                  <SelectItem value="floor">Subscription Price</SelectItem>
                  <SelectItem value="members">Members</SelectItem>
                  <SelectItem value="pnl">PnL</SelectItem>
                </SelectContent>
              </Select>

              {/* Category */}
              <Select value={category} onValueChange={(v) => setCategory(v as MarketCategory)}>
                <SelectTrigger className="w-[170px] bg-black/30 border-white/[0.06]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {MARKET_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {MARKET_CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-black/30 rounded-md border border-white/[0.06]">
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
        </div>

        {/* Channels Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {loadingChannels ? (
          <div className="text-center py-16 text-muted-foreground">Loading channels…</div>
        ) : filteredAndSortedChannels.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No channels found matching your criteria.</div>
        ) : null}
      </div>
    </section>
  );
}
