"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldAlert, User, Mail, Building, Key } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Officer Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your secure credentials and SCRB access levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-border/50 md:col-span-1">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 border border-primary/30">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold">Ramesh Kumar</h2>
            <p className="text-sm text-primary font-medium mt-1">Superintendent of Police</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20">
              <ShieldAlert className="w-3 h-3" /> Level 4 Clearance
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/50 md:col-span-2">
          <CardHeader>
            <CardTitle>Official Credentials</CardTitle>
            <CardDescription>Verified by the State Crime Records Bureau.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border/50 pb-4">
              <div className="w-10 h-10 rounded bg-secondary/20 flex items-center justify-center text-secondary">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">Karnataka State Police - Cyber Division</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-b border-border/50 pb-4">
              <div className="w-10 h-10 rounded bg-secondary/20 flex items-center justify-center text-secondary">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Officer ID (KA-ID)</p>
                <p className="text-sm text-muted-foreground font-mono">KA-POL-8492-SP</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-2">
              <div className="w-10 h-10 rounded bg-secondary/20 flex items-center justify-center text-secondary">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Secure Communications</p>
                <p className="text-sm text-muted-foreground">ramesh.k@ksp.gov.in</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
