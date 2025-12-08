import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { SocialLinksRow } from "@/components/home/SocialLinksRow";
import { ChannelsShowcase } from "@/components/channels/ChannelsShowcase";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { WidgetPanel } from "@/components/widgets/WidgetPanel";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <SocialLinksRow />
      
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

        {/* Leaderboard Section */}
        <section className="py-16 md:py-24 border-t border-border/30">
          <LeaderboardTable limit={10} />
        </section>
      </div>
    </Layout>
  );
};

export default Index;
