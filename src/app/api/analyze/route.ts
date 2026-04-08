import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/claude";
import { buildICPAnalysisPrompt } from "@/lib/prompts";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const { icpInput } = await request.json();

    if (!icpInput || typeof icpInput !== "string" || icpInput.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a more detailed ICP description (at least 10 characters)." },
        { status: 400 }
      );
    }

    const { system, user } = buildICPAnalysisPrompt(icpInput.trim());
    const raw = await generateCompletion(system, user);

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
