"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ICPAnalysisCard } from "@/components/icp-analysis-card";
import { RecommendationGrid } from "@/components/recommendation-grid";
import { PromptCopyPaste } from "@/components/prompt-copy-paste";
import { buildCalendarPromptForClipboard } from "@/lib/prompts-client";
import { ICPAnalysis } from "@/lib/types";
import { Calendar, ArrowLeft } from "lucide-react";

export default function RecommendationsPage() {
  const [analysis, setAnalysis] = useState<ICPAnalysis | null>(null);
  const [showCalendarPrompt, setShowCalendarPrompt] = useState(false);
  const [calendarPrompt, setCalendarPrompt] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("icpAnalysis");
    if (stored) {
      setAnalysis(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [router]);

  function handleGenerateCalendar() {
    if (!analysis) return;
    const prompt = buildCalendarPromptForClipboard(JSON.stringify(analysis));
    setCalendarPrompt(prompt);
    setShowCalendarPrompt(true);
  }

  function handleCalendarPasted(data: Record<string, unknown>) {
    sessionStorage.setItem("contentCalendar", JSON.stringify(data));
    router.push("/calendar");
  }

  if (!analysis) return null;

  if (showCalendarPrompt) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Generate 30-Day Calendar</h1>
          <p className="text-muted-foreground">Copy the prompt, paste it into Claude.ai, then paste the response back here.</p>
        </div>
        <Button variant="ghost" onClick={() => setShowCalendarPrompt(false)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to recommendations
        </Button>
        <PromptCopyPaste
          prompt={calendarPrompt}
          onResponsePasted={handleCalendarPasted}
          step={1}
          title="Copy the Calendar Generation Prompt"
          description="This prompt contains your ICP analysis + the full calendar system. Paste it into Claude.ai to generate your 30-day content plan. Note: this is a large prompt — Claude may take 30-60 seconds to respond."
        />
      </div>
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
