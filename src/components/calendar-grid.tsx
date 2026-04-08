"use client";

import { useState } from "react";
import { ContentCalendar, CalendarDay, CalendarSlot } from "@/lib/types";
import { CalendarCell } from "@/components/calendar-cell";
import { ContentPieceModal } from "@/components/content-piece-modal";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function CalendarGrid({ calendar }: { calendar: ContentCalendar }) {
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null);
  const [selectedDayLabel, setSelectedDayLabel] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Group days into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < calendar.days.length; i += 7) {
    weeks.push(calendar.days.slice(i, i + 7));
  }

  function handleCellClick(slot: CalendarSlot, dayLabel: string) {
    setSelectedSlot(slot);
    setSelectedDayLabel(dayLabel);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Week {weekIdx + 1}</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekIdx === 0 && daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground pb-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {week.map((day) => (
              <div key={day.dayNumber} className="space-y-1">
                <div className="text-center text-xs text-muted-foreground">{day.dayNumber}</div>
                <CalendarCell
                  slot={day.am}
                  onClick={() => handleCellClick(day.am, `Day ${day.dayNumber} (${day.dayOfWeek})`)}
                />
                <CalendarCell
                  slot={day.pm}
                  onClick={() => handleCellClick(day.pm, `Day ${day.dayNumber} (${day.dayOfWeek})`)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <ContentPieceModal
        slot={selectedSlot}
        dayLabel={selectedDayLabel}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
