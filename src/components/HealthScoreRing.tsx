import { useMemo } from "react";

interface HealthScoreRingProps {
  score: number;
}

export default function HealthScoreRing({ score }: HealthScoreRingProps) {
  const { color, glowColor, label } = useMemo(() => {
    if (score >= 80) return { color: "hsl(var(--health-excellent))", glowColor: "hsl(152, 55%, 48%)", label: "Excellent" };
    if (score >= 60) return { color: "hsl(var(--health-good))", glowColor: "hsl(174, 60%, 42%)", label: "Good" };
    if (score >= 40) return { color: "hsl(var(--health-average))", glowColor: "hsl(38, 92%, 55%)", label: "Average" };
    return { color: "hsl(var(--health-poor))", glowColor: "hsl(0, 72%, 55%)", label: "Risk" };
  }, [score]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 pulse-ring">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(220, 20%, 16%)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{score}</span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      <span className="text-sm font-semibold" style={{ color, textShadow: `0 0 8px ${glowColor}` }}>{label}</span>
    </div>
  );
}
