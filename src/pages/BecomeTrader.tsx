import { useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Coins, MessageCircle, Send, X, Image, Upload } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BecomeTrader() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    channelName: "",
    twitterHandle: "",
    discordHandle: "",
    maxMembers: "",
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
      {/* Background image */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <img 
          src="/bg.jpg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container relative mx-auto px-4 py-6 md:py-12 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full max-w-6xl mx-auto pt-12 md:pt-0">
          
          {/* Left Side - Info */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3 leading-tight">
              Join <span className="text-accent">Edge</span>
            </h1>
            
            <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8 max-w-md">
              Share your alpha, build a community, and earn EDGE tokens through token-gated access to your exclusive channel.
            </p>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Your Price</p>
                  <p className="text-muted-foreground text-xs">Dynamic pricing based on deflationary token</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Control Access</p>
                  <p className="text-muted-foreground text-xs">Set max members limit</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Discord Integration</p>
                  <p className="text-muted-foreground text-xs">Auto-gated access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <form 
              onSubmit={handleSubmit} 
              className="p-5 md:p-6 rounded-2xl bg-black/40 border border-white/[0.08]"
            >
              {/* Profile Picture */}
              <div className="mb-5">
                <Label className="text-foreground text-sm mb-2 block">Profile Picture</Label>
                <div 
                  className={`relative flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                    isDragging 
                      ? 'border-accent bg-accent/10' 
                      : 'border-white/[0.08] bg-black/30 hover:border-white/[0.15]'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !profileImage && document.getElementById('profile-upload')?.click()}
                >
                  {profileImage ? (
                    <>
                      <img 
                        src={profileImage} 
                        alt="Profile preview" 
                        className="w-14 h-14 rounded-full object-cover border border-white/[0.1]"
                      />
                      <div className="flex-1">
                        <p className="text-foreground text-sm font-medium">Image uploaded</p>
                        <p className="text-muted-foreground text-xs">Click to change</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-accent" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-white/[0.05] flex items-center justify-center">
                        <Image className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">Drag & drop image</p>
                        <p className="text-muted-foreground text-xs">or click to browse</p>
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
              <div className="h-px bg-white/[0.06] mb-5" />

              {/* Channel Details */}
              <div className="space-y-4 mb-5">
                <div>
                  <Label htmlFor="channelName" className="text-foreground text-sm">Channel Name</Label>
                  <Input
                    id="channelName"
                    name="channelName"
                    placeholder="Alpha Signals"
                    value={formData.channelName}
                    onChange={handleChange}
                    required
                    className="mt-1.5 h-10 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div>
                  <Label htmlFor="maxMembers" className="text-foreground text-sm">Max Members (max 1000)</Label>
                  <Input
                    id="maxMembers"
                    name="maxMembers"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="100"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    required
                    className="mt-1.5 h-10 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-5" />

              {/* Social Links */}
              <div className="space-y-4 mb-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="twitterHandle" className="text-foreground text-sm">X (Twitter)</Label>
                    <Input
                      id="twitterHandle"
                      name="twitterHandle"
                      placeholder="@yourhandle"
                      value={formData.twitterHandle}
                      onChange={handleChange}
                      required
                      className="mt-1.5 h-10 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discordHandle" className="text-foreground text-sm">Discord</Label>
                    <Input
                      id="discordHandle"
                      name="discordHandle"
                      placeholder="username"
                      value={formData.discordHandle}
                      onChange={handleChange}
                      className="mt-1.5 h-10 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="markets" className="text-foreground text-sm">Markets You Trade</Label>
                  <Input
                    id="markets"
                    name="markets"
                    placeholder="Crypto, Politics, Sports"
                    value={formData.markets}
                    onChange={handleChange}
                    required
                    className="mt-1.5 h-10 bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full h-11 text-sm font-medium"
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
              
              <p className="text-center text-muted-foreground/60 text-xs mt-3">
                We'll review your application and get back to you soon
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
