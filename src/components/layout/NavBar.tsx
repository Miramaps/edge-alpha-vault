import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TwitterIcon, DiscordIcon, GitHubIcon } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import edgeLogo from "@/assets/edge-logo.png";

const navLinks = [
  { href: "/", label: "Channels" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/docs", label: "Docs" },
];

const socialLinks = [
  { href: "https://twitter.com", icon: TwitterIcon, label: "Twitter" },
  { href: "https://discord.com", icon: DiscordIcon, label: "Discord" },
  { href: "https://github.com", icon: GitHubIcon, label: "GitHub" },
];

export function NavBar() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div className="w-full px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">
            {/* Left side - Logo and nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <img src={edgeLogo} alt="Edge" className="w-20 h-20 transition-transform duration-200 group-hover:scale-105" />
                <span className="text-foreground font-semibold text-lg tracking-tight">Edge</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
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
            </div>

            {/* Right side - Token, Connect, Socials */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md">
                <span className="text-muted-foreground text-xs">Token:</span>
                <span className="text-foreground text-sm font-medium">EDGE</span>
                <span className="text-accent text-xs">$0.84</span>
              </div>

              <div className="hidden lg:flex items-center gap-1">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>

              <Button variant="hero" size="sm">
                Connect Wallet
              </Button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
