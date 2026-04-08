import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/claude";
import { buildCalendarPrompt } from "@/lib/prompts";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const { icpAnalysis, days = 30 } = await request.json();

    if (!icpAnalysis) {
      return NextResponse.json({ error: "ICP analysis required" }, { status: 400 });
    }

    const analysisStr = typeof icpAnalysis === "string"
      ? icpAnalysis
      : JSON.stringify(icpAnalysis);

    const { system, user } = buildCalendarPrompt(analysisStr, days);
    const raw = await generateCompletion(system, user);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse calendar response" }, { status: 500 });
    }

    const calendar = JSON.parse(jsonMatch[0]);
    return NextResponse.json(calendar);
  } catch (error) {
    console.error("Calendar error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Calendar generation failed" },
      { status: 500 }
    );
  }
}
