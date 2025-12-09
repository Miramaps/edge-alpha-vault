import { Layout } from "@/components/layout/Layout";
import { useWalletAddress } from "@/contexts/WalletAddressContext";
import { Navigate } from "react-router-dom";
import { Wallet, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationCard } from "@/components/verification/VerificationCard";

export default function Dashboard() {
  const { address } = useWalletAddress();

  if (!address) {
    return <Navigate to="/" replace />;
  }

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
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your account and subscriptions</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <Card className="bg-black/40 border-white/[0.08]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Active Subscriptions
              </CardTitle>
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-1.5">
              <div className="text-xl font-bold text-white">0</div>
              <p className="text-[10px] text-muted-foreground">No active channels</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/[0.08]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-1.5">
              <div className="text-xl font-bold text-white">0 EDGE</div>
              <p className="text-[10px] text-muted-foreground">Lifetime spending</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/[0.08]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Wallet Balance
              </CardTitle>
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-1.5">
              <div className="text-xl font-bold text-white">—</div>
              <p className="text-[10px] text-muted-foreground">EDGE tokens</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/[0.08]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Performance
              </CardTitle>
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-1.5">
              <div className="text-xl font-bold text-white">—</div>
              <p className="text-[10px] text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <Card className="bg-black/40 border-white/[0.08]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">My Subscriptions</CardTitle>
              <CardDescription className="text-xs">Manage your channel subscriptions</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No active subscriptions</p>
                <a href="/channels" className="text-accent hover:underline mt-1 inline-block text-xs">
                  Browse channels →
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/[0.08]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Recent Activity</CardTitle>
              <CardDescription className="text-xs">Your recent transactions and actions</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No recent activity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Card */}
        <VerificationCard />
      </div>
    </Layout>
  );
}

