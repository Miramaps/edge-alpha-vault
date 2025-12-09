import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletAddress } from "@/contexts/WalletAddressContext";
import { toast } from "sonner";

interface WalletAddressModalProps {
  trigger?: React.ReactNode;
  autoOpen?: boolean;
}

// Simple Solana address validation (base58, 32-44 chars)
function isValidSolanaAddress(address: string): boolean {
  if (!address || address.length < 32 || address.length > 44) return false;
  // Basic check - Solana addresses are base58 encoded
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(address);
}

export function WalletAddressModal({ trigger, autoOpen = false }: WalletAddressModalProps) {
  const { address: currentAddress, setAddress } = useWalletAddress();
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddressInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (autoOpen && !currentAddress && !trigger) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoOpen, currentAddress, trigger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedAddress = address.trim();
    
    if (!trimmedAddress) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidSolanaAddress(trimmedAddress)) {
      setError("Invalid Solana wallet address");
      return;
    }

    setAddress(trimmedAddress);
    toast.success("Wallet connected!");
    setIsOpen(false);
    setAddressInput("");
  };

  const handleClose = (open: boolean) => {
    // Allow closing the modal
    setIsOpen(open);
    // Reset form when closing
    if (!open) {
      setAddressInput("");
      setError("");
    }
  };

  const modalContent = (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/95 border-white/[0.08] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Connect Wallet</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Paste your Solana wallet address to connect
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="wallet-address" className="text-sm text-muted-foreground">
              Wallet Address
            </label>
            <Input
              id="wallet-address"
              type="text"
              placeholder="Paste your Solana wallet address here..."
              value={address}
              onChange={(e) => {
                setAddressInput(e.target.value);
                setError("");
              }}
              className="bg-black/40 border-white/[0.08] text-white placeholder:text-muted-foreground focus:border-accent"
            />
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={!address.trim()}
          >
            Connect
          </Button>
        </form>

        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400">
            💡 You can find your wallet address in your wallet app (Phantom, Solflare, etc.)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (trigger) {
    return (
      <>
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
        {modalContent}
      </>
    );
  }

  return modalContent;
}

