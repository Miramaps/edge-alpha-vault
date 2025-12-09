import { Link } from "react-router-dom";
import { TwitterIcon, DiscordIcon, DocsIcon } from "@/components/icons/SocialIcons";
import edgeLogo from "@/assets/edge-logo.png";

const socialLinks = [
  { href: "https://x.com/UseEdge", icon: TwitterIcon, label: "Twitter / X" },
  { href: "/docs", icon: DocsIcon, label: "Documentation", isInternal: true },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Stay connected section */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-muted-foreground text-sm">Stay connected</span>
            <div className="flex items-center gap-6">
              {socialLinks.map((link) => (
                link.isInternal ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-border/30" />

          {/* Logo and copyright */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img src={edgeLogo} alt="Edge" className="w-6 h-6 opacity-70" />
              <span className="text-muted-foreground text-sm">Edge</span>
            </div>
            <p className="text-muted-foreground text-xs">
              2024 Edge Protocol. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
