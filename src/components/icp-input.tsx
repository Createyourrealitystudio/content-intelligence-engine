"use client";

import { useState, useCallback, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/loading-state";
import { Zap, FileText, Target, Upload } from "lucide-react";

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
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

  const readFile = useCallback(async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    // .doc/.docx files need server-side parsing
    if (ext === "doc" || ext === "docx") {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-doc", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to parse document");
      }
      const data = await res.json();
      return data.text;
    }

    // Text-based files can be read directly in the browser
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }, []);

  const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const validExtensions = [".txt", ".md", ".csv", ".json", ".rtf", ".doc", ".docx"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(ext)) {
      setError("Supported formats: .txt, .md, .doc, .docx, .csv, .json");
      return;
    }

    try {
      const text = await readFile(file);
      setInput(text);
      setError("");
    } catch {
      setError("Could not read that file. Try copy-pasting the content instead.");
    }
  }, [readFile]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFile(file);
      setInput(text);
      setError("");
    } catch {
      setError("Could not read that file. Try copy-pasting the content instead.");
    }
  }, [readFile]);

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
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative rounded-lg transition-colors ${
              dragging ? "ring-2 ring-primary bg-primary/5" : ""
            }`}
          >
            {dragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg z-10 border-2 border-dashed border-primary">
                <div className="flex flex-col items-center gap-2 text-primary">
                  <Upload className="w-8 h-8" />
                  <span className="font-medium">Drop your ICP document here</span>
                </div>
              </div>
            )}
            <Textarea
              placeholder="Paste your ICP here, or drag & drop a .doc / .docx / .txt / .md file..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload a file</span>
              <input
                type="file"
                accept=".txt,.md,.csv,.json,.rtf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <span className="text-xs text-muted-foreground">(.doc, .docx, .txt, .md, .csv, .json)</span>
          </div>
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
