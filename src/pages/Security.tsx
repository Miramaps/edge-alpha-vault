import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { useWalletAddress } from "@/contexts/WalletAddressContext";
import { Navigate } from "react-router-dom";
import { Shield, CheckCircle, XCircle, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticator } from "otplib";
import { toast } from "sonner";
import { verifyTOTP } from "@/utils/totp";
// QR code library is loaded lazily to avoid SSR/import reassignment issues

export default function Security() {
  const { address } = useWalletAddress();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrCodeRef = useRef<any>(null);

  useEffect(() => {
    // Check if 2FA is already enabled (in a real app, this would come from your backend)
    const stored2FA = localStorage.getItem(`2fa_enabled_${address}`);
    if (stored2FA === "true") {
      setIs2FAEnabled(true);
    }
  }, [address]);

  if (!address) {
    return <Navigate to="/" replace />;
  }

  const handleEnable2FA = async () => {
    try {
      if (!address) {
        toast.error("Wallet not connected");
        return;
      }

      // Dynamically import QRCode if not already loaded
      if (!qrCodeRef.current) {
        const qrcodeModule = await import("qrcode");
        qrCodeRef.current = qrcodeModule.default || qrcodeModule;
      }
      const QRCode = qrCodeRef.current;

      // Generate a secret for this user using browser-compatible Web Crypto API
      // otplib's generateSecret() uses Node.js crypto, so we generate it manually
      const array = new Uint8Array(20); // 20 bytes = 160 bits (standard for TOTP)
      crypto.getRandomValues(array);
      
      // Convert to base32 string (proper RFC 4648 base32 encoding)
      const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      let base32Secret = '';
      let buffer = 0;
      let bitsLeft = 0;
      
      for (let i = 0; i < array.length; i++) {
        buffer = (buffer << 8) | array[i];
        bitsLeft += 8;
        
        while (bitsLeft >= 5) {
          const index = (buffer >> (bitsLeft - 5)) & 0x1f;
          base32Secret += base32Chars[index];
          bitsLeft -= 5;
        }
      }
      
      // Handle remaining bits (if any)
      if (bitsLeft > 0) {
        const index = (buffer << (5 - bitsLeft)) & 0x1f;
        base32Secret += base32Chars[index];
      }
      
      // Store secret in uppercase (base32 standard)
      const normalizedSecret = base32Secret.toUpperCase();
      setSecret(normalizedSecret);
      
      // Debug: verify secret format
      console.log("Generated 2FA secret:", {
        length: normalizedSecret.length,
        preview: normalizedSecret.substring(0, 16) + "...",
        isValidBase32: /^[A-Z2-7]+$/.test(normalizedSecret)
      });

      // Create the OTP Auth URL manually to avoid otplib's crypto usage
      // Standard OTP URL format: otpauth://totp/{label}?secret={secret}&issuer={issuer}
      const serviceName = "EDGE Platform";
      const accountName = address.slice(0, 8);
      // Label format: can be just account or issuer:account
      // Using issuer:account format for better compatibility
      const label = `${serviceName}:${accountName}`;
      // Build the OTP URL - use normalized secret (uppercase)
      const otpAuthUrl = `otpauth://totp/${encodeURIComponent(label)}?secret=${normalizedSecret}&issuer=${encodeURIComponent(serviceName)}`;

      // Generate QR code
      const qrCode = await QRCode.toDataURL(otpAuthUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        width: 256,
      });
      setQrCodeUrl(qrCode);
      toast.success("2FA setup generated! Scan the QR code with your authenticator app.");
    } catch (error) {
      toast.error("Failed to generate 2FA setup");
      console.error("2FA Error:", error);
    }
  };

  const handleVerify2FA = async () => {
    if (!secret || !verificationCode) {
      toast.error("Please enter a verification code");
      return;
    }

    setIsVerifying(true);
    try {
      // Ensure secret is uppercase (base32 should be uppercase)
      const normalizedSecret = secret.toUpperCase().replace(/\s/g, '');
      
      // Verify the code using browser-compatible TOTP verification
      const isValid = await verifyTOTP(verificationCode, normalizedSecret, 1);
      
      // Debug logging (remove in production)
      if (!isValid) {
        console.log("2FA Verification Debug:", {
          code: verificationCode,
          secretLength: normalizedSecret.length,
          secretPreview: normalizedSecret.substring(0, 8) + "...",
        });
      }

      if (isValid) {
        // Store 2FA status (in a real app, this would be sent to your backend)
        localStorage.setItem(`2fa_enabled_${address}`, "true");
        localStorage.setItem(`2fa_secret_${address}`, secret);
        
        setIs2FAEnabled(true);
        setSecret(null);
        setQrCodeUrl(null);
        setVerificationCode("");
        toast.success("2FA enabled successfully!");
      } else {
        toast.error("Invalid verification code. Make sure you're entering the current 6-digit code from your authenticator app.");
      }
    } catch (error) {
      toast.error("Verification failed");
      console.error("2FA verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable2FA = () => {
    if (confirm("Are you sure you want to disable 2FA? This will reduce your account security.")) {
      localStorage.removeItem(`2fa_enabled_${address}`);
      localStorage.removeItem(`2fa_secret_${address}`);
      setIs2FAEnabled(false);
      toast.success("2FA disabled");
    }
  };

  const handleCopySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success("Secret copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
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
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Security</h1>
          <p className="text-muted-foreground">Manage your account security settings</p>
        </div>

        <Card className="bg-black/40 border-white/[0.08] mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              <CardTitle className="text-white">Two-Factor Authentication (2FA)</CardTitle>
            </div>
            <CardDescription>
              Add an extra layer of security to your account using Google Authenticator or similar apps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {is2FAEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-emerald-400">2FA is enabled</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your account is protected with two-factor authentication
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDisable2FA}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  Disable 2FA
                </Button>
              </div>
            ) : secret && qrCodeUrl ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Step 1: Scan QR Code
                  </Label>
                  <p className="text-xs text-muted-foreground mb-4">
                    Open Google Authenticator (or similar app) and scan this QR code:
                  </p>
                  <div className="flex justify-center p-4 bg-white rounded-lg w-fit mx-auto">
                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Step 2: Backup Secret Key
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Save this secret key in a safe place. You'll need it if you lose access to your authenticator app.
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-black/50 border border-white/[0.06] rounded-md">
                    <code className="flex-1 text-sm font-mono text-foreground break-all">
                      {secret}
                    </code>
                    <button
                      onClick={handleCopySecret}
                      className="p-1.5 hover:bg-white/[0.05] rounded transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="verification-code" className="text-sm font-medium text-foreground mb-2 block">
                    Step 3: Enter Verification Code
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Enter the 6-digit code from your authenticator app:
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="verification-code"
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="font-mono text-center text-lg tracking-widest"
                    />
                    <Button
                      onClick={handleVerify2FA}
                      disabled={verificationCode.length !== 6 || isVerifying}
                      variant="hero"
                    >
                      {isVerifying ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSecret(null);
                    setQrCodeUrl(null);
                    setVerificationCode("");
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <XCircle className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">2FA is not enabled</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enable 2FA to add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleEnable2FA} 
                  variant="hero"
                  disabled={!address}
                >
                  Enable 2FA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white">Wallet Information</CardTitle>
            <CardDescription>Your connected wallet address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-black/50 border border-white/[0.06] rounded-md">
              <code className="text-sm font-mono text-foreground break-all">
                {address}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

