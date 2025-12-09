import { Layout } from "@/components/layout/Layout";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

export default function Leaderboard() {
  return (
    <Layout>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="relative px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <LeaderboardTable />
      </div>
    </Layout>
  );
}
