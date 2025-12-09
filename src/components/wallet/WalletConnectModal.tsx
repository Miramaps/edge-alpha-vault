import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet } from "lucide-react";

// Wallet icons mapping
const walletIcons: Record<string, string> = {
  "Phantom": "👻",
  "Solflare": "🔥",
  "Torus": "🔷",
  "Ledger": "🔐",
};

interface WalletConnectModalProps {
  trigger?: React.ReactNode;
  autoOpen?: boolean;
}

export function WalletConnectModal({ trigger, autoOpen = false }: WalletConnectModalProps) {
  const { wallet, wallets, select, connect, connected, publicKey } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Open modal on mount if wallet is not connected and autoOpen is true
  useEffect(() => {
    if (autoOpen && !connected && !publicKey) {
      // Small delay to let page load first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [connected, publicKey, autoOpen]);

  const handleWalletSelect = async (walletName: string) => {
    try {
      setIsConnecting(true);
      select(walletName);
      
      // Small delay to let wallet adapter initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Trigger connection
      await connect();
      
      // Close modal on successful connection
      setIsOpen(false);
    } catch (error) {
      console.error("Wallet connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open && !connected) {
      // Don't allow closing if not connected - user must connect to use the platform
      return;
    }
    setIsOpen(open);
  };

  const modalContent = (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/95 border-white/[0.08] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Connect Wallet</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose a wallet to connect and access the platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 mt-4">
          {wallets.map((walletOption) => {
            const isInstalled = walletOption.readyState === "Installed";
            const isSelected = wallet?.adapter.name === walletOption.adapter.name;
            
            return (
              <button
                key={walletOption.adapter.name}
                onClick={() => handleWalletSelect(walletOption.adapter.name)}
                disabled={!isInstalled || isConnecting}
                className={`
                  w-full p-4 rounded-lg border transition-all
                  flex items-center justify-between gap-3
                  ${isSelected && connected
                    ? "bg-accent/20 border-accent/50"
                    : isInstalled
                    ? "bg-black/40 border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05]"
                    : "bg-black/20 border-white/[0.04] opacity-50 cursor-not-allowed"
                  }
                  ${isConnecting ? "opacity-50 cursor-wait" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xl">
                    {walletIcons[walletOption.adapter.name] || <Wallet className="w-5 h-5 text-accent" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">
                      {walletOption.adapter.name}
                    </p>
                    {!isInstalled && (
                      <p className="text-xs text-muted-foreground">Not installed</p>
                    )}
                    {isSelected && connected && (
                      <p className="text-xs text-emerald-400">Connected</p>
                    )}
                  </div>
                </div>
                {isConnecting && isSelected && (
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400">
            💡 Don't have a wallet? Download{" "}
            <a
              href="https://phantom.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-300"
            >
              Phantom
            </a>{" "}
            or{" "}
            <a
              href="https://solflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-300"
            >
              Solflare
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  // If trigger is provided, render as button trigger
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

  // Otherwise render as standalone modal
  return modalContent;
}
