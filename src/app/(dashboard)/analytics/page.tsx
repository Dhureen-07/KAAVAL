"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const lineData = [
  { name: "Jan", theft: 400, assault: 240, cyber: 100 },
  { name: "Feb", theft: 300, assault: 139, cyber: 120 },
  { name: "Mar", theft: 200, assault: 380, cyber: 150 },
  { name: "Apr", theft: 278, assault: 390, cyber: 200 },
  { name: "May", theft: 189, assault: 480, cyber: 250 },
  { name: "Jun", theft: 239, assault: 380, cyber: 300 },
]

const pieData = [
  { name: "Bengaluru Urban", value: 400 },
  { name: "Mysuru", value: 300 },
  { name: "Hubballi-Dharwad", value: 300 },
  { name: "Mangaluru", value: 200 },
]
const COLORS = ["#6D5DF6", "#4EA8FF", "#18C67A", "#F9B115"]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crime Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into statewide crime statistics and historical data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Crime Trends (Last 6 Months)</CardTitle>
            <CardDescription>Major categories comparison</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 8, 22, 0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="theft" stroke="#6D5DF6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="assault" stroke="#FF5B6E" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="cyber" stroke="#4EA8FF" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle>District Distribution</CardTitle>
            <CardDescription>Active cases by major hubs</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 8, 22, 0.9)', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2 glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Monthly Clearances</CardTitle>
            <CardDescription>Cases solved vs reported</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 8, 22, 0.9)', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Legend />
                <Bar dataKey="theft" fill="#6D5DF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assault" fill="#18C67A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
