import Link from "next/link"
import { ShieldAlert, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl text-primary z-20">
        <ShieldAlert className="h-6 w-6" />
        <span>KAAVAL</span>
      </Link>

      <Card className="w-full max-w-md glass-panel border-border/50 relative z-10">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Authorized Access</CardTitle>
          <CardDescription>
            Enter your credentials to access the command center.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="id">
              Officer ID or Email
            </label>
            <Input id="id" placeholder="KA-0000" className="bg-background/50 border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
            <Input id="password" type="password" className="bg-background/50 border-border" />
          </div>
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium leading-none">Role Selection</label>
            <select className="flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option>Officer</option>
              <option>Inspector</option>
              <option>DSP</option>
              <option>SP</option>
              <option>IGP</option>
              <option>SCRB Admin</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col pt-4">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium">
              Authenticate
            </Button>
          </Link>
          <p className="mt-4 text-xs text-center text-muted-foreground">
            By logging in, you agree to the Government of Karnataka's strict data usage policies and audit tracking.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
