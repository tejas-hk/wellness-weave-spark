import { AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";

interface InsightsPanelProps {
  dayToDayInsights: string[];
  longTermInsights: string[];
}

export default function InsightsPanel({ dayToDayInsights, longTermInsights }: InsightsPanelProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-chart-amber" />
          <h3 className="text-base font-semibold text-foreground">Day-to-Day Evaluation</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Specific dates where unusual values were detected.
        </p>
        <div className="space-y-2">
          {dayToDayInsights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-chart-amber/5 border border-chart-amber/10 hover:border-chart-amber/20 transition-colors"
            >
              <Lightbulb className="h-4 w-4 text-chart-amber mt-0.5 shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Long-Term Trends</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Weekly and monthly patterns in your health data.
        </p>
        <div className="space-y-2">
          {longTermInsights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/20 transition-colors"
            >
              <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
