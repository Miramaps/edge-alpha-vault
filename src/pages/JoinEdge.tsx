import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Coins, Image, MessageCircle, Send, Users, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Cropper from 'react-easy-crop';
import { toast } from "sonner";

export default function JoinEdge() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    channelName: "",
    twitterHandle: "",
    discordHandle: "",
    maxMembers: "",
    markets: "",
    polymarketWallet: "",
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
      // open crop modal
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
        setShowCropModal(true);
        setProfileFile(file);
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
        setShowCropModal(true);
        setProfileFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileFile(null);
  };

  // Helper: create Image from url
  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement('img');
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (err) => reject(err));
      // Only set crossOrigin for non-data URLs to avoid some browser issues
      if (!url.startsWith('data:')) img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });

  // Helper: get cropped image blob from crop area
  const getCroppedImg = async (imageSrc: string, pixelCrop: any, fileName = 'cropped.png') => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    // Round crop dimensions to avoid fractional pixel issues
    const cropX = Math.max(0, Math.round(pixelCrop.x));
    const cropY = Math.max(0, Math.round(pixelCrop.y));
    const cropW = Math.max(1, Math.round(pixelCrop.width));
    const cropH = Math.max(1, Math.round(pixelCrop.height));
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH
    );

    return new Promise<File>((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {
          if (blob) {
            const f = new File([blob as BlobPart], fileName, { type: 'image/png' });
            resolve(f);
          } else {
            // Fallback: use dataURL
            const dataUrl = canvas.toDataURL('image/png');
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            const f = new File([u8arr], fileName, { type: mime });
            resolve(f);
          }
        }, 'image/png');
      } catch (err) {
        reject(err);
      }
    });
  };

  const onCropComplete = useCallback((area: any, areaPixels: any) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const applyCrop = async () => {
    if (!profileImage || !croppedAreaPixels) return;
    try {
      const file = await getCroppedImg(profileImage, croppedAreaPixels, 'profile.png');
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setProfileFile(file);
      setShowCropModal(false);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (err) {
      console.error('Crop error:', err);
      toast.error(`Failed to crop image: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      if (profileFile) {
        form.append('profileImage', profileFile);
      } else if (profileImage) {
        // fallback: convert dataURL to File if no original File available
        const arr = profileImage.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1] || '');
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        const blob = new Blob([u8arr], { type: mime });
        form.append('profileImage', new File([blob], 'profile.jpg', { type: mime }));
      }
      const apiBase = (import.meta as any).env?.VITE_API_URL || '';
      const url = apiBase ? `${apiBase.replace(/\/+$/, '')}/join-edge` : '/join-edge';
      const res = await fetch(url, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Failed to submit');
      toast.success("Application submitted! We'll review and get back to you within 48 hours.");
    } catch (err) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      <div className="container relative mx-auto px-4 py-4 md:py-6 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center w-full max-w-6xl mx-auto pt-8 md:pt-0">

          {/* Left Side - Info */}
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1.5 md:mb-2 leading-tight">
              Join <span className="text-accent">Edge</span>
            </h1>

            <p className="text-muted-foreground text-xs md:text-sm mb-4 md:mb-5 max-w-md">
              Share your alpha, build a community, and earn EDGE tokens through token-gated access to your exclusive channel.
            </p>

            {/* Benefits */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-black/30 border border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Coins className="w-3.5 h-3.5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground text-xs font-medium">Your Price</p>
                  <p className="text-muted-foreground text-[10px]">Dynamic pricing based on deflationary token</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-black/30 border border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-3.5 h-3.5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground text-xs font-medium">Control Access</p>
                  <p className="text-muted-foreground text-[10px]">Set max members limit</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-black/30 border border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground text-xs font-medium">Discord Integration</p>
                  <p className="text-muted-foreground text-[10px]">Auto-gated access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="p-4 md:p-5 rounded-2xl bg-black/40 border border-white/[0.08]"
            >
              {/* Profile Picture */}
              <div className="mb-4">
                <Label className="text-foreground text-sm mb-2 block">Profile Picture</Label>
                <div
                  className={`relative flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${isDragging
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
                        className="w-12 h-12 rounded-full object-cover border border-white/[0.1]"
                      />
                      <div className="flex-1">
                        <p className="text-foreground text-xs font-medium">Image uploaded</p>
                        <p className="text-muted-foreground text-[10px]">Click to change</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
                      >
                        <X className="w-3 h-3 text-accent" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center">
                        <Image className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-foreground text-xs font-medium">Drag & drop image</p>
                        <p className="text-muted-foreground text-[10px]">or click to browse</p>
                      </div>
                    </>
                  )}
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={inputRef}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-4" />

              {/* Channel Details */}
              <div className="space-y-3 mb-4">
                <div>
                  <Label htmlFor="channelName" className="text-foreground text-xs">Channel Name</Label>
                  <Input
                    id="channelName"
                    name="channelName"
                    placeholder="Alpha Signals"
                    value={formData.channelName}
                    onChange={handleChange}
                    required
                    className="mt-1 h-9 text-sm bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div>
                  <Label htmlFor="maxMembers" className="text-foreground text-xs">Max Members (max 1000)</Label>
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
                    className="mt-1 h-9 text-sm bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-4" />

              {/* Social Links */}
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <Label htmlFor="twitterHandle" className="text-foreground text-xs">X (Twitter)</Label>
                    <Input
                      id="twitterHandle"
                      name="twitterHandle"
                      placeholder="@yourhandle"
                      value={formData.twitterHandle}
                      onChange={handleChange}
                      required
                      className="mt-1 h-9 text-sm bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discordHandle" className="text-foreground text-xs">Discord</Label>
                    <Input
                      id="discordHandle"
                      name="discordHandle"
                      placeholder="username"
                      value={formData.discordHandle}
                      onChange={handleChange}
                      className="mt-1 h-9 text-sm bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="markets" className="text-foreground text-xs">Markets You Trade</Label>
                  <Input
                    id="markets"
                    name="markets"
                    placeholder="Crypto, Politics, Sports"
                    value={formData.markets}
                    onChange={handleChange}
                    required
                    className="mt-1 h-9 text-sm bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-4" />

              {/* Polymarket Wallet */}
              <div className="mb-4">
                <div>
                  <Label htmlFor="polymarketWallet" className="text-foreground text-xs">
                    Polymarket Trading Wallet Address
                  </Label>
                  <Input
                    id="polymarketWallet"
                    name="polymarketWallet"
                    type="text"
                    placeholder="Your Solana wallet address used for Polymarket trading"
                    value={formData.polymarketWallet}
                    onChange={handleChange}
                    required
                    className="mt-1 h-9 text-sm bg-black/30 border-white/[0.06] focus:border-accent/50 placeholder:text-muted-foreground/50"
                  />
                  <p className="text-muted-foreground text-[10px] mt-1">
                    This is the wallet address you use to trade on Polymarket. We'll use this for verification and data tracking.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full h-10 text-xs font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Application
                    <Send className="w-3.5 h-3.5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-muted-foreground/60 text-[10px] mt-2">
                We'll review your application and get back to you soon
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && profileImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[90vw] md:w-[520px] bg-black/90 p-4 rounded-md">
            <div className="relative w-full h-[360px] bg-black">
              <Cropper
                image={profileImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1" />
              <button type="button" className="px-3 py-1 rounded bg-gray-700" onClick={() => { setShowCropModal(false); setProfileImage(null); setProfileFile(null); }}>Cancel</button>
              <button type="button" className="px-3 py-1 rounded bg-accent" onClick={applyCrop}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
