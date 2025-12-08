import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ChannelsShowcase } from "@/components/channels/ChannelsShowcase";
import { WidgetPanel } from "@/components/widgets/WidgetPanel";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      
      {/* Main content with widgets */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Channels - 3 columns on large screens */}
          <div className="lg:col-span-3">
            <ChannelsShowcase />
          </div>

          {/* Widgets sidebar - 1 column */}
          <div className="lg:col-span-1 pt-16 md:pt-24">
            <div className="sticky top-24">
              <WidgetPanel />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
