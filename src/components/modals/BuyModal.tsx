import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Channel } from "@/data/mockData";

interface BuyModalProps {
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
}

export function BuyModal({ channel, isOpen, onClose }: BuyModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const remainingSupply = channel.maxSupply - channel.minted;
  const maxQuantity = Math.min(remainingSupply, 5);
  const totalPrice = quantity * channel.floorPrice;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // Simulate purchase
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPurchasing(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setQuantity(1);
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-card w-full max-w-md mx-4 p-6"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Purchase Successful
              </h3>
              <p className="text-muted-foreground mb-6">
                You now have access to {channel.trader.name}'s alpha channel.
              </p>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          ) : (
            /* Purchase Form */
            <>
              <h3 className="text-xl font-bold text-foreground mb-1">
                Buy Access NFT
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {channel.name}
              </p>

              {/* Channel Info */}
              <div className="glass-card bg-secondary/30 p-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold">
                    {channel.trader.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{channel.trader.name}</p>
                    <p className="text-xs text-muted-foreground">@{channel.trader.handle}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Floor Price</span>
                  <span className="text-foreground font-medium">{channel.floorPrice} EDGE</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Quantity (max {maxQuantity})
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-bold text-foreground w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                    disabled={quantity >= maxQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="glass-card bg-secondary/30 p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Price per NFT</span>
                  <span className="text-foreground">{channel.floorPrice} EDGE</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="text-foreground">{quantity}</span>
                </div>
                <div className="border-t border-border/50 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-foreground font-medium">Total</span>
                    <span className="text-foreground font-bold">{totalPrice.toFixed(1)} EDGE</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <Button
                onClick={handlePurchase}
                disabled={isPurchasing}
                className="w-full"
                variant="hero"
              >
                {isPurchasing ? "Processing..." : "Confirm Purchase"}
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
