import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden -mt-16 pt-16">

      {/* Main content - centered vertically */}
      <div className="relative flex-1 flex items-center px-6 md:px-12 lg:px-16 py-24">
        <div className="max-w-3xl mx-auto text-center">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 md:mb-6"
          >
            Welcome to Edge
            <span 
              className="block mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              style={{ color: 'hsl(355 71% 51%)' }}
            >
              Get private access to the traders beating the markets.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl text-soft-muted mb-8 md:mb-10 max-w-2xl mx-auto px-2"
          >
            Edge hosts private alpha rooms run by the best prediction market traders.
            Your access is a scarce NFT — its price moves with demand.
            Trade your membership anytime; selling removes your access.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/channels" className="btn-accent px-8 py-3 text-base">
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
        className="relative border-t border-white/[0.06] bg-black/20 backdrop-blur-sm"
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