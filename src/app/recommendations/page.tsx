"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ICPAnalysisCard } from "@/components/icp-analysis-card";
import { RecommendationGrid } from "@/components/recommendation-grid";
import { LoadingState } from "@/components/loading-state";
import { ICPAnalysis } from "@/lib/types";
import { Calendar, ArrowLeft } from "lucide-react";

export default function RecommendationsPage() {
  const [analysis, setAnalysis] = useState<ICPAnalysis | null>(null);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("icpAnalysis");
    if (stored) {
      setAnalysis(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [router]);

  async function handleGenerateCalendar() {
    setGenerating(true);
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icpAnalysis: analysis, days: 30 }),
      });
      if (!res.ok) throw new Error("Calendar generation failed");
      const calendar = await res.json();
      sessionStorage.setItem("contentCalendar", JSON.stringify(calendar));
      router.push("/calendar");
    } catch (err) {
      console.error(err);
      setGenerating(false);
    }
  }

  if (!analysis) return null;

  if (generating) {
    return (
      <LoadingState
        title="Generating your 30-day content calendar..."
        subtitle="Writing hooks, captions, and CTAs in your avatar's language across all funnel stages"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ICP Analysis & Recommendations</h1>
          <p className="text-muted-foreground">{analysis.summary}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> New ICP
          </Button>
          <Button onClick={handleGenerateCalendar}>
            <Calendar className="w-4 h-4 mr-2" /> Generate 30-Day Calendar
          </Button>
        </div>
      </div>

      <ICPAnalysisCard analysis={analysis} />

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Top Angles</h3>
          <div className="flex flex-wrap gap-1">
            {analysis.recommendedAngles.map((a, i) => (
              <Badge key={i} variant={a.strength === "primary" ? "default" : "secondary"} className="text-xs">
                {a.name}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Top Hooks</h3>
          <div className="flex flex-wrap gap-1">
            {analysis.recommendedHooks.map((h, i) => (
              <Badge key={i} variant={h.strength === "primary" ? "default" : "secondary"} className="text-xs">
                {h.name}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Top Formats</h3>
          <div className="flex flex-wrap gap-1">
            {analysis.recommendedFormats.map((f, i) => (
              <Badge key={i} variant={f.strength === "primary" ? "default" : "secondary"} className="text-xs">
                {f.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <RecommendationGrid combinations={analysis.topCombinations} />

      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={handleGenerateCalendar} className="text-base px-8 py-6">
          <Calendar className="w-5 h-5 mr-2" />
          Generate 30-Day Content Calendar
        </Button>
      </div>
    </div>
  );
}
