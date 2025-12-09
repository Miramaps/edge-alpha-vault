import { useState, useEffect, useRef, useMemo } from "react";
import { useWalletAddress } from "@/contexts/WalletAddressContext";
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { CheckCircle, XCircle, Copy, Check, ExternalLink, RefreshCw, ChevronDown, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Platform verification address - Traders send tokens here from their Polymarket trading wallet
// In production, this would be a platform-controlled address
const VERIFICATION_ADDRESS = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"; // Platform verification address
const VERIFICATION_AMOUNT = 0.1; // 0.1 SOL

export function VerificationCard() {
  const { address } = useWalletAddress();
  
  // Create connection manually
  const connection = useMemo(() => {
    const endpoint = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");
    return new Connection(endpoint, "confirmed");
  }, []);
  
  // Polymarket trader address (the address they use to trade on Polymarket)
  const [polymarketAddress, setPolymarketAddress] = useState<string>("");
  const [polymarketAddressInput, setPolymarketAddressInput] = useState<string>("");
  const [polymarketAddressError, setPolymarketAddressError] = useState<string>("");
  
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [verificationTx, setVerificationTx] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load saved Polymarket address
  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(`polymarket_address_${address}`);
      if (saved) {
        setPolymarketAddress(saved);
        setPolymarketAddressInput(saved);
      }
    }
  }, [address]);

  // Validate Solana address
  const isValidSolanaAddress = (addr: string): boolean => {
    if (!addr || addr.length < 32 || addr.length > 44) return false;
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58Regex.test(addr);
  };

  const handlePolymarketAddressSubmit = () => {
    setPolymarketAddressError("");
    const trimmed = polymarketAddressInput.trim();
    
    if (!trimmed) {
      setPolymarketAddressError("Please enter your Polymarket trader address");
      return;
    }

    if (!isValidSolanaAddress(trimmed)) {
      setPolymarketAddressError("Invalid Solana wallet address");
      return;
    }

    setPolymarketAddress(trimmed);
    if (address) {
      localStorage.setItem(`polymarket_address_${address}`, trimmed);
    }
    setPolymarketAddressError("");
    toast.success("Polymarket address saved!");
  };

  useEffect(() => {
    // Check if user is already verified (using Polymarket address)
    if (polymarketAddress) {
      const verified = localStorage.getItem(`verified_${polymarketAddress}`);
      const tx = localStorage.getItem(`verification_tx_${polymarketAddress}`);
      if (verified === "true" && tx) {
        setIsVerified(true);
        setVerificationTx(tx);
      } else {
        // Start checking for verification transaction
        checkForVerification();
      }
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [polymarketAddress, connection]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(VERIFICATION_ADDRESS);
    setCopied(true);
    toast.success("Verification address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const checkForVerification = async () => {
    if (!polymarketAddress || !connection || isVerified) return;

    setIsChecking(true);
    try {
      const publicKey = new PublicKey(polymarketAddress);
      // Get recent signatures for the Polymarket trader wallet (outgoing transactions)
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 50,
      });

      // Check each transaction
      for (const sigInfo of signatures) {
        const tx = await connection.getTransaction(sigInfo.signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });

        if (!tx || !tx.meta || tx.meta.err !== null) continue;

        // Get account keys - handle both v0 and legacy transactions
        let accountKeys: PublicKey[] = [];
        if (tx.transaction.message.staticAccountKeys) {
          accountKeys = tx.transaction.message.staticAccountKeys;
        } else if ((tx.transaction.message as any).accountKeys) {
          accountKeys = (tx.transaction.message as any).accountKeys;
        }

        // Find the Polymarket trader wallet index and verification address index
        const polymarketIndex = accountKeys.findIndex(
          (key: PublicKey) => key.toString() === polymarketAddress
        );
        const verificationIndex = accountKeys.findIndex(
          (key: PublicKey) => key.toString() === VERIFICATION_ADDRESS
        );

        // Check if both addresses are in the transaction
        if (polymarketIndex >= 0 && verificationIndex >= 0) {
          const preBalances = tx.meta.preBalances || [];
          const postBalances = tx.meta.postBalances || [];

          // Check if Polymarket trader's balance decreased and verification address balance increased
          if (polymarketIndex < preBalances.length && polymarketIndex < postBalances.length &&
              verificationIndex < preBalances.length && verificationIndex < postBalances.length) {
            
            const polymarketBalanceChange = (preBalances[polymarketIndex] - postBalances[polymarketIndex]) / LAMPORTS_PER_SOL;
            const verificationBalanceChange = (postBalances[verificationIndex] - preBalances[verificationIndex]) / LAMPORTS_PER_SOL;

            // Check if approximately 0.1 SOL was sent (accounting for transaction fees)
            // Polymarket trader balance should decrease by ~0.1 SOL + fees, verification should increase by ~0.1 SOL
            if (verificationBalanceChange >= VERIFICATION_AMOUNT * 0.99 && 
                polymarketBalanceChange >= VERIFICATION_AMOUNT * 0.99) {
              
              // Verify the transaction (store using Polymarket address as key)
              localStorage.setItem(`verified_${polymarketAddress}`, "true");
              localStorage.setItem(`verification_tx_${polymarketAddress}`, sigInfo.signature);
              // Also link it to the logged-in address for easy lookup
              if (address) {
                localStorage.setItem(`verified_polymarket_${address}`, polymarketAddress);
              }

              setIsVerified(true);
              setVerificationTx(sigInfo.signature);
              toast.success("Verification detected! You are now verified.");

              // Stop checking
              if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
              }
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking verification:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleManualCheck = () => {
    checkForVerification();
  };

  // Set up automatic checking every 10 seconds if not verified
  useEffect(() => {
    if (!polymarketAddress || isVerified) {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      return;
    }

    // Initial check
    checkForVerification();

    // Set up interval to check every 10 seconds
    checkIntervalRef.current = setInterval(() => {
      checkForVerification();
    }, 10000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [polymarketAddress, isVerified, connection]);

  const viewOnExplorer = () => {
    if (verificationTx) {
      window.open(
        `https://solscan.io/tx/${verificationTx}`,
        "_blank"
      );
    }
  };

  return (
    <Card className="bg-black/40 border-white/[0.08]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isVerified ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-400" />
            )}
            <CardTitle className="text-white text-base">Trader Verification</CardTitle>
          </div>
          {isVerified && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5">
              Verified
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs mt-1">
          Optional: Get verified by sending 0.1 SOL from your Polymarket trading wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {isVerified ? (
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-medium text-emerald-400">
                ✓ You are verified! Badge appears on leaderboard
              </p>
            </div>
            {verificationTx && (
              <div className="flex items-center gap-2 p-2 bg-black/50 border border-white/[0.06] rounded-md">
                <code className="flex-1 text-[10px] font-mono text-foreground truncate">
                  {verificationTx}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={viewOnExplorer}
                  className="h-6 px-2"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {/* GET VERIFIED Button/Header */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full p-3 rounded-lg bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 hover:border-accent/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Shield className="w-4 h-4 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Get Verified</p>
                  <p className="text-[10px] text-muted-foreground">Optional: Show verification badge</p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Expandable Verification Form */}
            {isExpanded && (
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs font-medium text-amber-400 mb-1">
                    Send 0.1 SOL from your <strong>Polymarket trading wallet</strong> to verify
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Enter your Polymarket trading wallet address below. We'll monitor this address for the verification transaction.
                  </p>
                </div>

                {/* Polymarket Trader Address Input */}
                {!polymarketAddress ? (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">
                      Your Polymarket Trading Wallet Address
                    </Label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={polymarketAddressInput}
                        onChange={(e) => {
                          setPolymarketAddressInput(e.target.value);
                          setPolymarketAddressError("");
                        }}
                        placeholder="Paste your Polymarket trading wallet address..."
                        className="flex-1 px-2.5 py-1.5 text-xs bg-black/50 border border-white/[0.06] rounded-md text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                      />
                      <Button
                        onClick={handlePolymarketAddressSubmit}
                        variant="hero"
                        size="sm"
                        className="h-8 px-3 text-xs"
                        disabled={!polymarketAddressInput.trim()}
                      >
                        Save
                      </Button>
                    </div>
                    {polymarketAddressError && (
                      <p className="text-[10px] text-red-400">{polymarketAddressError}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      This is the wallet address you use to trade on Polymarket. We'll monitor this address for verification.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">
                      Polymarket Trading Wallet
                    </Label>
                    <div className="p-2 bg-black/50 border border-white/[0.06] rounded-md">
                      <div className="flex items-center justify-between gap-2">
                        <code className="flex-1 text-[10px] font-mono text-foreground break-all">
                          {polymarketAddress}
                        </code>
                        <Button
                          onClick={() => {
                            setPolymarketAddress("");
                            setPolymarketAddressInput("");
                            if (address) {
                              localStorage.removeItem(`polymarket_address_${address}`);
                            }
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Monitoring this address for verification transaction...
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    Platform Verification Address
                  </Label>
                  <div className="flex items-center gap-1.5 p-2 bg-black/50 border border-white/[0.06] rounded-md">
                    <code className="flex-1 text-[10px] font-mono text-foreground break-all">
                      {VERIFICATION_ADDRESS}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1 hover:bg-white/[0.05] rounded transition-colors flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Amount: <span className="text-foreground font-medium">0.1 SOL</span>
                  </p>
                </div>

                {polymarketAddress && (
                  <div className="space-y-1.5">
                    <Button
                      onClick={handleManualCheck}
                      disabled={isChecking || !polymarketAddress}
                      variant="hero"
                      size="sm"
                      className="w-full h-8 text-xs"
                    >
                      {isChecking ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          Check Status
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center leading-tight">
                      Auto-checks every 10s. Send 0.1 SOL from your Polymarket wallet ({polymarketAddress.slice(0, 4)}...{polymarketAddress.slice(-4)}) to verify.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

