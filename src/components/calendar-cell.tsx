import { CalendarSlot, ContentPurpose } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { purposeColors, purposeLabels } from "@/data/calendar-template";

interface CalendarCellProps {
  slot: CalendarSlot;
  onClick: () => void;
}

export function CalendarCell({ slot, onClick }: CalendarCellProps) {
  const colorClass = purposeColors[slot.purpose] || "bg-secondary border-border";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2 rounded-lg border ${colorClass} hover:opacity-90 transition-opacity cursor-pointer min-h-[80px]`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
          {slot.timeOfDay}
        </span>
        <Badge variant="outline" className="text-[9px] px-1 py-0 bg-black/20 border-white/20">
          {slot.format}
        </Badge>
      </div>
      <p className="text-[11px] font-semibold leading-tight mb-1">
        {purposeLabels[slot.purpose]}
      </p>
      <p className="text-[10px] opacity-75 leading-tight line-clamp-2">
        {slot.writtenHook}
      </p>
    </button>
  );
}
