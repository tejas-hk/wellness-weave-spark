import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { addHealthEntry } from "@/lib/healthData";
import { toast } from "sonner";

interface HealthFormProps {
  onDataAdded: () => void;
}

export default function HealthForm({ onDataAdded }: HealthFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [steps, setSteps] = useState("");
  const [sleepHours, setSleepHours] = useState(7);
  const [heartRate, setHeartRate] = useState("");
  const [caloriesIntake, setCaloriesIntake] = useState("");
  const [waterIntake, setWaterIntake] = useState(2);
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!steps || !heartRate || !caloriesIntake) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      addHealthEntry({
        date: format(date, "yyyy-MM-dd"),
        steps: Number(steps),
        sleepHours,
        heartRate: Number(heartRate),
        caloriesIntake: Number(caloriesIntake),
        waterIntake,
        weight: weight ? Number(weight) : undefined,
      });
      toast.success("Health data saved!", { icon: <Check className="h-4 w-4" /> });
      setSteps(""); setSleepHours(7); setHeartRate(""); setCaloriesIntake(""); setWaterIntake(2); setWeight("");
      setSaving(false);
      onDataAdded();
    }, 400);
  };

  const inputFields = [
    { label: "Steps Walked", value: steps, set: (v: string) => setSteps(v), placeholder: "e.g. 8000", icon: "👟" },
    { label: "Heart Rate (bpm)", value: heartRate, set: (v: string) => setHeartRate(v), placeholder: "e.g. 72", icon: "💓" },
    { label: "Calories Intake", value: caloriesIntake, set: (v: string) => setCaloriesIntake(v), placeholder: "e.g. 2000", icon: "🔥" },
    { label: "Weight (kg) — optional", value: weight, set: (v: string) => setWeight(v), placeholder: "e.g. 70", icon: "⚖️" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">📅 Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-muted/50 border-primary/20 hover:border-primary/40")}>
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>

      {/* Slider: Sleep */}
      <div className="glass-card p-4 space-y-3">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          😴 Sleep Hours: <span className="text-primary font-bold">{sleepHours} hrs</span>
        </Label>
        <Slider
          value={[sleepHours]}
          onValueChange={([v]) => setSleepHours(v)}
          min={0} max={14} step={0.5}
          className="py-2"
        />
      </div>

      {/* Slider: Water */}
      <div className="glass-card p-4 space-y-3">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          💧 Water Intake: <span className="text-primary font-bold">{waterIntake} L</span>
        </Label>
        <Slider
          value={[waterIntake]}
          onValueChange={([v]) => setWaterIntake(v)}
          min={0} max={6} step={0.1}
          className="py-2"
        />
      </div>

      {/* Text inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inputFields.map((f) => (
          <div key={f.label} className="glass-card p-4 space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              {f.icon} {f.label}
            </Label>
            <Input
              type="number" step="any"
              value={f.value} onChange={(e) => f.set(e.target.value)}
              placeholder={f.placeholder}
              className="bg-muted/50 border-primary/20 focus:border-primary/40"
            />
          </div>
        ))}
      </div>

      <Button
        type="submit"
        className="w-full gradient-primary border-0 text-primary-foreground neon-glow hover:scale-[1.02] transition-transform"
        disabled={saving}
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          <><Plus className="mr-2 h-4 w-4" /> Save Entry</>
        )}
      </Button>
    </form>
  );
}
