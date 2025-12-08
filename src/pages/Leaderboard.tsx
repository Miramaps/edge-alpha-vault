import { Layout } from "@/components/layout/Layout";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

export default function Leaderboard() {
  return (
    <Layout>
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none opacity-30" />

      <div className="relative px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <LeaderboardTable />
      </div>
    </Layout>
  );
}
