import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockApplications, Application, ApplicationStatus } from "@/data/mockApplications";
import {
  CheckCircle2,
  Clock3,
  Filter,
  Mail,
  Search,
  Users,
  XCircle,
  Activity,
  BarChart3,
  Eye,
  ExternalLink,
  Copy,
  Wallet,
  Hash,
  MessageCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

type ActivityEvent = {
  id: string;
  message: string;
  ts: string;
  tone: "approve" | "reject" | "info";
};

const ADMIN_TOKEN = "edge_admin_authed";
const ADMIN_PASSWORD = "admin"; // simple gate per request

export default function Admin() {
  const [authed, setAuthed] = useState<boolean>(
    () => localStorage.getItem(ADMIN_TOKEN) === "true"
  );
  const [password, setPassword] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(() => 180 + Math.floor(Math.random() * 40));
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("pending");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([
    {
      id: "evt-1",
      message: "DeFi Radar was approved",
      ts: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      tone: "approve",
    },
    {
      id: "evt-2",
      message: "Event Horizon was rejected",
      ts: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      tone: "reject",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const jitter = Math.floor(Math.random() * 15) - 7;
        const next = Math.min(420, Math.max(80, prev + jitter));
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const metrics = useMemo(() => {
    const pending = applications.filter((a) => a.status === "pending").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const total = applications.length || 1;
    const conversion = Math.round((approved / total) * 100);
    return { pending, approved, rejected, conversion };
  }, [applications]);

  const filtered = useMemo(() => {
    return applications
      .filter((app) =>
        statusFilter === "all" ? true : app.status === statusFilter
      )
      .filter((app) => {
        const q = search.toLowerCase();
        return (
          app.channelName.toLowerCase().includes(q) ||
          app.twitterHandle.toLowerCase().includes(q) ||
          app.discordHandle.toLowerCase().includes(q) ||
          app.markets.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.submittedAt > b.submittedAt ? -1 : 1));
  }, [applications, search, statusFilter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_TOKEN, "true");
      setAuthed(true);
    } else {
      setPassword("");
      alert("Invalid password");
    }
  };

  const updateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    setActivity((prev) => [
      {
        id: `evt-${Date.now()}`,
        message: `${applications.find((a) => a.id === id)?.channelName || "Application"} was ${
          status === "approved" ? "approved" : "rejected"
        }`,
        ts: new Date().toISOString(),
        tone: status === "approved" ? "approve" : "reject",
      },
      ...prev,
    ]);
  };

  if (!authed) {
    return (
      <Layout>
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <img src="/bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md bg-black/50 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">Admin Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter the admin password to access the dashboard.
              </p>
              <form onSubmit={handleLogin} className="space-y-3">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/40 border-white/10"
                />
                <Button type="submit" className="w-full" variant="hero">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <img src="/bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-1">Admin</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Application Control
            </h1>
            <p className="text-sm text-soft-muted">
              Review submissions, approve channels, and monitor live activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-black/50 border border-white/10 px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs text-muted-foreground leading-none">Live visitors</p>
                <p className="text-base font-semibold text-white">{onlineUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-3 md:grid-cols-4">
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{metrics.pending}</p>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </div>
              <Clock3 className="w-5 h-5 text-accent" />
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{metrics.approved}</p>
                <p className="text-xs text-muted-foreground">Live channels</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Conversion</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{metrics.conversion}%</p>
                <p className="text-xs text-muted-foreground">Approval rate</p>
              </div>
              <BarChart3 className="w-5 h-5 text-sky-400" />
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active now</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{onlineUsers}</p>
                <p className="text-xs text-muted-foreground">Real-time visitors</p>
              </div>
              <Activity className="w-5 h-5 text-amber-300" />
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search channels or traders"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-black/40 border-white/10 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={statusFilter === "pending" ? "hero" : "outline"}
                className="gap-2"
                onClick={() => setStatusFilter("pending")}
              >
                <Clock3 className="w-4 h-4" />
                Pending
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "approved" ? "hero" : "outline"}
                onClick={() => setStatusFilter("approved")}
              >
                Approved
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "rejected" ? "hero" : "outline"}
                onClick={() => setStatusFilter("rejected")}
              >
                Rejected
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "all" ? "hero" : "ghost"}
                onClick={() => setStatusFilter("all")}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                All
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Conversion = Approved / Total submissions
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Applications table */}
          <Card className="lg:col-span-2 bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Applications</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Approve or reject trader channel submissions.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto">
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow className="border-white/5">
                      <TableHead>Trader</TableHead>
                      <TableHead>Markets</TableHead>
                      <TableHead>Max Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((app) => (
                      <TableRow
                        key={app.id}
                        className="border-white/5 hover:bg-white/5/40 transition-colors"
                      >
                        <TableCell className="py-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-white/10">
                              {app.profileImage && <AvatarImage src={app.profileImage} alt={app.channelName} />}
                              <AvatarFallback className="bg-white/10 text-[10px] text-white">
                                {app.channelName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-white leading-tight">
                                {app.channelName}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <a
                                  href={`https://twitter.com/${app.twitterHandle.replace("@", "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-accent transition-colors flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {app.twitterHandle}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <span>•</span>
                                <span>{app.discordHandle}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-sm text-muted-foreground">{app.markets}</TableCell>
                        <TableCell className="py-2 text-sm text-muted-foreground">{app.maxMembers}</TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant={
                              app.status === "approved"
                                ? "default"
                                : app.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="capitalize px-2 py-0.5 text-[11px]"
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-sm text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(app.submittedAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="py-2 text-right w-[200px] whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 text-[11px] border-white/20 text-foreground hover:bg-white/10 hover:border-white/30 shrink-0"
                              onClick={() => setSelectedApp(app)}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="hero"
                              className="h-8 px-2.5 text-[11px] font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                              disabled={app.status === "approved"}
                              onClick={() => updateStatus(app.id, "approved")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2.5 text-[11px] font-medium border-red-500/50 text-red-300 hover:bg-red-500/20 hover:border-red-500/70 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                              disabled={app.status === "rejected"}
                              onClick={() => updateStatus(app.id, "rejected")}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar: activity + highlights */}
          <div className="space-y-4">
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="w-4 h-4 text-accent" />
                  Recent activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[260px] overflow-auto pr-1">
                {activity.map((evt) => {
                  const toneMeta =
                    evt.tone === "approve"
                      ? { label: "Approved", icon: CheckCircle2, chip: "bg-emerald-500/15 text-emerald-200" }
                      : evt.tone === "reject"
                      ? { label: "Rejected", icon: XCircle, chip: "bg-red-500/15 text-red-200" }
                      : { label: "Update", icon: Activity, chip: "bg-amber-400/15 text-amber-200" };
                  const Icon = toneMeta.icon;
                  return (
                    <div
                      key={evt.id}
                      className="flex items-start gap-3 rounded-lg bg-white/[0.04] px-3 py-2.5 border border-white/10"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${toneMeta.chip}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="uppercase tracking-wide">{toneMeta.label}</span>
                          <span className="h-1 w-1 rounded-full bg-white/30" />
                          <span>{formatDistanceToNow(new Date(evt.ts), { addSuffix: true })}</span>
                        </div>
                        <p className="text-sm text-white leading-snug">{evt.message}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Mail className="w-4 h-4 text-accent" />
                  Submission insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending responses</span>
                  <span className="text-white font-semibold">{metrics.pending}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg max seats</span>
                  <span className="text-white font-semibold">
                    {Math.round(
                      applications.reduce((sum, a) => sum + a.maxMembers, 0) / applications.length
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Approved channels</span>
                  <span className="text-emerald-300 font-semibold">{metrics.approved}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rejected</span>
                  <span className="text-red-300 font-semibold">{metrics.rejected}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Application Details Dialog */}
        <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/95 border-white/10">
            {selectedApp && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-white flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-white/20">
                      {selectedApp.profileImage && (
                        <AvatarImage src={selectedApp.profileImage} alt={selectedApp.channelName} />
                      )}
                      <AvatarFallback className="bg-white/10 text-white">
                        {selectedApp.channelName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {selectedApp.channelName}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Application submitted {formatDistanceToNow(new Date(selectedApp.submittedAt), { addSuffix: true })}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        selectedApp.status === "approved"
                          ? "default"
                          : selectedApp.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className="capitalize text-sm px-3 py-1"
                    >
                      {selectedApp.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="hero"
                        onClick={() => {
                          updateStatus(selectedApp.id, "approved");
                          setSelectedApp(null);
                        }}
                        disabled={selectedApp.status === "approved"}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/40 text-red-300 hover:bg-red-500/10"
                        onClick={() => {
                          updateStatus(selectedApp.id, "rejected");
                          setSelectedApp(null);
                        }}
                        disabled={selectedApp.status === "rejected"}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>

                  {/* Profile Image */}
                  {selectedApp.profileImage && (
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Profile Picture</Label>
                      <img
                        src={selectedApp.profileImage}
                        alt={selectedApp.channelName}
                        className="w-32 h-32 rounded-xl object-cover border border-white/10"
                      />
                    </div>
                  )}

                  <div className="h-px bg-white/10" />

                  {/* Channel Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground mb-1 block">Channel Name</Label>
                      <p className="text-white font-medium">{selectedApp.channelName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground mb-1 block">Max Members</Label>
                      <p className="text-white font-medium">{selectedApp.maxMembers}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Social Links */}
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground mb-2 block">Social Links</Label>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <Hash className="w-4 h-4 text-accent" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">X (Twitter)</Label>
                        <a
                          href={`https://twitter.com/${selectedApp.twitterHandle.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-accent transition-colors flex items-center gap-2"
                        >
                          {selectedApp.twitterHandle}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <MessageCircle className="w-4 h-4 text-accent" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Discord</Label>
                        <p className="text-white">{selectedApp.discordHandle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Markets */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1 block">Markets Traded</Label>
                    <p className="text-white font-medium">{selectedApp.markets}</p>
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Polymarket Wallet */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Polymarket Trading Wallet
                    </Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                      <code className="text-white font-mono text-sm flex-1">{selectedApp.polymarketWallet}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedApp.polymarketWallet);
                          toast.success("Wallet address copied!");
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

