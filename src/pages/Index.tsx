import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ChannelsShowcase } from "@/components/channels/ChannelsShowcase";

const Index = () => {
  return (
    <Layout>
      {/* Background image */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <img 
          src="/bg.jpg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
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
