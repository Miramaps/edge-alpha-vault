import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden -mt-16 pt-16">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-radial" />
      
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-warm-highlight/10 rounded-full blur-[150px] animate-glow-pulse" />

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto text-center">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
          >
            Welcome to Edge
            <span className="block text-accent mt-2">Trade on the traders.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Top prediction market traders run token-gated Discord alpha channels.
            Access is an NFT with limited supply. More members push the floor price higher.
            NFTs are tradable; selling revokes access.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/#channels">Explore Channels</Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/become-trader">Become a Trader</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Trust badges strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative border-t border-border/30 bg-secondary/20"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-muted-foreground">
            <span>Top Polymarket traders</span>
            <span className="hidden md:inline text-border">|</span>
            <span>Kalshi verified</span>
            <span className="hidden md:inline text-border">|</span>
            <span>Live on-chain stats</span>
            <span className="hidden md:inline text-border">|</span>
            <span>Audited smart contracts</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
