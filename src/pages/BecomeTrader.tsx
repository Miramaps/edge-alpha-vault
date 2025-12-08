import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, TrendingUp, Users, Zap, DollarSign, Shield, Award } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Earn from Your Alpha",
    description: "Monetize your trading expertise by selling access to your exclusive channel.",
  },
  {
    icon: Users,
    title: "Build Your Community",
    description: "Create a loyal following of members who value your insights and analysis.",
  },
  {
    icon: Shield,
    title: "NFT-Gated Access",
    description: "Exclusive Discord rooms protected by NFT membership for true scarcity.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Performance",
    description: "Showcase your win rate, PnL, and trading stats to attract more members.",
  },
];

const requirements = [
  "Minimum 50% win rate over 30+ trades",
  "Active trading history on supported markets",
  "Commitment to regular alpha updates",
  "Discord account for community management",
];

export default function BecomeTrader() {
  return (
    <Layout>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none opacity-50" />

      <div className="container relative mx-auto px-4 py-20 md:py-28">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm mb-6">
            <Award className="w-4 h-4" />
            Join the Elite
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Become a <span className="text-accent">Trader</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your trading expertise, build a community of followers, and earn EDGE tokens 
            by selling NFT access to your exclusive alpha channel.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-zinc-900/90 to-black/80 border border-accent/20 hover:border-accent/40 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="p-8 rounded-xl bg-gradient-to-br from-zinc-900/90 to-black/80 border border-accent/20">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Requirements</h2>
            </div>
            
            <ul className="space-y-4 mb-8">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-foreground">{req}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" className="w-full">
              Apply Now
            </Button>
            
            <p className="text-center text-muted-foreground text-sm mt-4">
              Applications are reviewed within 48 hours
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
