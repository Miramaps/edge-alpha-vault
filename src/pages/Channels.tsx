import { Layout } from "@/components/layout/Layout";
import { ChannelsShowcase } from "@/components/channels/ChannelsShowcase";

export default function Channels() {
  return (
    <Layout>
      {/* Simplified background for performance */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial" />
      </div>

      <div className="relative w-full px-6 md:px-10 lg:px-16 pt-18">
        <ChannelsShowcase />
      </div>
    </Layout>
  );
}
