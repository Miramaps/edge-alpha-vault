import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Coins, MessageCircle, Send, Sparkles } from "lucide-react";

export default function BecomeTrader() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    channelName: "",
    twitterHandle: "",
    discordHandle: "",
    telegramHandle: "",
    nftSupply: "",
    floorPrice: "",
    tradingExperience: "",
    markets: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Application submitted! We'll review and get back to you within 48 hours.");
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Become a<br />
              <span className="text-accent">Trader</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-10 max-w-md">
              Share your alpha, build a community, and earn SOL through NFT-gated access to your exclusive channel.
            </p>

            {/* Stats/Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Set Your Price</p>
                  <p className="text-muted-foreground text-sm">You decide the floor price in SOL</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Control Access</p>
                  <p className="text-muted-foreground text-sm">Limit members with NFT supply</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Discord Integration</p>
                  <p className="text-muted-foreground text-sm">Auto-gated access to your server</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form 
              onSubmit={handleSubmit} 
              className="p-6 md:p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/[0.08] shadow-2xl"
            >
              {/* Channel Info */}
              <div className="mb-8">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-5">
                  Channel Details
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="channelName" className="text-foreground">Channel Name</Label>
                    <Input
                      id="channelName"
                      name="channelName"
                      placeholder="Alpha Signals"
                      value={formData.channelName}
                      onChange={handleChange}
                      required
                      className="mt-2 h-12 bg-white/[0.03] border-white/[0.08] focus:border-accent/50 placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nftSupply" className="text-foreground">Max Members</Label>
                      <Input
                        id="nftSupply"
                        name="nftSupply"
                        type="number"
                        placeholder="100"
                        value={formData.nftSupply}
                        onChange={handleChange}
                        required
                        className="mt-2 h-12 bg-white/[0.03] border-white/[0.08] focus:border-accent/50 placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="floorPrice" className="text-foreground">Floor Price</Label>
                      <div className="relative mt-2">
                        <Input
                          id="floorPrice"
                          name="floorPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.5"
                          value={formData.floorPrice}
                          onChange={handleChange}
                          required
                          className="h-12 bg-white/[0.03] border-white/[0.08] focus:border-accent/50 pr-14 placeholder:text-muted-foreground/50"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          SOL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8" />

              {/* Social Links */}
              <div className="mb-8">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-5">
                  Social Links
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="twitterHandle" className="text-foreground">X (Twitter)</Label>
                    <Input
                      id="twitterHandle"
                      name="twitterHandle"
                      placeholder="@yourhandle"
                      value={formData.twitterHandle}
                      onChange={handleChange}
                      required
                      className="mt-2 h-12 bg-white/[0.03] border-white/[0.08] focus:border-accent/50 placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discordHandle" className="text-foreground text-sm">Discord</Label>
                      <Input
                        id="discordHandle"
                        name="discordHandle"
                        placeholder="username"
                        value={formData.discordHandle}
                        onChange={handleChange}
                        className="mt-2 h-12 bg-white/[0.03] border-white/[0.08] focus:border-accent/50 placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telegramHandle" className="text-foreground text-sm">Telegram</Label>
                      <Input
                        id="telegramHandle"
                        name="telegramHandle"
                        placeholder="@username"
                        value={formData.telegramHandle}
                        onChange={handleChange}
                        className="mt-2 h-12 bg-white/[0.03] border-white/[0.08] focus:border-accent/50 placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8" />

              {/* Trading Background */}
              <div className="mb-8">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-5">
                  Trading Background
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="markets" className="text-foreground">Markets You Trade</Label>
                    <Input
                      id="markets"
                      name="markets"
                      placeholder="Crypto, Politics, Sports"
                      value={formData.markets}
                      onChange={handleChange}
                      required
                      className="mt-2 h-12 bg-white/[0.03] border-white/[0.08] focus:border-accent/50 placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tradingExperience" className="text-foreground">Experience & Track Record</Label>
                    <Textarea
                      id="tradingExperience"
                      name="tradingExperience"
                      placeholder="Tell us about your trading history, win rate, notable calls..."
                      value={formData.tradingExperience}
                      onChange={handleChange}
                      rows={4}
                      className="mt-2 bg-white/[0.03] border-white/[0.08] focus:border-accent/50 resize-none placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full h-12 text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Application
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              
              <p className="text-center text-muted-foreground/60 text-xs mt-4">
                Applications are reviewed within 48 hours
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
