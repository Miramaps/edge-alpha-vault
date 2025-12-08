import { EdgeLogo } from "@/components/icons/EdgeLogo";
import { TwitterIcon, DiscordIcon, GitHubIcon } from "@/components/icons/SocialIcons";

const socialLinks = [
  { href: "https://twitter.com", icon: TwitterIcon, label: "Twitter" },
  { href: "https://discord.com", icon: DiscordIcon, label: "Discord" },
  { href: "https://github.com", icon: GitHubIcon, label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <EdgeLogo size={24} className="text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Edge</span>
          </div>

          <div className="flex items-center gap-4">
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

          <p className="text-muted-foreground text-xs">
            2024 Edge Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
