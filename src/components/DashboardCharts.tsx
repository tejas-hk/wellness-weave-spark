import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import type { HealthEntry } from "@/lib/healthData";

interface Props {
  data: HealthEntry[];
}

const chartColors = {
  blue: "hsl(190, 90%, 50%)",
  green: "hsl(152, 55%, 48%)",
  teal: "hsl(174, 60%, 42%)",
  amber: "hsl(38, 92%, 55%)",
  rose: "hsl(350, 70%, 56%)",
  purple: "hsl(270, 60%, 60%)",
};

const gridColor = "hsl(220, 20%, 18%)";
const tickStyle = { fontSize: 11, fill: "hsl(220, 15%, 55%)" };

const customTooltipStyle = {
  backgroundColor: "hsl(220, 25%, 12%)",
  border: "1px solid hsl(190, 90%, 50%, 0.2)",
  borderRadius: "8px",
  boxShadow: "0 0 20px hsl(190, 90%, 50%, 0.1)",
};

function formatDate(d: string) {
  return format(parseISO(d), "MMM d");
}

export default function DashboardCharts({ data }: Props) {
  const chartData = useMemo(
    () => data.map((d) => ({ ...d, label: formatDate(d.date) })),
    [data]
  );

  const charts = [
    {
      title: "👟 Steps per Day",
      chart: (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.blue} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColors.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Area type="monotone" dataKey="steps" stroke={chartColors.blue} fill="url(#stepsGrad)" strokeWidth={2} dot={{ fill: chartColors.blue, r: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "😴 Sleep Hours",
      chart: (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.teal} stopOpacity={0.9} />
                <stop offset="100%" stopColor={chartColors.teal} stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Bar dataKey="sleepHours" fill="url(#sleepGrad)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "💓 Heart Rate Trend",
      chart: (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.rose} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.rose} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Area type="monotone" dataKey="heartRate" stroke={chartColors.rose} fill="url(#hrGrad)" strokeWidth={2} dot={{ fill: chartColors.rose, r: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "🔥 Calories Intake",
      chart: (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.amber} stopOpacity={0.9} />
                <stop offset="100%" stopColor={chartColors.amber} stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Bar dataKey="caloriesIntake" fill="url(#calGrad)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {charts.map((c) => (
        <div key={c.title} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">{c.title}</h3>
          {c.chart}
        </div>
      ))}
    </div>
  );
}
