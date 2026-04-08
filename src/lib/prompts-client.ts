import { angles } from "@/data/angles";
import { hooks } from "@/data/hooks";
import { funnelStages } from "@/data/funnel-stages";
import { platforms } from "@/data/platforms";
import { pillars } from "@/data/pillars";
import { objectives } from "@/data/objectives";
import { weeklyTemplate } from "@/data/calendar-template";
import { SYSTEM_PROMPT } from "@/data/system-prompt";

function buildAngleSummary(): string {
  return angles.map(a => `${a.id}. ${a.name}: ${a.mechanism} | Variants: ${a.variants.map(v => v.name).join(", ")} | Best stages: ${a.bestFunnelStages.join(",")}`).join("\n");
}

function buildHookSummary(): string {
  return hooks.map(h => `${h.id}-${h.name}: ${h.mechanism} | Best stages: ${h.bestFunnelStages.join(",")}`).join("\n");
}

function buildPlatformSummary(): string {
  return platforms.map(p => `${p.name}: Top angles: ${p.topAngles.join(", ")} | Top hooks: ${p.topHooks.join(", ")}`).join("\n");
}

export function buildICPPromptForClipboard(icpInput: string): string {
  return `${SYSTEM_PROMPT}

AVAILABLE ANGLES:
${buildAngleSummary()}

AVAILABLE HOOKS:
${buildHookSummary()}

AVAILABLE PLATFORMS:
${buildPlatformSummary()}

FUNNEL STAGES:
${funnelStages.map(s => `Stage ${s.number} - ${s.name}: ${s.creativeJob}`).join("\n")}

CONTENT PILLARS:
${pillars.map(p => `${p.name}: ${p.purpose}`).join("\n")}

BUSINESS OBJECTIVES:
${objectives.map(o => `${o.name}: ${o.description}`).join("\n")}

---

Analyze the following ICP (Ideal Customer Profile) and return a JSON object with this EXACT structure. Be extremely specific — use the ICP's actual language, their specific pain points, their actual words and phrases.

ICP INPUT:
${icpInput}

Return ONLY valid JSON (no markdown, no code blocks, no explanation) with this structure:
{
  "summary": "2-3 sentence summary of who this person is",
  "demographics": {
    "ageRange": "",
    "gender": "",
    "location": "",
    "incomeLevel": ""
  },
  "psychographics": {
    "identity": "how they see themselves",
    "aspirations": ["specific desires in their language"],
    "fears": ["specific fears in their language"],
    "frustrations": ["specific daily frustrations in their language"],
    "desires": ["what they want most, in their words"]
  },
  "awarenessLevel": "unaware|problem-aware|solution-aware|product-aware|most-aware",
  "primaryObjections": ["specific objections they'd have"],
  "languagePatterns": {
    "wordsTheyUse": ["exact words/slang they use"],
    "phrasesTheyResonate": ["phrases that would stop their scroll"],
    "tonePreference": "description of tone that resonates"
  },
  "platforms": ["primary platforms they use"],
  "funnelStageDistribution": {"1": 40, "2": 25, "3": 15, "4": 10, "5": 5, "6": 5},
  "recommendedAngles": [
    {"name": "angle family name", "reason": "specific reason for this ICP", "strength": "primary|secondary"}
  ],
  "recommendedHooks": [
    {"name": "hook category", "reason": "specific reason", "strength": "primary|secondary"}
  ],
  "recommendedFormats": [
    {"name": "format family", "reason": "specific reason", "strength": "primary|secondary"}
  ],
  "topCombinations": [
    {
      "angle": "specific angle family + variant",
      "hook": "specific hook category",
      "format": "specific format",
      "platform": "platform name",
      "funnelStage": 1,
      "pillar": "pillar name",
      "writtenHook": "THE ACTUAL WRITTEN HOOK in the ICP's language — specific, scroll-stopping, ready to use",
      "reason": "why this combination works for this specific ICP"
    }
  ]
}

CRITICAL: Generate at least 10 topCombinations spanning different funnel stages and pillars. Every writtenHook must use the ICP's EXACT language patterns — their words, their frustrations, their desires. Be brutally specific, not generic.`;
}

export function buildCalendarPromptForClipboard(icpAnalysis: string): string {
  const templateDesc = weeklyTemplate.map(s =>
    `${s.dayOfWeek} ${s.timeOfDay}: purpose=${s.purpose}, format=${s.defaultFormat}, stage=${s.funnelStage}, pillar=${s.pillar}`
  ).join("\n");

  return `${SYSTEM_PROMPT}

You are generating a 30-day content calendar. Every single piece of content must speak DIRECTLY to the ICP using their exact language patterns, frustrations, desires, and tone.

WEEKLY RHYTHM TEMPLATE (repeat each week):
${templateDesc}

CONTENT MIX RULES:
- 40% Authority/Educational (Stages 2-3): Frameworks, teaching, data, how-tos
- 30% Story/Connection (Stage 4): Personal narratives, BTS, vulnerability, values
- 20% Relatable/Awareness (Stages 1, 4): Shared experiences, humor, identity
- 10% Community/CTA (Stages 5-6): Engagement, offers, conversions
- Sunday PM is ALWAYS the hard CTA — the weekly close
- Build trust Mon-Sat, convert on Sunday
- Vary angles across the week — never repeat the same angle family in consecutive slots
- Each week should include at least 1 objection-handling piece and 1 testimonial/social proof piece

AVAILABLE ANGLES:
${buildAngleSummary()}

AVAILABLE HOOKS:
${buildHookSummary()}

---

Generate a complete 30-day content calendar based on this ICP analysis:

${icpAnalysis}

Return ONLY valid JSON (no markdown, no code blocks, no explanation) with this structure:
{
  "month": "Month Year",
  "icpSummary": "one-line ICP summary",
  "weeklyRhythm": "description of the weekly rhythm pattern",
  "mixBreakdown": {"authority": 40, "story": 30, "relatable": 20, "community": 10},
  "days": [
    {
      "dayOfWeek": "Monday",
      "dayNumber": 1,
      "am": {
        "timeOfDay": "AM",
        "purpose": "social-proof|value-pain|connection|awareness|objection-handle|soft-cta|hard-cta|reflection|testimonial|identity",
        "format": "Reel|Carousel|Story",
        "angle": "Angle Family Name",
        "angleVariant": "Specific Variant",
        "hookCategory": "X-Name",
        "writtenHook": "THE COMPLETE WRITTEN HOOK — ready to film/post, in the ICP's exact language",
        "bodyStructure": "2-3 sentence description of the body content structure",
        "copywritingFramework": "PAS|AIDA|BAB|PPPP|PASTOR",
        "ctaType": "soft|medium|hard",
        "writtenCta": "The exact CTA copy — ready to use",
        "funnelStage": 3,
        "pillar": "Social Proof",
        "mechanisms": ["Loss Aversion", "Social Proof", "Authority"],
        "caption": "COMPLETE INSTAGRAM CAPTION — full copy ready to paste, using ICP language, with line breaks, 150-300 words for educational/story, 50-100 for stories/connection. Must include the hook as first line, body delivering value, and CTA as final line.",
        "productionNotes": "Brief filming/design direction"
      },
      "pm": { "...same structure..." : "" }
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Every writtenHook must be SPECIFIC to this ICP — use their exact words, fears, desires
2. Every caption must be COMPLETE and READY TO PASTE — not a template, not a placeholder
3. Captions for Value/Pain Point content should use PAS framework and hit HARD on pain before solution
4. Hard CTA on Sunday must build on the week's trust-building content
5. Vary angles — use at least 12 different angle families across the month
6. Each piece must deploy 3+ psychological mechanisms
7. The copy must feel like the ICP wrote it about themselves — mirror their internal monologue
8. Generate ALL 30 days with BOTH AM and PM slots fully specified`;
}
