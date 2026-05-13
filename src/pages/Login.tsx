import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Activity, LogIn, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const { login, register, allUsers } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login");

  const handleSubmit = async (mode: "login" | "register") => {
    setError("");
    setLoading(true);
    const result = mode === "login" ? await login(username, password) : await register(username, password);
    setLoading(false);
    if (result.success) navigate("/");
    else setError(result.error || "Something went wrong");
  };

  const quickLogin = (name: string) => { setUsername(name); setTab("login"); };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="animated-grid" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center neon-glow">
            <Activity className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground neon-text">HealthPulse</h1>
          <p className="text-sm text-muted-foreground">AI-Powered Health Dashboard</p>
        </div>

        <div className="glass-card p-6 glow-border">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
              <TabsTrigger value="login" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <LogIn className="h-4 w-4" /> Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <UserPlus className="h-4 w-4" /> Sign Up
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-muted-foreground">Username</Label>
                  <Input
                    id="username" placeholder="Enter username"
                    value={username} onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(tab as "login" | "register")}
                    className="bg-muted/50 border-primary/20 focus:border-primary/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                  <Input
                    id="password" type="password" placeholder="Enter password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(tab as "login" | "register")}
                    className="bg-muted/50 border-primary/20 focus:border-primary/40"
                  />
                </div>
              </div>

              <TabsContent value="login" className="mt-0 pt-2">
                <Button className="w-full gradient-primary border-0 neon-glow hover:scale-[1.02] transition-transform" onClick={() => handleSubmit("login")} disabled={loading}>
                  <LogIn className="h-4 w-4 mr-2" /> {loading ? "Signing in…" : "Sign In"}
                </Button>
              </TabsContent>
              <TabsContent value="register" className="mt-0 pt-2">
                <Button className="w-full gradient-primary border-0 neon-glow hover:scale-[1.02] transition-transform" onClick={() => handleSubmit("register")} disabled={loading}>
                  <UserPlus className="h-4 w-4 mr-2" /> {loading ? "Creating account…" : "Create Account"}
                </Button>
              </TabsContent>

              {allUsers.length > 0 && (
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Users className="h-4 w-4" /> Switch to existing account
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allUsers.map((name) => (
                      <Button
                        key={name} variant="outline" size="sm"
                        onClick={() => quickLogin(name)}
                        className="text-xs bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-primary"
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
