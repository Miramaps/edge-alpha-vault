import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Application submitted! We'll review and get back to you within 48 hours.");
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none opacity-50" />

      <div className="container relative mx-auto px-4 py-20 md:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Become a Trader
          </h1>
          <p className="text-muted-foreground">
            Apply to launch your own alpha channel and start earning
          </p>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-xl bg-gradient-to-br from-zinc-900/90 to-black/80 border border-accent/20">
            
            {/* Channel Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground border-b border-border/30 pb-2">
                Channel Info
              </h2>
              
              <div>
                <Label htmlFor="channelName">Channel Name *</Label>
                <Input
                  id="channelName"
                  name="channelName"
                  placeholder="e.g. Alpha Signals"
                  value={formData.channelName}
                  onChange={handleChange}
                  required
                  className="mt-1.5 bg-black/40 border-border/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nftSupply">NFT Supply *</Label>
                  <Input
                    id="nftSupply"
                    name="nftSupply"
                    type="number"
                    placeholder="e.g. 100"
                    value={formData.nftSupply}
                    onChange={handleChange}
                    required
                    className="mt-1.5 bg-black/40 border-border/30"
                  />
                </div>
                <div>
                  <Label htmlFor="floorPrice">Floor Price (SOL) *</Label>
                  <Input
                    id="floorPrice"
                    name="floorPrice"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.5"
                    value={formData.floorPrice}
                    onChange={handleChange}
                    required
                    className="mt-1.5 bg-black/40 border-border/30"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground border-b border-border/30 pb-2">
                Social Links
              </h2>
              
              <div>
                <Label htmlFor="twitterHandle">X (Twitter) *</Label>
                <Input
                  id="twitterHandle"
                  name="twitterHandle"
                  placeholder="@yourhandle"
                  value={formData.twitterHandle}
                  onChange={handleChange}
                  required
                  className="mt-1.5 bg-black/40 border-border/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discordHandle">Discord</Label>
                  <Input
                    id="discordHandle"
                    name="discordHandle"
                    placeholder="username#1234"
                    value={formData.discordHandle}
                    onChange={handleChange}
                    className="mt-1.5 bg-black/40 border-border/30"
                  />
                </div>
                <div>
                  <Label htmlFor="telegramHandle">Telegram</Label>
                  <Input
                    id="telegramHandle"
                    name="telegramHandle"
                    placeholder="@username"
                    value={formData.telegramHandle}
                    onChange={handleChange}
                    className="mt-1.5 bg-black/40 border-border/30"
                  />
                </div>
              </div>
            </div>

            {/* Trading Background */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground border-b border-border/30 pb-2">
                Trading Background
              </h2>
              
              <div>
                <Label htmlFor="markets">Markets You Trade *</Label>
                <Input
                  id="markets"
                  name="markets"
                  placeholder="e.g. Crypto, Politics, Sports"
                  value={formData.markets}
                  onChange={handleChange}
                  required
                  className="mt-1.5 bg-black/40 border-border/30"
                />
              </div>

              <div>
                <Label htmlFor="tradingExperience">Tell us about your trading experience</Label>
                <Textarea
                  id="tradingExperience"
                  name="tradingExperience"
                  placeholder="Your track record, win rate, notable calls..."
                  value={formData.tradingExperience}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1.5 bg-black/40 border-border/30 resize-none"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
            
            <p className="text-center text-muted-foreground text-xs">
              Applications reviewed within 48 hours
            </p>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
