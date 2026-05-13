export interface HealthEntry {
  id: string;
  date: string;
  steps: number;
  sleepHours: number;
  heartRate: number;
  caloriesIntake: number;
  waterIntake: number;
  weight?: number;
}

const BASE_KEY = "health-data";

function storageKey(): string {
  const user = localStorage.getItem("health-session");
  return user ? `${BASE_KEY}__${user}` : BASE_KEY;
}

export function getHealthData(): HealthEntry[] {
  const raw = localStorage.getItem(storageKey());
  return raw ? JSON.parse(raw) : [];
}

export function saveHealthData(data: HealthEntry[]) {
  localStorage.setItem(storageKey(), JSON.stringify(data));
}

export function addHealthEntry(entry: Omit<HealthEntry, "id">) {
  const data = getHealthData();
  const existing = data.findIndex((e) => e.date === entry.date);
  const newEntry = { ...entry, id: crypto.randomUUID() };
  if (existing >= 0) {
    data[existing] = { ...newEntry, id: data[existing].id };
  } else {
    data.push(newEntry);
  }
  data.sort((a, b) => a.date.localeCompare(b.date));
  saveHealthData(data);
  return data;
}

export function generateSampleData(): HealthEntry[] {
  const data: HealthEntry[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      id: crypto.randomUUID(),
      date: d.toISOString().split("T")[0],
      steps: Math.round(4000 + Math.random() * 10000),
      sleepHours: +(4.5 + Math.random() * 4.5).toFixed(1),
      heartRate: Math.round(58 + Math.random() * 40),
      caloriesIntake: Math.round(1400 + Math.random() * 1200),
      waterIntake: +(1 + Math.random() * 3).toFixed(1),
      weight: +(68 + Math.random() * 5).toFixed(1),
    });
  }
  return data;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

export function generateDayToDayInsights(data: HealthEntry[]): string[] {
  if (data.length < 3) return ["Add more data to generate day-to-day insights."];
  const insights: string[] = [];

  const avgCal = data.reduce((s, d) => s + d.caloriesIntake, 0) / data.length;
  const avgSteps = data.reduce((s, d) => s + d.steps, 0) / data.length;
  const avgHR = data.reduce((s, d) => s + d.heartRate, 0) / data.length;

  // High calorie days
  data.forEach((d) => {
    if (d.caloriesIntake > avgCal * 1.25)
      insights.push(`🍔 Calorie intake was higher than normal on ${formatDate(d.date)} (${d.caloriesIntake} kcal vs avg ${Math.round(avgCal)} kcal).`);
  });

  // Low sleep days
  data.forEach((d) => {
    if (d.sleepHours < 6)
      insights.push(`😴 Sleep duration was low on ${formatDate(d.date)} (${d.sleepHours} hrs).`);
  });

  // Unusual heart rate
  data.forEach((d) => {
    if (d.heartRate > avgHR * 1.25)
      insights.push(`💓 Heart rate was unusually high on ${formatDate(d.date)} (${d.heartRate} bpm vs avg ${Math.round(avgHR)} bpm).`);
    else if (d.heartRate < avgHR * 0.75)
      insights.push(`💓 Heart rate was unusually low on ${formatDate(d.date)} (${d.heartRate} bpm vs avg ${Math.round(avgHR)} bpm).`);
  });

  // Low step days
  data.forEach((d) => {
    if (d.steps < avgSteps * 0.5)
      insights.push(`👟 Step count was significantly lower on ${formatDate(d.date)} (${d.steps.toLocaleString()} steps vs avg ${Math.round(avgSteps).toLocaleString()}).`);
  });

  // Low water days
  data.forEach((d) => {
    if (d.waterIntake < 1.5)
      insights.push(`💧 Water intake was very low on ${formatDate(d.date)} (${d.waterIntake}L).`);
  });

  if (insights.length === 0) insights.push("✅ No unusual values detected in your recent data. Great consistency!");
  return insights.slice(-15); // cap to avoid overwhelming UI
}

export function generateLongTermInsights(data: HealthEntry[]): string[] {
  if (data.length < 7) return ["Add at least 7 days of data for long-term trend analysis."];
  const insights: string[] = [];

  const recent7 = data.slice(-7);
  const previous7 = data.slice(-14, -7);

  const avg = (arr: HealthEntry[], key: keyof HealthEntry) =>
    arr.reduce((s, d) => s + (Number(d[key]) || 0), 0) / arr.length;

  // Sleep trend
  const recentSleep = avg(recent7, "sleepHours");
  if (previous7.length >= 3) {
    const prevSleep = avg(previous7, "sleepHours");
    if (recentSleep < prevSleep * 0.9)
      insights.push(`📉 Your average sleep decreased this week (${recentSleep.toFixed(1)} hrs vs ${prevSleep.toFixed(1)} hrs previously).`);
    else if (recentSleep > prevSleep * 1.1)
      insights.push(`📈 Your average sleep improved this week (${recentSleep.toFixed(1)} hrs vs ${prevSleep.toFixed(1)} hrs previously).`);
  }

  // Steps trend
  const recentSteps = avg(recent7, "steps");
  if (previous7.length >= 3) {
    const prevSteps = avg(previous7, "steps");
    if (recentSteps > prevSteps * 1.15)
      insights.push(`📈 Step count improved over the last 7 days (${Math.round(recentSteps).toLocaleString()} avg vs ${Math.round(prevSteps).toLocaleString()} previously).`);
    else if (recentSteps < prevSteps * 0.85)
      insights.push(`📉 Physical activity declined this week (${Math.round(recentSteps).toLocaleString()} avg steps vs ${Math.round(prevSteps).toLocaleString()}).`);
  }

  // Calorie trend
  const recentCal = avg(recent7, "caloriesIntake");
  if (recentCal > 2200)
    insights.push(`🍔 Calorie intake is higher than recommended this week (${Math.round(recentCal)} kcal/day avg).`);
  if (previous7.length >= 3) {
    const prevCal = avg(previous7, "caloriesIntake");
    if (recentCal > prevCal * 1.15)
      insights.push(`📈 Calorie intake has been trending upward compared to the previous week.`);
    else if (recentCal < prevCal * 0.85)
      insights.push(`📉 Calorie intake decreased compared to the previous week — nice control!`);
  }

  // Heart rate trend
  const recentHR = avg(recent7, "heartRate");
  if (previous7.length >= 3) {
    const prevHR = avg(previous7, "heartRate");
    if (recentHR > prevHR * 1.1)
      insights.push(`💓 Average heart rate increased this week (${Math.round(recentHR)} bpm vs ${Math.round(prevHR)} bpm).`);
    else if (recentHR < prevHR * 0.9)
      insights.push(`💓 Average heart rate decreased this week (${Math.round(recentHR)} bpm vs ${Math.round(prevHR)} bpm).`);
  }

  // Water trend
  const recentWater = avg(recent7, "waterIntake");
  if (recentWater < 2)
    insights.push(`💧 Average water intake this week is below 2L/day (${recentWater.toFixed(1)}L). Stay hydrated!`);

  // Weekly summary
  insights.push(`📊 Weekly summary: ${Math.round(recentSteps).toLocaleString()} avg steps, ${recentSleep.toFixed(1)} hrs sleep, ${Math.round(recentHR)} bpm HR, ${Math.round(recentCal)} kcal intake.`);

  if (insights.length === 1) insights.unshift("👍 Your health metrics are stable with no significant trends detected.");
  return insights;
}

// Keep legacy function for backward compat
export function generateInsights(data: HealthEntry[]): string[] {
  return [...generateDayToDayInsights(data), ...generateLongTermInsights(data)];
}

export function calculateHealthScore(data: HealthEntry[]): number {
  if (data.length === 0) return 0;
  const recent = data.slice(-7);

  // Sleep score (0-25): 7-9 hours is ideal
  const avgSleep = recent.reduce((s, d) => s + d.sleepHours, 0) / recent.length;
  const sleepScore = avgSleep >= 7 && avgSleep <= 9 ? 25 : avgSleep >= 6 ? 18 : avgSleep >= 5 ? 10 : 5;

  // Steps score (0-25): 8000+ is great
  const avgSteps = recent.reduce((s, d) => s + d.steps, 0) / recent.length;
  const stepsScore = avgSteps >= 10000 ? 25 : avgSteps >= 8000 ? 22 : avgSteps >= 5000 ? 15 : avgSteps >= 3000 ? 8 : 3;

  // Heart rate score (0-25): 60-80 resting is ideal
  const avgHR = recent.reduce((s, d) => s + d.heartRate, 0) / recent.length;
  const hrScore = avgHR >= 55 && avgHR <= 80 ? 25 : avgHR <= 90 ? 18 : avgHR <= 100 ? 10 : 5;

  // Calorie balance (0-25): 1600-2200 range
  const avgCal = recent.reduce((s, d) => s + d.caloriesIntake, 0) / recent.length;
  const calScore = avgCal >= 1600 && avgCal <= 2200 ? 25 : avgCal >= 1400 && avgCal <= 2500 ? 18 : 8;

  return Math.min(100, sleepScore + stepsScore + hrScore + calScore);
}
