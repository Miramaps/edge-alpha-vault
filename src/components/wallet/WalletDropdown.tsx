import { useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, Shield, LogOut, Copy, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useWalletAddress } from "@/contexts/WalletAddressContext";

interface WalletDropdownProps {
  publicKey: string;
}

export function WalletDropdown({ publicKey }: WalletDropdownProps) {
  const { disconnect } = useWalletAddress();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    toast.success("Wallet address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected");
  };

  const truncatedAddress = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="hero"
          size="sm"
          className="text-xs md:text-sm px-3 md:px-4 flex items-center gap-1.5"
        >
          {truncatedAddress}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black/95 border-white/[0.08]">
        <div className="px-2 py-1.5 border-b border-white/[0.06]">
          <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground font-mono">{truncatedAddress}</p>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-white/[0.05] rounded transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-3 h-3 text-accent" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        
        <DropdownMenuItem
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer focus:bg-white/[0.05]"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => navigate("/security")}
          className="cursor-pointer focus:bg-white/[0.05]"
        >
          <Shield className="w-4 h-4 mr-2" />
          Security
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        
        <DropdownMenuItem
          onClick={handleDisconnect}
          className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

