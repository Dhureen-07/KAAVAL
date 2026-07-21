import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { LayoutDashboard, MessageSquare, PieChart, Network, Map, TrendingUp, FileText, History, Bell, User, Settings, ShieldAlert, Mic, Video } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "AI Assistant", url: "/assistant", icon: MessageSquare },
  { title: "Voice-to-FIR", url: "/voice-fir", icon: Mic },
  { title: "Live Surveillance", url: "/surveillance", icon: Video },
  { title: "Analytics", url: "/analytics", icon: PieChart },
  { title: "Network Analysis", url: "/network", icon: Network },
  { title: "Heatmaps", url: "/heatmaps", icon: Map },
  { title: "Predictive Intel", url: "/predictive", icon: TrendingUp },
  { title: "Reports", url: "/reports", icon: FileText },
]

const userItems = [
  { title: "History", url: "/history", icon: History },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border bg-background/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <ShieldAlert className="h-6 w-6" />
          <span>KAAVAL</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider">Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />} tooltip={item.title} className="hover:bg-primary/10 hover:text-primary transition-colors">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider">User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />} tooltip={item.title} className="hover:bg-primary/10 hover:text-primary transition-colors">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            SP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Officer Name</span>
            <span className="text-xs text-muted-foreground">Superintendent</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
