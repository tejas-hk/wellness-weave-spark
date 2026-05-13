import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Calendar, Filter, X, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { HealthEntry } from "@/lib/healthData";

type SortKey = keyof Pick<HealthEntry, "date" | "steps" | "sleepHours" | "heartRate" | "caloriesIntake" | "waterIntake" | "weight">;
type SortDir = "asc" | "desc";

interface Props {
  data: HealthEntry[];
}

const columns: { key: SortKey; label: string; unit?: string }[] = [
  { key: "date", label: "Date" },
  { key: "steps", label: "Steps" },
  { key: "sleepHours", label: "Sleep", unit: "hrs" },
  { key: "heartRate", label: "HR", unit: "bpm" },
  { key: "caloriesIntake", label: "Calories", unit: "kcal" },
  { key: "waterIntake", label: "Water", unit: "L" },
  { key: "weight", label: "Weight", unit: "kg" },
];

export default function HealthHistory({ data }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [quickFilter, setQuickFilter] = useState<string>("all");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const clearFilters = () => { setSearch(""); setDateFrom(undefined); setDateTo(undefined); setQuickFilter("all"); };
  const hasActiveFilters = search || dateFrom || dateTo || quickFilter !== "all";

  const filtered = useMemo(() => {
    let result = [...data];
    if (quickFilter === "latest10") result = result.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);
    else if (quickFilter === "oldest10") result = result.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10);
    if (dateFrom) result = result.filter((d) => d.date >= format(dateFrom, "yyyy-MM-dd"));
    if (dateTo) result = result.filter((d) => d.date <= format(dateTo, "yyyy-MM-dd"));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        d.date.includes(q) || String(d.steps).includes(q) || String(d.sleepHours).includes(q) ||
        String(d.heartRate).includes(q) || String(d.caloriesIntake).includes(q) ||
        String(d.waterIntake).includes(q) || String(d.weight ?? "").includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [data, search, sortKey, sortDir, dateFrom, dateTo, quickFilter]);

  // Compute mini trends per row
  const getTrend = (entry: HealthEntry, key: keyof HealthEntry) => {
    const idx = data.findIndex((d) => d.id === entry.id);
    if (idx <= 0) return null;
    const prev = Number(data[idx - 1][key]) || 0;
    const curr = Number(entry[key]) || 0;
    if (curr > prev * 1.05) return "up";
    if (curr < prev * 0.95) return "down";
    return null;
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const MiniTrend = ({ entry, field }: { entry: HealthEntry; field: keyof HealthEntry }) => {
    const t = getTrend(entry, field);
    if (!t) return null;
    return t === "up"
      ? <TrendingUp className="h-3 w-3 text-chart-green inline ml-1" />
      : <TrendingDown className="h-3 w-3 text-chart-rose inline ml-1" />;
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by date, steps, calories..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50 border-primary/20 focus:border-primary/40"
            />
          </div>
          <Select value={quickFilter} onValueChange={setQuickFilter}>
            <SelectTrigger className="w-[160px] bg-muted/50 border-primary/20">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Records</SelectItem>
              <SelectItem value="latest10">Latest 10</SelectItem>
              <SelectItem value="oldest10">Oldest 10</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("gap-2 bg-muted/50 border-primary/20", dateFrom && "border-primary text-primary")}>
                <Calendar className="h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd MMM") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("gap-2 bg-muted/50 border-primary/20", dateTo && "border-primary text-primary")}>
                <Calendar className="h-4 w-4" />
                {dateTo ? format(dateTo, "dd MMM") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Active:</span>
            {search && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Search: "{search}"</Badge>}
            {dateFrom && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">From: {format(dateFrom, "dd MMM yyyy")}</Badge>}
            {dateTo && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">To: {format(dateTo, "dd MMM yyyy")}</Badge>}
            {quickFilter !== "all" && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{quickFilter === "latest10" ? "Latest 10" : "Oldest 10"}</Badge>}
            <Badge variant="outline" className="border-muted-foreground/30">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</Badge>
          </div>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-sm">No records found.</p>
            <p className="text-muted-foreground text-xs mt-1">Try adjusting your filters or add new health data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        <SortIcon col={col.key} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{formatDate(entry.date)}</td>
                    <td className="py-3 px-4">{entry.steps.toLocaleString()}<MiniTrend entry={entry} field="steps" /></td>
                    <td className="py-3 px-4">{entry.sleepHours}<MiniTrend entry={entry} field="sleepHours" /></td>
                    <td className="py-3 px-4">{entry.heartRate}<MiniTrend entry={entry} field="heartRate" /></td>
                    <td className="py-3 px-4">{entry.caloriesIntake.toLocaleString()}<MiniTrend entry={entry} field="caloriesIntake" /></td>
                    <td className="py-3 px-4">{entry.waterIntake}<MiniTrend entry={entry} field="waterIntake" /></td>
                    <td className="py-3 px-4">{entry.weight ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Showing {filtered.length} of {data.length} total records • Click column headers to sort
      </p>
    </div>
  );
}
