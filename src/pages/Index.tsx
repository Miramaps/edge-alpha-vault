import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ChannelsShowcase } from "@/components/channels/ChannelsShowcase";

const Index = () => {
  return (
    <Layout>
      {/* Simplified background for performance */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial" />
      </div>

      <HeroSection />
      
      {/* Main content - full width */}
      <div className="w-full px-6 md:px-12 lg:px-16">
        <ChannelsShowcase />
      </div>
    </Layout>
  );
};

export default Index;
