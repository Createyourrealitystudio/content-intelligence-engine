"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarGrid } from "@/components/calendar-grid";
import { ContentCalendar } from "@/lib/types";
import { ArrowLeft, Download } from "lucide-react";

export default function CalendarPage() {
  const [calendar, setCalendar] = useState<ContentCalendar | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("contentCalendar");
    if (stored) {
      setCalendar(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [router]);

  function exportCSV() {
    if (!calendar) return;
    const rows = [["Day", "Day of Week", "Time", "Purpose", "Format", "Angle", "Hook", "Caption", "CTA", "Funnel Stage", "Pillar"].join(",")];
    for (const day of calendar.days) {
      for (const slot of [day.am, day.pm]) {
        rows.push([
          day.dayNumber,
          day.dayOfWeek,
          slot.timeOfDay,
          slot.purpose,
          slot.format,
          `"${slot.angle} - ${slot.angleVariant}"`,
          `"${slot.writtenHook.replace(/"/g, '""')}"`,
          `"${(slot.caption || "").replace(/"/g, '""')}"`,
          `"${slot.writtenCta.replace(/"/g, '""')}"`,
          slot.funnelStage,
          slot.pillar,
        ].join(","));
      }
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-calendar-${calendar.month?.replace(/\s/g, "-") || "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!calendar) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">30-Day Content Calendar</h1>
          <p className="text-muted-foreground text-sm">{calendar.icpSummary}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/recommendations")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge className="bg-emerald-600/80">Social Proof</Badge>
        <Badge className="bg-red-600/80">Value + Pain Point</Badge>
        <Badge className="bg-amber-600/80">Connection</Badge>
        <Badge className="bg-yellow-500/80">Awareness</Badge>
        <Badge className="bg-purple-600/80">Objection Handle</Badge>
        <Badge className="bg-sky-600/80">Soft CTA</Badge>
        <Badge className="bg-emerald-500/90">Hard CTA</Badge>
        <Badge className="bg-orange-600/80">Reflection</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Click any cell to see the full content brief — hook, angle, format, caption, CTA, and production notes.
      </p>

      <CalendarGrid calendar={calendar} />
    </div>
  );
}
