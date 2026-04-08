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

  function fixBrokenJson(raw: string): string {
    // Fix unescaped newlines inside JSON string values
    // Walk through character by character, track if we're inside a string
    let result = "";
    let inString = false;
    let escaped = false;

    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];

      if (escaped) {
        result += ch;
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        result += ch;
        escaped = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        result += ch;
        continue;
      }

      if (inString && (ch === "\n" || ch === "\r")) {
        // Replace literal newline inside a string with escaped version
        if (ch === "\r" && raw[i + 1] === "\n") {
          result += "\\n";
          i++; // skip the \n after \r
        } else {
          result += "\\n";
        }
        continue;
      }

      if (inString && ch === "\t") {
        result += "\\t";
        continue;
      }

      result += ch;
    }
    return result;
  }

  function handlePasteResponse() {
    if (!response.trim()) {
      setError("Please paste Claude's response first.");
      return;
    }

    try {
      let text = response.trim();

      // Remove markdown code block wrapper if present
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        text = codeBlockMatch[1].trim();
      }

      // Remove any leading text before the first {
      const firstBrace = text.indexOf("{");
      if (firstBrace === -1) {
        setError("No JSON found in the response. Make sure you copied Claude's full response.");
        return;
      }
      // Find the matching closing brace
      let depth = 0;
      let lastBrace = -1;
      for (let i = firstBrace; i < text.length; i++) {
        if (text[i] === "{") depth++;
        if (text[i] === "}") {
          depth--;
          if (depth === 0) { lastBrace = i; break; }
        }
      }
      if (lastBrace === -1) {
        setError("JSON appears to be cut off. Make sure you copied the COMPLETE response from Claude.");
        return;
      }

      let jsonStr = text.slice(firstBrace, lastBrace + 1);

      // Try parsing as-is first
      try {
        const parsed = JSON.parse(jsonStr);
        setError("");
        onResponsePasted(parsed);
        return;
      } catch {
        // Fall through to fix attempt
      }

      // Fix unescaped newlines/tabs inside string values and try again
      jsonStr = fixBrokenJson(jsonStr);
      const parsed = JSON.parse(jsonStr);
      setError("");
      onResponsePasted(parsed);
    } catch {
      setError("Could not parse the response. Try asking Claude to return the response inside a single JSON code block with no line breaks inside string values.");
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
