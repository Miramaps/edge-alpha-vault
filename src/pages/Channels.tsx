import { Layout } from "@/components/layout/Layout";
import { ChannelsShowcase } from "@/components/channels/ChannelsShowcase";

export default function Channels() {
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

      <div className="relative w-full px-6 md:px-10 lg:px-16 pt-18">
        <ChannelsShowcase />
      </div>
    </Layout>
  );
}
