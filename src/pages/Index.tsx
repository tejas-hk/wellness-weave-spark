import { useState, useCallback, useEffect } from "react";
import {
  Activity, BarChart3, Brain, LogOut, User, MessageCircle,
  History, Plus, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import HealthForm from "@/components/HealthForm";
import DashboardCharts from "@/components/DashboardCharts";
import InsightsPanel from "@/components/InsightsPanel";
import HealthScoreRing from "@/components/HealthScoreRing";
import HealthChatbot from "@/components/HealthChatbot";
import HealthHistory from "@/components/HealthHistory";
import MetricCard from "@/components/MetricCard";
import {
  getHealthData, generateSampleData, saveHealthData,
  generateDayToDayInsights, generateLongTermInsights, calculateHealthScore,
  type HealthEntry,
} from "@/lib/healthData";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "input", label: "Add Data", icon: Plus },
  { id: "insights", label: "Insights", icon: Brain },
  { id: "history", label: "History", icon: History },
  { id: "chatbot", label: "Chatbot", icon: MessageCircle },
];

function getTrend(data: HealthEntry[], key: keyof HealthEntry): "up" | "down" | "neutral" {
  if (data.length < 7) return "neutral";
  const recent = data.slice(-3);
  const prev = data.slice(-6, -3);
  const avgR = recent.reduce((s, d) => s + (Number(d[key]) || 0), 0) / recent.length;
  const avgP = prev.reduce((s, d) => s + (Number(d[key]) || 0), 0) / prev.length;
  if (avgR > avgP * 1.05) return "up";
  if (avgR < avgP * 0.95) return "down";
  return "neutral";
}

export default function Index() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<HealthEntry[]>([]);
  const [tab, setTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const refresh = useCallback(() => setData(getHealthData()), []);

  useEffect(() => {
    const existing = getHealthData();
    if (existing.length === 0) {
      const sample = generateSampleData();
      saveHealthData(sample);
      setData(sample);
    } else {
      setData(existing);
    }
  }, []);

  const recent = data.slice(-7);
  const avgSteps = recent.length ? Math.round(recent.reduce((s, d) => s + d.steps, 0) / recent.length) : 0;
  const avgSleep = recent.length ? (recent.reduce((s, d) => s + d.sleepHours, 0) / recent.length).toFixed(1) : "0";
  const avgHR = recent.length ? Math.round(recent.reduce((s, d) => s + d.heartRate, 0) / recent.length) : 0;
  const avgWater = recent.length ? (recent.reduce((s, d) => s + d.waterIntake, 0) / recent.length).toFixed(1) : "0";

  const score = calculateHealthScore(data);
  const dayToDayInsights = generateDayToDayInsights(data);
  const longTermInsights = generateLongTermInsights(data);

  const TrendIcon = ({ dir }: { dir: "up" | "down" | "neutral" }) => {
    if (dir === "up") return <TrendingUp className="h-3.5 w-3.5 text-chart-green" />;
    if (dir === "down") return <TrendingDown className="h-3.5 w-3.5 text-chart-rose" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return (
          <div className="space-y-6 page-enter">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="col-span-2 lg:col-span-1">
                <div className="glass-card p-5 flex flex-col items-center justify-center h-full glow-border">
                  <HealthScoreRing score={score} />
                </div>
              </div>
              <MetricCard icon="👟" label="Avg Steps" value={avgSteps.toLocaleString()} unit="/day" trend={getTrend(data, "steps")} />
              <MetricCard icon="😴" label="Avg Sleep" value={avgSleep} unit="hrs" trend={getTrend(data, "sleepHours")} />
              <MetricCard icon="💓" label="Avg Heart Rate" value={avgHR} unit="bpm" trend={getTrend(data, "heartRate")} />
              <MetricCard icon="💧" label="Avg Water" value={avgWater} unit="L" trend={getTrend(data, "waterIntake")} />
            </div>
            <DashboardCharts data={data} />
          </div>
        );
      case "input":
        return (
          <div className="max-w-2xl mx-auto page-enter">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">Log Health Data</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter your daily health metrics below.</p>
              <HealthForm onDataAdded={() => { refresh(); setTab("dashboard"); }} />
            </div>
          </div>
        );
      case "insights":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 page-enter">
            <div className="md:col-span-2 glass-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" /> AI Insights
              </h2>
              <p className="text-sm text-muted-foreground mb-5">Pattern-based analysis of your recent health data.</p>
              <InsightsPanel dayToDayInsights={dayToDayInsights} longTermInsights={longTermInsights} />
            </div>
            <div className="glass-card p-6 flex flex-col items-center justify-center glow-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Health Score</h2>
              <HealthScoreRing score={score} />
              <p className="text-xs text-muted-foreground mt-4 text-center max-w-[200px]">
                Based on sleep, activity, heart rate, and calorie balance over the past week.
              </p>
            </div>
          </div>
        );
      case "history":
        return <div className="page-enter"><HealthHistory data={data} /></div>;
      case "chatbot":
        return <div className="page-enter"><HealthChatbot /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="animated-grid" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full z-20 flex flex-col border-r transition-all duration-300 ${
            collapsed ? "w-[72px]" : "w-[240px]"
          }`}
          style={{
            background: "hsl(220 25% 7% / 0.8)",
            backdropFilter: "blur(20px)",
            borderColor: "hsl(220 20% 15% / 0.6)",
          }}
        >
          {/* Logo */}
          <div className="p-4 flex items-center gap-3 border-b border-border/50">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0 neon-glow">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-sm font-bold text-foreground neon-text">HealthPulse</h1>
                <p className="text-[10px] text-muted-foreground">AI Health Dashboard</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`sidebar-item w-full ${tab === item.id ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User & collapse */}
          <div className="p-3 border-t border-border/50 space-y-2">
            {!collapsed && (
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground truncate">{user}</span>
              </div>
            )}
            <div className={`flex ${collapsed ? "flex-col items-center" : "items-center"} gap-1`}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const sample = generateSampleData();
                  saveHealthData(sample);
                  refresh();
                }}
                className="text-muted-foreground hover:text-foreground text-xs flex-1"
                title="Reset Demo"
              >
                {collapsed ? "↻" : "Reset Demo"}
              </Button>
              <Button size="sm" variant="ghost" onClick={logout} className="text-muted-foreground hover:text-destructive" title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-[240px]"}`}
        >
          {/* Top bar */}
          <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
            style={{ background: "hsl(220 20% 6% / 0.5)", backdropFilter: "blur(12px)" }}
          >
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {navItems.find((n) => n.id === tab)?.label}
              </h2>
              <p className="text-xs text-muted-foreground">Welcome back, {user}</p>
            </div>
          </header>

          <div className="p-6 max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
