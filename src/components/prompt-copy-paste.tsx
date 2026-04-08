"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Check, ClipboardPaste, ExternalLink } from "lucide-react";

interface PromptCopyPasteProps {
  prompt: string;
  onResponsePasted: (json: Record<string, unknown>) => void;
  step: number;
  title: string;
  description: string;
}

export function PromptCopyPaste({ prompt, onResponsePasted, step, title, description }: PromptCopyPasteProps) {
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  function handleCopy() {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  function handlePasteResponse() {
    if (!response.trim()) {
      setError("Please paste Claude's response first.");
      return;
    }

    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      let text = response.trim();
      // Remove markdown code block wrapper if present
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        text = codeBlockMatch[1].trim();
      }
      // Extract the JSON object
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setError("No valid JSON found in the response. Make sure you copied Claude's full response.");
        return;
      }
      const parsed = JSON.parse(jsonMatch[0]);
      setError("");
      onResponsePasted(parsed);
    } catch {
      setError("Could not parse the response. Make sure you copied Claude's full JSON response.");
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Step 1: Copy prompt */}
      <Card className={copied ? "border-primary/50" : ""}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {step}
            </span>
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-secondary/50 rounded-lg p-3 border border-border max-h-[200px] overflow-y-auto">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
              {prompt.slice(0, 500)}...
              <span className="text-primary"> ({Math.round(prompt.length / 1000)}K characters)</span>
            </pre>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCopy} className="flex-1" variant={copied ? "default" : "outline"}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Prompt to Clipboard"}
            </Button>
            <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Claude
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Paste response */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
              {step + 1}
            </span>
            Paste Claude&apos;s Response
          </CardTitle>
          <CardDescription>
            Paste the prompt into Claude.ai, wait for the response, then copy and paste it below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Paste Claude's full JSON response here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[200px] text-sm font-mono"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button onClick={handlePasteResponse} className="w-full">
            <ClipboardPaste className="w-4 h-4 mr-2" />
            Process Response
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
