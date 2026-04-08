import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CalendarSlot } from "@/lib/types";
import { purposeLabels } from "@/data/calendar-template";
import { Copy } from "lucide-react";

interface ContentPieceModalProps {
  slot: CalendarSlot | null;
  dayLabel: string;
  open: boolean;
  onClose: () => void;
}

export function ContentPieceModal({ slot, dayLabel, open, onClose }: ContentPieceModalProps) {
  if (!slot) return null;

  function copyCaption() {
    if (slot?.caption) {
      navigator.clipboard.writeText(slot.caption);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {dayLabel} — {slot.timeOfDay}
            <Badge>{slot.format}</Badge>
            <Badge variant="outline">{purposeLabels[slot.purpose]}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Hook</h4>
            <p className="text-lg font-semibold text-primary">&ldquo;{slot.writtenHook}&rdquo;</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">Angle</span>
              <p className="font-medium">{slot.angle} — {slot.angleVariant}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Hook Category</span>
              <p className="font-medium">{slot.hookCategory}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Funnel Stage</span>
              <p className="font-medium">Stage {slot.funnelStage}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Pillar</span>
              <p className="font-medium">{slot.pillar}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Copy Framework</span>
              <p className="font-medium">{slot.copywritingFramework}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">CTA Type</span>
              <p className="font-medium capitalize">{slot.ctaType}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Body Structure</h4>
            <p className="text-sm">{slot.bodyStructure}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">CTA</h4>
            <p className="text-sm font-medium">&ldquo;{slot.writtenCta}&rdquo;</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Psychological Mechanisms</h4>
            <div className="flex flex-wrap gap-1">
              {slot.mechanisms.map((m, i) => (
                <Badge key={i} variant="outline" className="text-xs">{m}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Caption</h4>
              <Button variant="ghost" size="sm" onClick={copyCaption}>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-sm whitespace-pre-wrap border border-border">
              {slot.caption}
            </div>
          </div>

          {slot.productionNotes && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Production Notes</h4>
              <p className="text-sm text-muted-foreground">{slot.productionNotes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
