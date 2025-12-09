import { Layout } from "@/components/layout/Layout";
import { ChannelsShowcase } from "@/components/channels/ChannelsShowcase";

export default function Channels() {
  return (
    <Layout>
      {/* Red gradient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial" />
        
        <div 
          className="absolute -top-20 right-0 w-[700px] h-[500px] rounded-full blur-[200px] opacity-70"
          style={{ background: 'hsl(0 65% 45% / 0.25)' }}
        />
        <div 
          className="absolute -top-10 -left-20 w-[400px] h-[350px] rounded-full blur-[150px] opacity-50"
          style={{ background: 'hsl(5 60% 42% / 0.2)' }}
        />
        
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.7' numOctaves='1' seed='15' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      <div className="relative w-full px-6 md:px-10 lg:px-16 pt-18">
        <ChannelsShowcase />
      </div>
    </Layout>
  );
}
