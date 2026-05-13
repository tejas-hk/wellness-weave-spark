import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
}

export default function MetricCard({ icon, label, value, unit, trend }: MetricCardProps) {
  return (
    <div className="glass-card p-5 flex items-center gap-4 group hover:glow-border transition-all duration-300">
      <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold text-foreground">
            {value}
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </p>
          {trend && (
            <span>
              {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-chart-green" />}
              {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-chart-rose" />}
              {trend === "neutral" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
