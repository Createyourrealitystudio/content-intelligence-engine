"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/loading-state";
import { Zap, FileText, Target } from "lucide-react";

const exampleICPs = [
  {
    label: "Fitness Coach",
    text: "My ideal client is a 28-35 year old woman who works a corporate job, has tried multiple diets and workout programs but can't stay consistent. She feels guilty about not prioritizing her health, scrolls fitness content late at night, and is tired of cookie-cutter programs. She makes $60-90K, lives in a metro area, and wants to feel confident in her body without spending 2 hours at the gym. She's skeptical of online coaches because she's been burned before.",
  },
  {
    label: "SaaS Founder",
    text: "B2B SaaS founders doing $500K-$2M ARR who are stuck. They've got product-market fit but can't figure out how to scale past their founder-led sales motion. They're technical, spend time on Twitter and LinkedIn, and are frustrated that marketing feels like a guessing game. They've tried content marketing but it feels like shouting into the void. They want predictable pipeline without hiring a VP of Marketing they can't afford yet.",
  },
  {
    label: "Real Estate Agent",
    text: "New real estate agents in their first 2 years, age 24-35, who got their license excited but now realize they have no idea how to actually get clients. They're posting on Instagram but getting zero leads. They see top producers crushing it and feel like they're missing something. They're spending money on leads from Zillow that go nowhere. They want a system that actually works for someone starting from zero.",
  },
];

export function ICPInput() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleAnalyze() {
    if (input.trim().length < 10) {
      setError("Please provide more detail about your ideal customer.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icpInput: input }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const analysis = await res.json();
      sessionStorage.setItem("icpAnalysis", JSON.stringify(analysis));
      sessionStorage.setItem("icpInput", input);
      router.push("/recommendations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Analyzing your ICP..."
        subtitle="Mapping against 26 angle families, 28 hook categories, 6 funnel stages, and 20 psychological mechanisms"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Content Intelligence <span className="text-primary">Engine</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Drop in your ICP. Get back a full strategy — recommended angles, hooks, formats,
          and a complete 30-day content calendar with every piece written in your avatar&apos;s language.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Describe Your Ideal Customer
          </CardTitle>
          <CardDescription>
            Paste a detailed ICP doc or write a quick description. Include demographics,
            pain points, desires, objections, and platforms they use. More detail = better output.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: My ideal client is a 30-year-old male entrepreneur trying to grow on Instagram. He's making $5-10K/month from coaching, frustrated that his content gets low engagement, and doesn't know how to turn followers into paying clients..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] text-base"
          />
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <Button
            onClick={handleAnalyze}
            className="w-full text-base py-6"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Analyze ICP & Generate Strategy
          </Button>
        </CardContent>
      </Card>

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Try an example:
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {exampleICPs.map((example) => (
            <button
              key={example.label}
              onClick={() => setInput(example.text)}
              className="text-left px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-sm font-medium">{example.label}</span>
              <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">
                {example.text.slice(0, 80)}...
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
