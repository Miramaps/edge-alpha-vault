import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { TwitterIcon, DiscordIcon, GitHubIcon } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/button";
import { WalletDropdown } from "@/components/wallet/WalletDropdown";
import { WalletAddressModal } from "@/components/wallet/WalletAddressModal";
import { useWalletAddress } from "@/contexts/WalletAddressContext";
import { cn } from "@/lib/utils";
import edgeLogo from "@/assets/edge-logo.png";

const navLinks = [
  { href: "/channels", label: "Channels" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/docs", label: "Docs" },
];

const socialLinks = [
  { href: "https://x.com/UseEdge", icon: TwitterIcon, label: "Twitter" },
  { href: "https://discord.com", icon: DiscordIcon, label: "Discord" },
  { href: "https://github.com", icon: GitHubIcon, label: "GitHub" },
];

export function NavBar() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address } = useWalletAddress();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <div className="w-full px-4 md:px-12 lg:px-16 h-14 md:h-16 flex items-center justify-between relative">
              {/* Left side - Logo and nav */}
              <div className="flex items-center gap-4 md:gap-8">
                <Link to="/" className="flex items-center gap-0 group">
                  <img src={edgeLogo} alt="Edge" className="w-16 h-16 md:w-24 md:h-24 transition-transform duration-200 group-hover:scale-105" />
                  <span className="text-foreground font-semibold text-base md:text-lg tracking-tight -ml-5">Edge</span>
                </Link>
              </div>

              {/* Centered nav links */}
              <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "nav-link",
                      location.pathname === link.href && "nav-link-active"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Right side - Token, Connect, Socials */}
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md">
                  <span className="text-muted-foreground text-xs">Token:</span>
                  <span className="text-foreground text-sm font-medium">EDGE</span>
                  <span className="text-accent text-xs">$0.84</span>
                </div>

                {address ? (
                  <WalletDropdown publicKey={address} />
                ) : (
                  <WalletAddressModal
                    trigger={
                      <Button
                        variant="hero"
                        size="sm"
                        className="text-xs md:text-sm px-3 md:px-4"
                      >
                        Connect Wallet
                      </Button>
                    }
                  />
                )}

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-foreground"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Floating socials on right edge for desktop */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3"
          >
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-b border-white/[0.06]"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === link.href 
                      ? "bg-accent/10 text-accent" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-white/[0.06] my-2" />
              
              <div className="flex items-center gap-4 px-4 py-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
