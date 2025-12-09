import { useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Coins, MessageCircle, Send, Upload, X, Image } from "lucide-react";

export default function BecomeTrader() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload an image file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
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
      {/* Red gradient background - fixed to cover entire viewport */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial" />
        
        {/* Subtle crimson glows */}
        <div 
          className="absolute -top-20 right-0 w-[700px] h-[500px] rounded-full blur-[200px] opacity-70"
          style={{ background: 'hsl(0 65% 45% / 0.25)' }}
        />
        <div 
          className="absolute -top-10 -left-20 w-[400px] h-[350px] rounded-full blur-[150px] opacity-50"
          style={{ background: 'hsl(5 60% 42% / 0.2)' }}
        />
        
        {/* Grainy noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.7' numOctaves='1' seed='15' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-12 md:py-16 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Become a <span className="text-accent">Trader</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Share your alpha, build a community, and earn through NFT-gated access to your exclusive channel.
          </p>
        </motion.div>

        {/* Single Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form 
            onSubmit={handleSubmit} 
            className="p-6 md:p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/[0.08]"
          >
            {/* Profile Picture Upload */}
            <div className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-5">
                NFT Profile Picture
              </h2>
              
              <div 
                className={`relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                  isDragging 
                    ? 'border-accent bg-accent/10' 
                    : profileImage 
                      ? 'border-white/[0.08] bg-white/[0.02]' 
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !profileImage && document.getElementById('profile-upload')?.click()}
              >
                {profileImage ? (
                  <div className="relative">
                    <img 
                      src={profileImage} 
                      alt="Profile preview" 
                      className="w-32 h-32 rounded-full object-cover border-2 border-white/[0.1]"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-4">
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-1">
                      Drag & drop your image here
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      or click to browse
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                      <Upload className="w-3 h-3" />
                      <span>PNG, JPG up to 5MB</span>
                    </div>
                  </>
                )}
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8" />

            {/* Channel Details */}
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
                    className="mt-2 h-12 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
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
                      className="mt-2 h-12 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
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
                        className="h-12 bg-black/30 border-white/[0.06] focus:border-accent/50 pr-14 placeholder:text-muted-foreground/50"
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
                    className="mt-2 h-12 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
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
                      className="mt-2 h-12 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
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
                      className="mt-2 h-12 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
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
                    className="mt-2 h-12 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
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
                    className="mt-2 bg-black/30 border-white/[0.06] focus:border-accent/50 resize-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <Coins className="w-5 h-5 text-accent mb-2" />
                <p className="text-foreground text-sm font-medium">Set Price</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <Users className="w-5 h-5 text-accent mb-2" />
                <p className="text-foreground text-sm font-medium">Control Access</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <MessageCircle className="w-5 h-5 text-accent mb-2" />
                <p className="text-foreground text-sm font-medium">Discord Gated</p>
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
    </Layout>
  );
}
