import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function HeroSection() {
  const [logoBarOpacity, setLogoBarOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      // Fade out the logo bar as user scrolls down the hero
      const maxFadeDistance = 200; // px
      const y = window.scrollY;
      const nextOpacity = Math.max(0, 1 - y / maxFadeDistance);
      setLogoBarOpacity(nextOpacity);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden -mt-16 pt-16">

      {/* Main content - centered vertically */}
      <div className="relative flex-1 flex items-center px-6 md:px-12 lg:px-16 py-24">
        <div className="w-full max-w-6xl mx-auto text-center">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 md:mb-6 tracking-tighter text-center"
            style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}
          >
            <span className="block whitespace-nowrap mx-auto text-center">Get&nbsp;Private&nbsp;Access&nbsp;To&nbsp;The</span>
            <span 
              className="block mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-center"
            >
              Traders Beating The Markets.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
            className="text-base md:text-lg lg:text-xl text-soft-muted mb-8 md:mb-10 max-w-2xl mx-auto px-2"
          >
            Edge hosts private alpha rooms run by the best prediction market
            traders. Subscribe with EDGE tokens to access exclusive channels.
            Your subscription price moves with demand.
            Cancel anytime to revoke access.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.22 }}
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
              Join Edge
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Trust badges strip - centered logos */}
      <div
        className="relative border-t border-white/[0.04]"
        style={{ opacity: logoBarOpacity, transition: "opacity 150ms ease-out" }}
      >
        <div className="px-4 md:px-8 lg:px-12 py-3">
          <div className="flex items-center justify-center gap-28 md:gap-40">
            {[
              { src: "/LOGOS/POLY.png", alt: "Polymarket" },
              { src: "/LOGOS/SOLANA.png", alt: "Solana" },
              { src: "/LOGOS/DISCORD.png", alt: "Discord" },
              { src: "/LOGOS/OtterSec.png", alt: "OtterSec" },
            ].map((logo, idx) => (
              <img
                key={idx}
                src={logo.src}
                alt={logo.alt}
                className="h-6 w-auto md:h-7 object-contain opacity-90"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}