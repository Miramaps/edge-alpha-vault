import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Coins, MessageCircle, CheckCircle2, Wallet, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Channel } from "@/data/mockData";

interface SubscriptionModalProps {
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ channel, isOpen, onClose }: SubscriptionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  
  // Edge application wallet address (this would come from config/env)
  const EDGE_WALLET_ADDRESS = "EdgeApplicationWalletAddressHere...";

  const handleSubmit = async () => {
    if (!walletAddress.trim()) {
      toast.error("Please enter the wallet address you sent tokens from");
      return;
    }

    if (!discordUsername.trim()) {
      toast.error("Please enter your Discord username");
      return;
    }

    // Basic validation for Solana address format
    if (walletAddress.length < 32 || walletAddress.length > 44) {
      toast.error("Please enter a valid Solana wallet address");
      return;
    }

    setIsProcessing(true);
    // Simulate verification and pairing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    toast.success("Access granted! Your wallet and Discord have been paired. You'll be added to the Discord channel shortly.");
    handleClose();
  };

  const handleClose = () => {
    setWalletAddress("");
    setDiscordUsername("");
    setIsProcessing(false);
    onClose();
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(EDGE_WALLET_ADDRESS);
    toast.success("Edge wallet address copied to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-black/40 border border-white/[0.08] rounded-2xl w-full max-w-md p-4 md:p-5"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Channel Info Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-sm font-medium text-foreground">
                {channel.trader.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-medium text-white leading-tight">{channel.trader.name}</h3>
                <p className="text-[13px] text-muted-foreground">@{channel.trader.handle}</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06]">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Price</span>
                <span className="text-base font-semibold text-accent">{channel.floorPrice} EDGE</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Instructions */}
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06]">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Send <span className="text-white font-medium">{channel.floorPrice} EDGE</span> to Edge's wallet. 
                Distribution: <span className="text-white">70% trader</span>, <span className="text-red-400">20% burned</span>, <span className="text-blue-400">10% platform</span>.
              </p>
            </div>

            {/* Edge Wallet Address */}
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs text-muted-foreground">Edge Wallet</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs"
                  onClick={copyWalletAddress}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/[0.05]">
                <code className="text-[10px] text-foreground font-mono break-all">
                  {EDGE_WALLET_ADDRESS}
                </code>
              </div>
            </div>

            {/* Wallet Address Input */}
            <div className="space-y-1.5">
              <Label htmlFor="wallet-address" className="text-xs text-foreground">
                Your Wallet Address
              </Label>
              <Input
                id="wallet-address"
                type="text"
                placeholder="Your sending wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="h-9 text-xs bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50 font-mono"
                disabled={isProcessing}
              />
            </div>

            {/* Discord Username Input */}
            <div className="space-y-1.5">
              <Label htmlFor="discord-username" className="text-xs text-foreground">
                Discord Username
              </Label>
              <Input
                id="discord-username"
                type="text"
                placeholder="username#1234"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                className="h-9 text-xs bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                disabled={isProcessing}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!walletAddress.trim() || !discordUsername.trim() || isProcessing}
              className="w-full h-9 text-xs font-medium"
              variant="hero"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Submit & Request Access
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

