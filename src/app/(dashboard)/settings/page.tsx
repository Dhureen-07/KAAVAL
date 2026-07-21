"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldAlert, Bell, Eye, Database, Lock } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your KAAVAL environment and intelligence preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              Intelligence Engine Configuration
            </CardTitle>
            <CardDescription>Adjust the sensitivity and data sources for the AI Assistant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Live SCRB Database Link</p>
                  <p className="text-sm text-muted-foreground">Pull real-time FIR data across all districts.</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Strict Privacy Mode</p>
                  <p className="text-sm text-muted-foreground">Anonymize citizen names in predictive analytics.</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Appearance & Alerts
            </CardTitle>
            <CardDescription>Manage how the dashboard looks and notifies you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">High Priority Push Alerts</p>
                  <p className="text-sm text-muted-foreground">Receive immediate notifications for predicted hotspots.</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-muted-foreground rounded-full absolute left-1 top-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
