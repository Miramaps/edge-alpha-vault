export interface Trader {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  tags: string[];
  stats: {
    lifetimePnl: number;
    winRate: number;
    marketsTraded: number;
  };
}

export interface Channel {
  id: string;
  trader: Trader;
  name: string;
  description: string;
  discordUrl: string;
  maxSupply: number;
  minted: number;
  floorPrice: number;
  volume24h: number;
  priceChange24h: number;
  status: 'open' | 'almost-full' | 'closed';
  createdAt: string;
}

export interface Transaction {
  id: string;
  channelId: string;
  buyer: string;
  seller: string;
  price: number;
  timestamp: string;
}

export interface Member {
  id: string;
  channelId: string;
  wallet: string;
  username?: string;
  joinedAt: string;
}

export const traders: Trader[] = [
  {
    id: '1',
    name: 'Dom PNL',
    handle: 'dom_alpha',
    tags: ['Politics', 'Macro'],
    stats: { lifetimePnl: 142.5, winRate: 64, marketsTraded: 234 }
  },
  {
    id: '2',
    name: 'Macro Signals',
    handle: 'macro_whale',
    tags: ['Macro', 'Crypto'],
    stats: { lifetimePnl: 89.2, winRate: 58, marketsTraded: 187 }
  },
  {
    id: '3',
    name: 'Sports Edge',
    handle: 'sports_alpha',
    tags: ['Sports', 'NBA'],
    stats: { lifetimePnl: 156.8, winRate: 71, marketsTraded: 312 }
  },
  {
    id: '4',
    name: 'Election Pro',
    handle: 'election_calls',
    tags: ['Politics', 'Elections'],
    stats: { lifetimePnl: 203.4, winRate: 67, marketsTraded: 156 }
  },
  {
    id: '5',
    name: 'Crypto Oracle',
    handle: 'crypto_oracle',
    tags: ['Crypto', 'DeFi'],
    stats: { lifetimePnl: 178.9, winRate: 62, marketsTraded: 423 }
  },
  {
    id: '6',
    name: 'Finance Insider',
    handle: 'finance_insider',
    tags: ['Finance', 'Stocks'],
    stats: { lifetimePnl: 95.3, winRate: 55, marketsTraded: 198 }
  },
  {
    id: '7',
    name: 'Tech Analyst',
    handle: 'tech_alpha',
    tags: ['Tech', 'AI'],
    stats: { lifetimePnl: 124.7, winRate: 59, marketsTraded: 267 }
  },
  {
    id: '8',
    name: 'Weather Wizard',
    handle: 'weather_wiz',
    tags: ['Weather', 'Events'],
    stats: { lifetimePnl: 67.8, winRate: 52, marketsTraded: 89 }
  },
  {
    id: '9',
    name: 'NFT Hunter',
    handle: 'nft_hunter',
    tags: ['NFTs', 'Web3'],
    stats: { lifetimePnl: 112.4, winRate: 61, marketsTraded: 145 }
  },
];

export const channels: Channel[] = traders.map((trader, index) => ({
  id: `ch-${trader.id}`,
  trader,
  name: `${trader.name} Alpha`,
  description: `Exclusive prediction market insights from ${trader.name}. Join the alpha channel for real-time calls and analysis.`,
  discordUrl: 'https://discord.gg/edge',
  maxSupply: [100, 150, 200, 75, 250, 100, 125, 50, 180][index],
  minted: [87, 142, 156, 75, 198, 67, 98, 23, 134][index],
  floorPrice: [12.4, 8.7, 15.2, 22.8, 6.3, 9.1, 11.5, 18.9, 7.8][index],
  volume24h: [3200, 1800, 4500, 890, 5600, 1200, 2100, 450, 2800][index],
  priceChange24h: [5.2, -2.1, 8.7, 0, 12.3, -4.5, 3.2, 15.8, 6.9][index],
  status: [87, 142, 156, 75, 198, 67, 98, 23, 134][index] >= [100, 150, 200, 75, 250, 100, 125, 50, 180][index] * 0.95 
    ? 'almost-full' 
    : [87, 142, 156, 75, 198, 67, 98, 23, 134][index] >= [100, 150, 200, 75, 250, 100, 125, 50, 180][index] 
      ? 'closed'
      : 'open',
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const transactions: Transaction[] = [
  { id: 't1', channelId: 'ch-1', buyer: '0x1234...abcd', seller: '0x5678...efgh', price: 12.8, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 't2', channelId: 'ch-1', buyer: '0x9abc...ijkl', seller: '0xdef0...mnop', price: 12.4, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 't3', channelId: 'ch-1', buyer: '0x2345...qrst', seller: '0x6789...uvwx', price: 12.1, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 't4', channelId: 'ch-1', buyer: '0x3456...yzab', seller: '0x7890...cdef', price: 11.9, timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

export const members: Member[] = [
  { id: 'm1', channelId: 'ch-1', wallet: '0x1234...abcd', username: 'trader_joe', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: 'm2', channelId: 'ch-1', wallet: '0x9abc...ijkl', username: 'alpha_seeker', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString() },
  { id: 'm3', channelId: 'ch-1', wallet: '0x2345...qrst', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString() },
  { id: 'm4', channelId: 'ch-1', wallet: '0x3456...yzab', username: 'whale_watcher', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
];

// Generate random trend data for sparklines
const generateTrendData = (isPositive: boolean): number[] => {
  const points = 7;
  const data: number[] = [];
  let value = 50 + Math.random() * 20;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - (isPositive ? 0.3 : 0.7)) * 15;
    value = Math.max(10, Math.min(100, value + change));
    data.push(value);
  }
  
  // Ensure end matches trend direction
  if (isPositive && data[data.length - 1] < data[0]) {
    data[data.length - 1] = data[0] + Math.random() * 20;
  } else if (!isPositive && data[data.length - 1] > data[0]) {
    data[data.length - 1] = data[0] - Math.random() * 20;
  }
  
  return data;
};

export const leaderboardData = traders
  .map((trader, index) => {
    const channel = channels.find(c => c.trader.id === trader.id);
    const priceChange = channel?.priceChange24h || 0;
    return {
      ...trader,
      rank: index + 1,
      members: channel?.minted || 0,
      floorPrice: channel?.floorPrice || 0,
      volume24h: channel?.volume24h || 0,
      priceChange24h: priceChange,
      trendData: generateTrendData(priceChange >= 0),
    };
  })
  .sort((a, b) => b.stats.lifetimePnl - a.stats.lifetimePnl)
  .map((trader, index) => ({ ...trader, rank: index + 1 }));

export const topGainers = channels
  .filter(c => c.priceChange24h > 0)
  .sort((a, b) => b.priceChange24h - a.priceChange24h)
  .slice(0, 5);

export const newChannels = channels
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);

export const mostActive = channels
  .sort((a, b) => b.volume24h - a.volume24h)
  .slice(0, 5);
