import { Layout } from "@/components/layout/Layout";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

export default function Leaderboard() {
  return (
    <Layout>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none opacity-50" />

      <div className="container relative mx-auto px-4 py-12 md:py-16">
        <LeaderboardTable />
      </div>
    </Layout>
  );
}
