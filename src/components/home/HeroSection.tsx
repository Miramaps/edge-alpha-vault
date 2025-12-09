import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden -mt-16 pt-16">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-radial" />
      
      {/* Intense crimson glow effects */}
      <div 
        className="absolute top-0 right-0 w-[900px] h-[700px] rounded-full blur-[180px] animate-glow-pulse"
        style={{ background: 'radial-gradient(circle, hsl(0 85% 55% / 0.5) 0%, hsl(355 70% 40% / 0.3) 50%, transparent 70%)' }}
      />
      <div 
        className="absolute -top-20 left-0 w-[500px] h-[500px] rounded-full blur-[150px] animate-glow-pulse"
        style={{ background: 'radial-gradient(circle, hsl(5 90% 50% / 0.4) 0%, transparent 60%)' }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-60"
        style={{ background: 'radial-gradient(circle, hsl(0 80% 45% / 0.35) 0%, transparent 60%)' }}
      />

      {/* Main content - centered vertically */}
      <div className="relative flex-1 flex items-center px-6 md:px-12 lg:px-16 py-24">
        <div className="max-w-3xl mx-auto text-center">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Welcome to Edge
            <span 
              className="block mt-2"
              style={{ color: 'hsl(355 71% 51%)' }}
            >
              Trade on the traders.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-soft-muted mb-10 max-w-2xl mx-auto"
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
            <Link to="/#channels" className="btn-accent px-8 py-3 text-base">
              Explore Channels
            </Link>
            <Link 
              to="/become-trader" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full border transition-all duration-200 hover:bg-white/5"
              style={{ 
                borderColor: 'hsl(16 20% 33%)',
                color: 'hsl(30 4% 93%)'
              }}
            >
              Become a Trader
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Trust badges strip - pinned to bottom of viewport */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative border-t"
        style={{ 
          borderColor: 'hsl(16 20% 24% / 0.5)',
          background: 'hsl(17 23% 18% / 0.3)'
        }}
      >
        <div className="px-6 md:px-12 lg:px-16 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-soft-dim">
            <span>Top Polymarket traders</span>
            <span className="hidden md:inline" style={{ color: 'hsl(16 20% 33%)' }}>|</span>
            <span>Kalshi verified</span>
            <span className="hidden md:inline" style={{ color: 'hsl(16 20% 33%)' }}>|</span>
            <span>Live on-chain stats</span>
            <span className="hidden md:inline" style={{ color: 'hsl(16 20% 33%)' }}>|</span>
            <span>Audited smart contracts</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}