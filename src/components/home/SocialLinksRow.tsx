import { TwitterIcon, DiscordIcon, DocsIcon } from "@/components/icons/SocialIcons";

const links = [
  { href: "https://twitter.com", icon: TwitterIcon, label: "Twitter / X" },
  { href: "https://discord.com", icon: DiscordIcon, label: "Discord" },
  { href: "/docs", icon: DocsIcon, label: "Documentation" },
];

export function SocialLinksRow() {
  return (
    <section className="border-b border-border/30 bg-card/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <span className="text-muted-foreground text-sm">Stay connected</span>
          <div className="flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
