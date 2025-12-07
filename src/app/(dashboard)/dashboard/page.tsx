"use client";

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText, Plus, Clock, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock data - will be replaced with real data from Supabase
  const stats = [
    { name: "Total RAMS", value: "12", icon: FileText, color: "text-emerald-400" },
    { name: "In Progress", value: "3", icon: Clock, color: "text-amber-400" },
    { name: "Completed", value: "8", icon: CheckCircle, color: "text-green-400" },
    { name: "This Month", value: "2/2", icon: TrendingUp, color: "text-teal-400" },
  ];

  const recentRAMS = [
    { id: "1", title: "Office Refurbishment - Level 3", status: "draft", updatedAt: "2 hours ago" },
    { id: "2", title: "Roof Replacement - Building A", status: "complete", updatedAt: "1 day ago" },
    { id: "3", title: "Electrical Installation - New Wing", status: "draft", updatedAt: "3 days ago" },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle="Welcome back! Here's your RAMS overview." />

      <div className="flex-1 p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <Link href="/builder/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New RAMS
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.name} variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent RAMS */}
          <div className="lg:col-span-2">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Your most recently edited RAMS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRAMS.map((rams) => (
                    <Link
                      key={rams.id}
                      href={`/builder/${rams.id}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{rams.title}</p>
                          <p className="text-sm text-muted-foreground">{rams.updatedAt}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rams.status === "complete"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {rams.status === "complete" ? "Complete" : "Draft"}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link href="/documents">
                  <Button variant="ghost" className="w-full mt-4">
                    View all documents
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Usage & Tips */}
          <div className="space-y-6">
            {/* Usage */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Monthly Usage</CardTitle>
                <CardDescription>Free tier: 2 RAMS per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">RAMS Created</span>
                    <span className="font-medium">2 / 2</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
                  </div>
                  <p className="text-sm text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Monthly limit reached
                  </p>
                  <Link href="/subscription">
                    <Button variant="gradient" className="w-full">
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Drag trade widgets onto the canvas to build your scope
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Complete all CDM fields for regulatory compliance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Use AI generation to create method statements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Export to Word when ready for submission
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
