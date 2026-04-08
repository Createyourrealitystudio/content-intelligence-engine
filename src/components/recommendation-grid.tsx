import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentCombination } from "@/lib/types";
import { Lightbulb } from "lucide-react";

export function RecommendationGrid({ combinations }: { combinations: ContentCombination[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-primary" />
        Top Content Combinations
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {combinations.map((combo, i) => (
          <Card key={i} className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{combo.angle}</CardTitle>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">Stage {combo.funnelStage}</Badge>
                  <Badge variant="secondary" className="text-xs">{combo.platform}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-secondary/50 rounded-lg p-3 border border-border">
                <p className="text-sm font-medium text-primary">&ldquo;{combo.writtenHook}&rdquo;</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground block">Hook</span>
                  <span className="font-medium">{combo.hook}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Format</span>
                  <span className="font-medium">{combo.format}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Pillar</span>
                  <span className="font-medium">{combo.pillar}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{combo.reason}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
