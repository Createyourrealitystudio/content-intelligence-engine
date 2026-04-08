import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICPAnalysis } from "@/lib/types";
import { User, Brain, AlertTriangle, Heart, MessageSquare } from "lucide-react";

export function ICPAnalysisCard({ analysis }: { analysis: ICPAnalysis }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{analysis.summary}</p>
          <div className="flex flex-wrap gap-1 pt-2">
            <Badge variant="secondary">{analysis.demographics.ageRange}</Badge>
            <Badge variant="secondary">{analysis.demographics.gender}</Badge>
            <Badge variant="secondary">{analysis.demographics.incomeLevel}</Badge>
            <Badge variant="outline">{analysis.awarenessLevel}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" /> Fears & Frustrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1">
            {analysis.psychographics.fears.map((f, i) => (
              <li key={i} className="text-muted-foreground">• {f}</li>
            ))}
            {analysis.psychographics.frustrations.map((f, i) => (
              <li key={i} className="text-destructive/80">• {f}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" /> Desires & Aspirations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1">
            {analysis.psychographics.desires.map((d, i) => (
              <li key={i} className="text-muted-foreground">• {d}</li>
            ))}
            {analysis.psychographics.aspirations.map((a, i) => (
              <li key={i} className="text-primary/80">• {a}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Their Language
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {analysis.languagePatterns.wordsTheyUse.map((w, i) => (
              <Badge key={i} variant="outline" className="text-xs">{w}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic mt-2">
            Tone: {analysis.languagePatterns.tonePreference}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Objections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1">
            {analysis.primaryObjections.map((o, i) => (
              <li key={i} className="text-muted-foreground">• {o}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {analysis.platforms.map((p, i) => (
              <Badge key={i} className="bg-primary/20 text-primary border-primary/30">{p}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
