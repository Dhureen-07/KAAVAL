"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Filter, Search } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    { id: "FIR-2026-892", type: "Burglary", location: "Mysuru", date: "2026-07-09", status: "Active" },
    { id: "FIR-2026-891", type: "Vehicle Theft", location: "Bengaluru", date: "2026-07-08", status: "Closed" },
    { id: "INT-2026-042", type: "Network Analysis", location: "Mangaluru", date: "2026-07-08", status: "Active" },
    { id: "FIR-2026-889", type: "Cyber Fraud", location: "Hubballi", date: "2026-07-05", status: "Active" },
  ]

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Official Reports</h1>
          <p className="text-muted-foreground mt-1">Access generated FIRs and Intelligence Dossiers.</p>
        </div>
        <button className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border border-primary/30">
          <Download className="w-4 h-4" /> Export Batch
        </button>
      </div>

      <Card className="glass-panel border-border/50 flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-card/50 flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Document Archive</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search ID or Keyword..." className="bg-background/50 border border-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <button className="p-2 border border-border rounded-md hover:bg-background transition-colors">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-card/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Document ID</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Date Issued</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4" /> {report.id}
                  </td>
                  <td className="px-6 py-4">{report.type}</td>
                  <td className="px-6 py-4 text-muted-foreground">{report.location}</td>
                  <td className="px-6 py-4 font-mono text-xs">{report.date}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      report.status === 'Active' ? 'bg-warning/20 text-warning border border-warning/30' : 'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
