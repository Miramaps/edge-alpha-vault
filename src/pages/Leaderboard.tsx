import { Layout } from "@/components/layout/Layout";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

export default function Leaderboard() {
  return (
    <Layout>
      {/* Simplified background for performance */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial" />
      </div>

      <div className="relative px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <LeaderboardTable />
      </div>
    </Layout>
  );
}
