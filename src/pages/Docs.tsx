import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Coins, 
  Users, 
  Zap, 
  TrendingDown, 
  Lock, 
  ArrowRight,
  CheckCircle2,
  Wallet,
  MessageCircle,
  BarChart3,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

type DocSection = {
  id: string;
  title: string;
  icon: typeof BookOpen;
};

const sections: DocSection[] = [
  { id: "overview", title: "Platform Overview", icon: BookOpen },
  { id: "how-it-works", title: "How It Works", icon: Zap },
  { id: "token-system", title: "Deflationary Token System", icon: TrendingDown },
  { id: "subscriptions", title: "Channel Subscriptions", icon: Lock },
  { id: "token-distribution", title: "Token Distribution", icon: Coins },
  { id: "getting-started", title: "Getting Started", icon: ArrowRight },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview");

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

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Documentation
                </h2>
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2.5 text-sm",
                            activeSection === section.id
                              ? "bg-accent/20 text-accent border border-accent/30"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {section.title}
                        </button>
                      );
                    })}
                  </nav>
                </ScrollArea>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 md:p-8 lg:p-12 backdrop-blur-md">
              <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                {activeSection === "overview" && <OverviewSection />}
                {activeSection === "how-it-works" && <HowItWorksSection />}
                {activeSection === "token-system" && <TokenSystemSection />}
                {activeSection === "subscriptions" && <SubscriptionsSection />}
                {activeSection === "token-distribution" && <TokenDistributionSection />}
                {activeSection === "getting-started" && <GettingStartedSection />}
              </ScrollArea>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Platform Overview</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Edge is a token-gated prediction market trading platform that connects top traders with subscribers 
          through exclusive Discord channels. Access is controlled by EDGE tokens, creating a deflationary 
          economy that rewards both traders and token holders.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <Users className="w-8 h-8 text-accent mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">For Traders</h3>
          <p className="text-muted-foreground">
            Monetize your trading insights by creating exclusive channels. Set your subscription price 
            and earn EDGE tokens directly from subscribers.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <Lock className="w-8 h-8 text-accent mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">For Subscribers</h3>
          <p className="text-muted-foreground">
            Access exclusive alpha from verified traders. Subscribe with EDGE tokens to join private 
            Discord channels with real-time insights.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <TrendingDown className="w-8 h-8 text-accent mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Deflationary Model</h3>
          <p className="text-muted-foreground">
            Every subscription burns tokens, reducing supply and increasing value for all token holders. 
            The more the platform grows, the scarcer tokens become.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <MessageCircle className="w-8 h-8 text-accent mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Discord Integration</h3>
          <p className="text-muted-foreground">
            Automatic role assignment and channel access based on active subscriptions. Seamless 
            integration with your existing Discord server.
          </p>
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">How It Works</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Edge operates on a simple but powerful model: traders create channels, subscribers pay with 
          EDGE tokens, and a portion of tokens are permanently burned, creating deflationary pressure.
        </p>
      </div>

      <div className="space-y-6 mt-8">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            1
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Trader Application</h3>
            <p className="text-muted-foreground mb-3">
              Traders submit applications with their channel details, trading specialties, and Polymarket 
              wallet address for verification.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Channel name and description</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Maximum member capacity</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Markets you trade (Sports, Crypto, Politics, etc.)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            2
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Admin Approval</h3>
            <p className="text-muted-foreground mb-3">
              Our team reviews applications and approves qualified traders. Once approved, a Discord 
              channel and role are automatically created.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            3
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Dynamic Pricing</h3>
            <p className="text-muted-foreground mb-3">
              Channel subscription prices are dynamic and adjust based on demand and the deflationary 
              token model. Prices move with market conditions.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            4
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Token Subscription</h3>
            <p className="text-muted-foreground mb-3">
              Subscribers connect their Solana wallet and pay the subscription fee in EDGE tokens. 
              The transaction is processed on-chain for transparency.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            5
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Automatic Access</h3>
            <p className="text-muted-foreground mb-3">
              Upon successful payment, subscribers automatically receive Discord role access to the 
              trader's private channel. Access is revoked when subscription expires or is cancelled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenSystemSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Deflationary Token System</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          EDGE uses a deflationary token model where tokens are permanently burned with every subscription, 
          creating scarcity and increasing value over time.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 mt-8">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Why Deflationary?</h3>
            <p className="text-muted-foreground">
              As more users subscribe to channels, more tokens are burned. This reduces the total supply, 
              making each remaining token more valuable. Early adopters benefit from both access to alpha 
              and token appreciation.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-4">Token Mechanics</h3>
          
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-accent" />
                Permanent Burns
              </h4>
              <p className="text-muted-foreground">
                A percentage of every subscription payment is permanently burned, removing tokens from 
                circulation forever. This creates continuous deflationary pressure.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                Dynamic Pricing
              </h4>
              <p className="text-muted-foreground">
                Subscription prices adjust based on token scarcity and demand. As tokens become scarcer, 
                prices may increase, but so does the value of tokens you hold.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent" />
                Supply Reduction
              </h4>
              <p className="text-muted-foreground">
                With every subscription, the total supply decreases. Over time, this creates a positive 
                feedback loop: more users → more burns → scarcer tokens → higher value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Channel Subscriptions</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Join trader channels by sending EDGE tokens directly to the trader. After payment, provide your 
          Discord information to gain access to exclusive channels with real-time trading insights and alpha.
        </p>
      </div>

      <div className="space-y-6 mt-8">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-4">How to Join a Channel</h3>
          
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">1. Find the Channel</h4>
                  <p className="text-muted-foreground">
                    Browse available trader channels on the Channels page. View their performance metrics, 
                    trading specialties, and the current subscription price in EDGE tokens. Select the 
                    channel you want to join.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <Coins className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">2. Send EDGE Tokens</h4>
                  <p className="text-muted-foreground">
                    Send the required amount of EDGE tokens to Edge's application wallet. The payment 
                    is processed on-chain for full transparency. Edge automatically handles the distribution: 
                    70% to the trader, 20% burned, and 10% to platform operations. You'll receive a 
                    confirmation once the transaction is complete.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">3. Provide Discord Information</h4>
                  <p className="text-muted-foreground">
                    After your payment is confirmed, you'll be prompted to enter your Discord username. 
                    This information is used to automatically assign you the appropriate role and grant 
                    access to the trader's private Discord channel.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">4. Access Granted</h4>
                  <p className="text-muted-foreground">
                    Once your Discord information is submitted and verified, you'll automatically be added 
                    to the subscribed Discord channel. You'll gain immediate access to exclusive trading 
                    insights and alpha from the trader.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Automatic Distribution:</strong> Send EDGE tokens to Edge's application wallet. The platform automatically distributes tokens (70% trader, 20% burned, 10% platform) and handles all processing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">One-Time Access:</strong> Pay once to join a channel. Access is granted immediately after payment and Discord verification.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Multiple Channels:</strong> Join multiple trader channels by sending tokens to each trader. Each channel access is independent.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Transparent Pricing:</strong> All prices are displayed in EDGE tokens. No hidden fees or recurring charges.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TokenDistributionSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Token Distribution</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          When you subscribe to a channel, your EDGE tokens are distributed between the trader, token burns, 
          and platform operations. Here's exactly how it works.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 mt-8">
        <h3 className="text-2xl font-semibold text-white mb-6">Example: 100 EDGE Token Subscription</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-white font-medium">Trader Revenue</span>
            </div>
            <span className="text-2xl font-bold text-accent">70 EDGE</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-white font-medium">Burned (Deflationary)</span>
            </div>
            <span className="text-2xl font-bold text-red-400">20 EDGE</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-white font-medium">Platform Operations</span>
            </div>
            <span className="text-2xl font-bold text-blue-400">10 EDGE</span>
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            Trader Revenue (70%)
          </h4>
          <p className="text-muted-foreground">
            The majority of subscription fees go directly to the trader. This incentivizes high-quality 
            content and attracts the best traders to the platform. Traders receive their earnings in EDGE 
            tokens, which they can hold for appreciation or convert to other assets.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            Token Burns (20%)
          </h4>
          <p className="text-muted-foreground">
            Twenty percent of every subscription is permanently burned, removing tokens from circulation. 
            This is the core deflationary mechanism that creates scarcity and increases token value over 
            time. The more subscriptions, the more tokens are burned, creating a positive feedback loop.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Platform Operations (10%)
          </h4>
          <p className="text-muted-foreground">
            A small portion goes to platform operations, including infrastructure, development, marketing, 
            and team compensation. This ensures the platform can continue to grow and improve while 
            maintaining sustainable operations.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white/5 border border-white/10 mt-8">
        <h3 className="text-xl font-semibold text-white mb-3">Why This Distribution?</h3>
        <p className="text-muted-foreground mb-4">
          This distribution model balances multiple goals:
        </p>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <span><strong className="text-white">Traders are well-compensated</strong> (70%), attracting top talent and ensuring quality content</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <span><strong className="text-white">Significant deflationary pressure</strong> (20% burns) creates long-term token value appreciation</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <span><strong className="text-white">Platform sustainability</strong> (10%) ensures continued development and growth</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Getting Started</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Ready to join Edge? Follow these simple steps to start accessing exclusive trader channels or 
          begin monetizing your trading insights.
        </p>
      </div>

      <div className="space-y-6 mt-8">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-6">For Subscribers</h3>
          
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Get EDGE Tokens</h4>
                  <p className="text-muted-foreground">
                    Purchase EDGE tokens from a DEX or exchange. You'll need tokens in your Solana wallet 
                    to subscribe to channels.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h4>
                  <p className="text-muted-foreground">
                    Click "Connect Wallet" and approve the connection with your Solana wallet (Phantom, 
                    Solflare, etc.). Your wallet address will be used for payments and Discord verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Browse Channels</h4>
                  <p className="text-muted-foreground">
                    Explore available trader channels on the Channels page. View performance metrics, 
                    trading specialties, and subscription prices.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Subscribe & Access</h4>
                  <p className="text-muted-foreground">
                    Click "Subscribe" on any channel, approve the transaction, and you'll automatically 
                    receive Discord access. Verify your wallet on Discord to get your role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-white mb-6">For Traders</h3>
          
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Submit Application</h4>
                  <p className="text-muted-foreground">
                    Go to "Join Edge" and fill out the trader application form. Include your channel details, 
                    trading specialties, and Polymarket wallet address for verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Wait for Approval</h4>
                  <p className="text-muted-foreground">
                    Our team reviews your application. This typically takes 24-48 hours. You'll be notified 
                    once your application is approved or if we need additional information.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Channel Created</h4>
                  <p className="text-muted-foreground">
                    Once approved, your Discord channel and role are automatically created. You'll receive 
                    admin access to your channel and can start sharing insights immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Earn Tokens</h4>
                  <p className="text-muted-foreground">
                    As subscribers join your channel, you'll receive 70% of subscription fees in EDGE tokens. 
                    Track your earnings and subscriber count in your trader dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

