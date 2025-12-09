import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, AlertCircle } from "lucide-react";
import { verifyTOTP } from "@/utils/totp";

interface TwoFactorModalProps {
  isOpen: boolean;
  walletAddress: string;
  onVerify: () => void;
  onCancel?: () => void;
}

export function TwoFactorModal({ isOpen, walletAddress, onVerify, onCancel }: TwoFactorModalProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  // Reset code when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCode("");
      setAttempts(0);
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    if (attempts >= maxAttempts) {
      toast.error("Too many failed attempts. Please try again later.");
      return;
    }

    setIsVerifying(true);
    try {
      // Get the stored secret for this wallet
      const storedSecret = localStorage.getItem(`2fa_secret_${walletAddress}`);
      if (!storedSecret) {
        toast.error("2FA not configured for this wallet");
        setIsVerifying(false);
        return;
      }

      // Verify the code using browser-compatible TOTP verification
      const isValid = await verifyTOTP(code, storedSecret, 1);

      if (isValid) {
        // Store successful verification in session
        const sessionKey = `2fa_verified_${walletAddress}`;
        const sessionExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        localStorage.setItem(sessionKey, sessionExpiry.toString());
        
        toast.success("2FA verification successful!");
        setCode("");
        onVerify();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setCode("");
        
        if (newAttempts >= maxAttempts) {
          toast.error("Too many failed attempts. Please try again later.");
          if (onCancel) {
            setTimeout(() => onCancel(), 2000);
          }
        } else {
          toast.error(`Invalid code. ${maxAttempts - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      toast.error("Verification failed");
      console.error("2FA verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.length === 6) {
      handleVerify();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-black/90 border-white/[0.08]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-accent" />
            <DialogTitle className="text-white">Two-Factor Authentication</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Enter the 6-digit code from your authenticator app to continue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {attempts > 0 && attempts < maxAttempts && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <p className="text-sm text-amber-400">
                {maxAttempts - attempts} attempts remaining
              </p>
            </div>
          )}

          {attempts >= maxAttempts && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-400">
                Too many failed attempts. Please try again later.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="2fa-code" className="text-foreground mb-2 block">
              Verification Code
            </Label>
            <Input
              id="2fa-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              className="font-mono text-center text-2xl tracking-widest h-14"
              disabled={isVerifying || attempts >= maxAttempts}
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Open your authenticator app and enter the 6-digit code
            </p>
          </div>

          <div className="flex gap-2">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isVerifying}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleVerify}
              disabled={code.length !== 6 || isVerifying || attempts >= maxAttempts}
              variant="hero"
              className="flex-1"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

