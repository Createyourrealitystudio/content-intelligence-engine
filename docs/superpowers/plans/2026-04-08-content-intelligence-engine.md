# Content Intelligence Engine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js web app that takes an ICP input, analyzes it against the full Content Intelligence Connection Guide, generates tailored recommendations, and produces a 30-day content calendar with AM/PM slots, format assignments, written hooks, and CTAs — all in the avatar's language. Deployed to Vercel via GitHub.

**Architecture:** Next.js 14 App Router with server-side API routes for Claude AI processing. The 109K-word Connection Guide is encoded as structured TypeScript data (angles, hooks, formats, funnel stages, platforms, mechanisms, pillars). The ICP analyzer sends the user's input + system intelligence to Claude API, which returns structured recommendations and a full calendar. UI built with Tailwind CSS + shadcn/ui. No database — all processing is session-based.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Anthropic Claude API (@anthropic-ai/sdk), Vercel deployment

---

## File Structure

```
content-intelligence-engine/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with nav, fonts, providers
│   │   ├── page.tsx                # Landing/dashboard with ICP input
│   │   ├── globals.css             # Tailwind imports + custom styles
│   │   ├── recommendations/
│   │   │   └── page.tsx            # ICP analysis results display
│   │   ├── calendar/
│   │   │   └── page.tsx            # 30-day content calendar
│   │   └── reference/
│   │       └── page.tsx            # Searchable Connection Guide browser
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components (button, card, input, etc.)
│   │   ├── nav.tsx                 # Top navigation bar
│   │   ├── icp-input.tsx           # ICP text input form component
│   │   ├── icp-analysis-card.tsx   # Single analysis result card
│   │   ├── recommendation-grid.tsx # Grid of recommended combos
│   │   ├── calendar-grid.tsx       # 30-day AM/PM calendar grid
│   │   ├── calendar-cell.tsx       # Single day cell with AM/PM slots
│   │   ├── content-piece-modal.tsx # Expanded view of a single content piece
│   │   ├── reference-browser.tsx   # Filterable/searchable guide browser
│   │   ├── reference-card.tsx      # Single reference item card
│   │   ├── loading-state.tsx       # Loading/generating animation
│   │   └── export-button.tsx       # Export calendar to CSV/clipboard
│   ├── lib/
│   │   ├── claude.ts               # Claude API client wrapper
│   │   ├── prompts.ts              # All AI prompt templates
│   │   └── types.ts                # TypeScript interfaces for all data
│   ├── data/
│   │   ├── angles.ts               # 26 angle families with variants
│   │   ├── hooks.ts                # 28 hook categories with formulas
│   │   ├── formats.ts              # 30 format families
│   │   ├── funnel-stages.ts        # 6 funnel stages with specs
│   │   ├── platforms.ts            # 10 platforms with specs
│   │   ├── mechanisms.ts           # 20 psychological mechanisms
│   │   ├── pillars.ts              # 6 content pillars
│   │   ├── objectives.ts           # 6 business objectives
│   │   ├── calendar-template.ts    # Weekly rhythm template (AM/PM)
│   │   └── system-prompt.ts        # Full system injection from Part 12
│   └── api/
│       ├── analyze/
│       │   └── route.ts            # POST: ICP analysis endpoint
│       └── calendar/
│           └── route.ts            # POST: Calendar generation endpoint
├── .env.local                      # ANTHROPIC_API_KEY
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Task 1: Project Scaffold and Dependencies

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.env.local`, `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/christophercagle/content-intelligence-engine
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Expected: Project scaffolded with Next.js 14, TypeScript, Tailwind

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/christophercagle/content-intelligence-engine
npm install @anthropic-ai/sdk lucide-react class-variance-authority clsx tailwind-merge
npx shadcn@latest init -d
npx shadcn@latest add button card input textarea tabs badge dialog scroll-area separator select label switch tooltip
```

- [ ] **Step 3: Create .env.local**

Create `.env.local`:
```
ANTHROPIC_API_KEY=your-key-here
```

- [ ] **Step 4: Create .gitignore additions**

Append to `.gitignore`:
```
.env.local
.env
```

- [ ] **Step 5: Set up globals.css with custom theme**

Replace `src/app/globals.css` with:
```css
@import "tailwindcss";

@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: oklch(0.13 0.01 260);
  --color-foreground: oklch(0.95 0.01 260);
  --color-card: oklch(0.16 0.01 260);
  --color-card-foreground: oklch(0.95 0.01 260);
  --color-primary: oklch(0.7 0.18 145);
  --color-primary-foreground: oklch(0.13 0.01 260);
  --color-secondary: oklch(0.22 0.01 260);
  --color-secondary-foreground: oklch(0.95 0.01 260);
  --color-muted: oklch(0.2 0.01 260);
  --color-muted-foreground: oklch(0.6 0.01 260);
  --color-accent: oklch(0.22 0.01 260);
  --color-accent-foreground: oklch(0.95 0.01 260);
  --color-destructive: oklch(0.6 0.2 25);
  --color-border: oklch(0.25 0.01 260);
  --color-input: oklch(0.25 0.01 260);
  --color-ring: oklch(0.7 0.18 145);
  --radius: 0.75rem;

  /* Calendar cell colors */
  --color-social-proof: oklch(0.55 0.18 145);
  --color-value-pain: oklch(0.6 0.2 25);
  --color-connection: oklch(0.65 0.15 55);
  --color-awareness: oklch(0.7 0.15 85);
  --color-objection: oklch(0.55 0.15 300);
  --color-cta-soft: oklch(0.6 0.12 200);
  --color-cta-hard: oklch(0.7 0.18 145);
  --color-reflection: oklch(0.6 0.1 60);
}

body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

- [ ] **Step 6: Create root layout**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Content Intelligence Engine",
  description: "AI-powered content strategy from ICP to 30-day calendar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder home page**

Replace `src/app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Content Intelligence Engine</h1>
    </main>
  );
}
```

- [ ] **Step 8: Verify build**

```bash
cd /Users/christophercagle/content-intelligence-engine
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 9: Commit**

```bash
cd /Users/christophercagle/content-intelligence-engine
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind, shadcn/ui, and Anthropic SDK"
```

---

## Task 2: TypeScript Types and Data Layer

**Files:**
- Create: `src/lib/types.ts`, `src/data/angles.ts`, `src/data/hooks.ts`, `src/data/formats.ts`, `src/data/funnel-stages.ts`, `src/data/platforms.ts`, `src/data/mechanisms.ts`, `src/data/pillars.ts`, `src/data/objectives.ts`, `src/data/calendar-template.ts`, `src/data/system-prompt.ts`

- [ ] **Step 1: Create type definitions**

Create `src/lib/types.ts`:
```ts
// === Core Data Types ===

export interface AngleVariant {
  name: string;
  description: string;
  whenToUse: string;
}

export interface AngleFamily {
  id: number;
  name: string;
  mechanism: string;
  variants: AngleVariant[];
  primaryHookCategories: string[];
  secondaryHookCategories: string[];
  incompatibleHookCategories: string[];
  bestFunnelStages: number[];
  psychologicalPrinciples: string[];
}

export interface HookFormula {
  code: string;
  name: string;
  pattern: string;
  examples: string[];
}

export interface HookCategory {
  id: string;
  name: string;
  mechanism: string;
  formulas: HookFormula[];
  primaryFormatFamilies: string[];
  bestFunnelStages: number[];
}

export interface FormatFamily {
  id: string;
  name: string;
  description: string;
  primaryAngles: string[];
  mutedPerformance: "excellent" | "strong" | "moderate" | "weak";
  platforms: Record<string, "high" | "moderate" | "low" | "unavailable">;
}

export interface FunnelStage {
  number: number;
  name: string;
  psychologicalState: string;
  creativeJob: string;
  optimalAngles: string[];
  optimalHooks: string[];
  optimalFormats: string[];
  ctaIntensity: "soft" | "medium" | "hard";
  ctaExamples: string[];
  metrics: string[];
}

export interface Platform {
  id: string;
  name: string;
  consumptionState: string;
  algorithmSignal: string;
  topAngles: string[];
  topHooks: string[];
  topFormats: string[];
  hookTiming: string;
  failureModes: string[];
}

export interface Mechanism {
  name: string;
  description: string;
  triggers: string[];
  hookCategories: string[];
  anglesFamilies: string[];
  formatFamilies: string[];
}

export interface ContentPillar {
  id: number;
  name: string;
  purpose: string;
  funnelStages: number[];
  optimalAngles: string[];
  optimalHooks: string[];
  optimalFormats: string[];
  ctaIntensity: "soft" | "medium" | "hard";
}

export interface BusinessObjective {
  name: string;
  description: string;
  optimalAngles: string[];
  optimalFormats: string[];
  optimalHooks: string[];
}

// === ICP Analysis Types ===

export interface ICPAnalysis {
  summary: string;
  demographics: {
    ageRange: string;
    gender: string;
    location: string;
    incomeLevel: string;
  };
  psychographics: {
    identity: string;
    aspirations: string[];
    fears: string[];
    frustrations: string[];
    desires: string[];
  };
  awarenessLevel: "unaware" | "problem-aware" | "solution-aware" | "product-aware" | "most-aware";
  primaryObjections: string[];
  languagePatterns: {
    wordsTheyUse: string[];
    phrasesTheyResonate: string[];
    tonePreference: string;
  };
  platforms: string[];
  funnelStageDistribution: Record<number, number>;
  recommendedAngles: RecommendedCombo[];
  recommendedHooks: RecommendedCombo[];
  recommendedFormats: RecommendedCombo[];
  topCombinations: ContentCombination[];
}

export interface RecommendedCombo {
  name: string;
  reason: string;
  strength: "primary" | "secondary";
}

export interface ContentCombination {
  angle: string;
  hook: string;
  format: string;
  platform: string;
  funnelStage: number;
  pillar: string;
  writtenHook: string;
  reason: string;
}

// === Calendar Types ===

export type ContentPurpose =
  | "social-proof"
  | "value-pain"
  | "connection"
  | "awareness"
  | "objection-handle"
  | "soft-cta"
  | "hard-cta"
  | "reflection"
  | "testimonial"
  | "identity";

export type InstagramFormat = "Reel" | "Carousel" | "Story";

export interface CalendarSlot {
  timeOfDay: "AM" | "PM";
  purpose: ContentPurpose;
  format: InstagramFormat;
  angle: string;
  angleVariant: string;
  hookCategory: string;
  writtenHook: string;
  bodyStructure: string;
  copywritingFramework: string;
  ctaType: string;
  writtenCta: string;
  funnelStage: number;
  pillar: string;
  mechanisms: string[];
  caption: string;
  productionNotes: string;
}

export interface CalendarDay {
  dayOfWeek: string;
  dayNumber: number;
  am: CalendarSlot;
  pm: CalendarSlot;
}

export interface ContentCalendar {
  month: string;
  icpSummary: string;
  days: CalendarDay[];
  weeklyRhythm: string;
  mixBreakdown: {
    authority: number;
    story: number;
    relatable: number;
    community: number;
  };
}
```

- [ ] **Step 2: Create angles data**

Create `src/data/angles.ts`:
```ts
import { AngleFamily } from "@/lib/types";

export const angles: AngleFamily[] = [
  {
    id: 1,
    name: "Contrarian",
    mechanism: "Challenge, oppose, or invert what the audience believes. Triggers cognitive dissonance forcing re-evaluation.",
    variants: [
      { name: "Mild Contrarian", description: "Gentle pushback on common advice", whenToUse: "Perspective shift without alienating newcomers" },
      { name: "Strong Contrarian", description: "Direct opposition to widely held belief", whenToUse: "Have genuine evidence, willing to polarize" },
      { name: "Industry Contrarian", description: "Challenges industry sacred cows", whenToUse: "Have insider experience in the industry" },
      { name: "Process Contrarian", description: "Advocates opposite sequence/method", whenToUse: "Tested both conventional and alternative" },
      { name: "Belief Contrarian", description: "Challenges beliefs about themselves", whenToUse: "Have authority and empathy for identity-level challenges" },
      { name: "Identity Contrarian", description: "Challenges the persona they think they need", whenToUse: "Audience exhausted by performing an identity" },
      { name: "Timing Contrarian", description: "Argues opposite about when to act", whenToUse: "Audience making timing-based decisions" },
      { name: "Source Contrarian", description: "Challenges where wisdom comes from", whenToUse: "Can identify structural flaw in the source" },
    ],
    primaryHookCategories: ["E-Contrarian", "D-Curiosity", "L-Reframe"],
    secondaryHookCategories: ["A-Specificity", "P-Data", "M-Challenge"],
    incompatibleHookCategories: ["N-Permission", "G-Aspiration", "H-Relatable"],
    bestFunnelStages: [1, 2],
    psychologicalPrinciples: ["Cognitive dissonance", "Semmelweis reflex", "Authority transfer"],
  },
  {
    id: 2,
    name: "Counterintuitive Insight",
    mechanism: "Present a truth that initially feels wrong but is demonstrably correct. Brain cannot dismiss it.",
    variants: [
      { name: "Data-Backed Counterintuitive", description: "Research that defies expectation", whenToUse: "Have legitimate sourced data contradicting popular belief" },
      { name: "Experience-Backed Counterintuitive", description: "Personal results contradicting common wisdom", whenToUse: "Have genuine measurable results from opposite approach" },
      { name: "Logic-Inversion Counterintuitive", description: "Flips assumed cause-effect", whenToUse: "Identified genuine cause-and-effect reversal" },
      { name: "Paradox Counterintuitive", description: "Two contradictory truths coexist", whenToUse: "Identified real paradox resolving into wisdom" },
      { name: "Scale Counterintuitive", description: "What works at one level breaks at another", whenToUse: "Audience spans multiple stages" },
      { name: "Simplicity Counterintuitive", description: "Complex problem, embarrassingly simple solution", whenToUse: "Discovered simpler approach that works better" },
      { name: "Effort-Inversion Counterintuitive", description: "Doing less produces more", whenToUse: "Have real evidence effort reduction improved outcomes" },
    ],
    primaryHookCategories: ["E-Contrarian", "P-Data", "A-Specificity"],
    secondaryHookCategories: ["D-Curiosity", "X-Numbers", "L-Reframe"],
    incompatibleHookCategories: ["H-Relatable", "N-Permission"],
    bestFunnelStages: [1, 2, 3],
    psychologicalPrinciples: ["Concreteness effect", "Cognitive obligation", "Complexity bias"],
  },
  {
    id: 3,
    name: "Mistake & Warning",
    mechanism: "Identify and warn against specific errors. Brain's threat-detection makes this feel urgent.",
    variants: [
      { name: "Personal Mistake", description: "Creator's own costly error", whenToUse: "Have genuine mistake with extractable lesson" },
      { name: "Client Mistake", description: "Pattern seen across clients", whenToUse: "Observed recurring pattern across clients" },
      { name: "Industry Mistake", description: "Systemic error in the field", whenToUse: "Enough industry experience for systemic issues" },
      { name: "Process Mistake", description: "Wrong sequence or methodology", whenToUse: "Identified specific fixable process error" },
      { name: "Belief Mistake", description: "Wrong mental model", whenToUse: "Can trace false belief to negative outcomes" },
      { name: "Hidden Mistake", description: "Error they don't know they're making", whenToUse: "Identified genuinely non-obvious mistake" },
      { name: "Expensive Mistake", description: "High cost error with specific numbers", whenToUse: "Can attach real number to the mistake" },
      { name: "Silent Mistake", description: "No symptoms, delayed consequences", whenToUse: "Identified delayed-consequence pattern" },
      { name: "Beginner Mistake", description: "Early-stage specific error", whenToUse: "Have genuine beginner-specific mistake" },
      { name: "Advanced Practitioner Mistake", description: "Error only experienced people make", whenToUse: "Have advanced insight for experienced practitioners" },
    ],
    primaryHookCategories: ["C-Mistake", "A-Specificity", "Q-Stakes"],
    secondaryHookCategories: ["D-Curiosity", "E-Contrarian", "X-Numbers"],
    incompatibleHookCategories: ["G-Aspiration", "N-Permission", "U-Future Pacing"],
    bestFunnelStages: [1, 2, 5],
    psychologicalPrinciples: ["Negativity bias", "Loss aversion", "Vicarious learning", "Zeigarnik effect"],
  },
  {
    id: 4,
    name: "Story",
    mechanism: "Narrative structure carries a lesson. Bypasses intellectual resistance through emotional identification.",
    variants: [
      { name: "Personal Origin Story", description: "How the creator got here", whenToUse: "New audience arrives or milestone moments" },
      { name: "Client Transformation Story", description: "Someone else's journey", whenToUse: "Have genuine client result with permission" },
      { name: "Failure Story", description: "Specific moment of defeat", whenToUse: "Have genuine failure with useful lesson" },
      { name: "Pivot Story", description: "Moment of directional change", whenToUse: "Audience at a crossroads" },
      { name: "Observation Story", description: "Noticing something others missed", whenToUse: "Genuinely noticed useful insight" },
      { name: "Micro-Story", description: "Single scene, single moment", whenToUse: "Have vivid moment crystallizing larger truth" },
      { name: "Character Study", description: "Portrait embodying a lesson", whenToUse: "Know real person illustrating a principle" },
      { name: "Before & After Story", description: "Contrasting two states", whenToUse: "Have genuine transformation with identifiable bridge" },
      { name: "Decision Story", description: "One choice that changed everything", whenToUse: "Have genuine decision with real stakes" },
      { name: "Realization Story", description: "The moment something clicked", whenToUse: "Experienced genuine behavior-changing insight" },
      { name: "Mentor Story", description: "Lesson from someone else", whenToUse: "Have genuine mentor interaction with quotable lesson" },
      { name: "Anti-Story", description: "Story of what didn't happen", whenToUse: "Have genuine near-miss with decision insight" },
    ],
    primaryHookCategories: ["V-Micro-Story", "T-Confession", "A-Specificity"],
    secondaryHookCategories: ["D-Curiosity", "H-Relatable", "S-Timeline"],
    incompatibleHookCategories: ["P-Data", "X-Numbers", "R-Process"],
    bestFunnelStages: [1, 3, 4],
    psychologicalPrinciples: ["Narrative transportation", "Proxy identification", "Pratfall effect", "Contrast effect"],
  },
  {
    id: 5,
    name: "Framework & System",
    mechanism: "Package knowledge into repeatable named structures. Signals competence, creates saves.",
    variants: [
      { name: "Numbered List", description: "Specific count under one principle", whenToUse: "Multiple distinct points serving same goal" },
      { name: "Named Framework", description: "Branded IP with memorable name", whenToUse: "Have genuinely systematized approach" },
      { name: "Step-by-Step Process", description: "Sequential instruction start to finish", whenToUse: "Task has genuine logical sequence" },
      { name: "Decision Matrix", description: "Criteria-based evaluation tool", whenToUse: "Audience stuck between options" },
      { name: "Tier System", description: "Ranking/leveling structure", whenToUse: "Audience has clear progression path" },
      { name: "Comparison Matrix", description: "Side-by-side across criteria", whenToUse: "Multiple legitimate options exist" },
      { name: "Checklist", description: "Binary yes/no audit", whenToUse: "Want practical tool audiences save" },
      { name: "Audit", description: "Diagnostic revealing gaps", whenToUse: "Want to generate direct conversations" },
      { name: "Formula", description: "Pseudo-mathematical equation", whenToUse: "Can distill complex relationship into equation" },
      { name: "Rulebook", description: "Definitive non-negotiable principles", whenToUse: "Have experience-backed principles" },
    ],
    primaryHookCategories: ["A-Specificity", "R-Process", "X-Numbers"],
    secondaryHookCategories: ["D-Curiosity", "E-Contrarian", "J-Authority"],
    incompatibleHookCategories: ["H-Relatable", "T-Confession", "N-Permission"],
    bestFunnelStages: [2, 3],
    psychologicalPrinciples: ["Collection instinct", "Anchoring effect", "Zeigarnik effect"],
  },
  { id: 6, name: "Behind the Scenes", mechanism: "Pull back the curtain on process, decisions, or hidden reality. Trades transparency for trust.", variants: [{ name: "Workflow Reveal", description: "Exact process start to finish", whenToUse: "Process is genuinely efficient or unique" }, { name: "Number Reveal", description: "Real financial or performance data", whenToUse: "Have real data helping audience calibrate" }, { name: "Failure Reveal", description: "Detailed account of what went wrong", whenToUse: "Genuinely processed the failure" }, { name: "Decision Reveal", description: "Reasoning behind a specific choice", whenToUse: "Recently made significant decision" }, { name: "Day-in-the-Life", description: "Real-time window into operations", whenToUse: "Want to humanize your brand" }, { name: "Tool & Stack Reveal", description: "Exact tools and software used", whenToUse: "Audience actively building" }, { name: "Unfiltered Reality", description: "Raw contrasting with curated version", whenToUse: "Content has been polished, audience needs reminder" }], primaryHookCategories: ["R-Process", "A-Specificity", "T-Confession"], secondaryHookCategories: ["D-Curiosity", "V-Micro-Story"], incompatibleHookCategories: ["E-Contrarian", "M-Challenge"], bestFunnelStages: [3, 4], psychologicalPrinciples: ["Iceberg illusion", "Pratfall effect", "Authenticity heuristic"] },
  { id: 7, name: "Identity & Tribe", mechanism: "Speak directly to who the audience is or wants to become, creating belonging.", variants: [{ name: "Identity Call-Out", description: "Names exactly who content is for", whenToUse: "Want to speak to specific segment" }, { name: "Belief Alignment", description: "States shared-value belief", whenToUse: "Have genuine shared conviction" }, { name: "Values Signal", description: "Draws line on what you stand for", whenToUse: "Solidifying brand identity" }, { name: "In-Group Validation", description: "Makes followers feel seen", whenToUse: "Heavy education, audience needs to feel seen" }, { name: "Out-Group Distinction", description: "Defines who content is NOT for", whenToUse: "Misaligned people in audience" }, { name: "Aspiring Identity", description: "Who audience wants to become", whenToUse: "Audience needs a vision" }, { name: "Current Identity Tension", description: "Gap between who they are and want to be", whenToUse: "Want to move audience to action" }, { name: "Tribe Ritual", description: "Shared behaviors creating belonging", whenToUse: "Enough engaged followers for ritual" }], primaryHookCategories: ["B-Identity", "H-Relatable", "N-Permission"], secondaryHookCategories: ["E-Contrarian", "G-Aspiration", "M-Challenge"], incompatibleHookCategories: ["P-Data", "X-Numbers", "R-Process"], bestFunnelStages: [1, 4, 5], psychologicalPrinciples: ["Cocktail party effect", "Similarity-attraction", "Belongingness need"] },
  { id: 8, name: "Myth-Busting", mechanism: "Name a widely accepted falsehood and dismantle it with evidence. Inherently shareable.", variants: [{ name: "Industry Myth", description: "Falsehood about how industry works", whenToUse: "Widely held belief harming audience" }, { name: "Platform Myth", description: "Misconception about platform/algorithm", whenToUse: "Have data contradicting platform belief" }, { name: "Tactical Myth", description: "Wrong belief about specific tactic", whenToUse: "Audience repeatedly implementing bad tactic" }, { name: "Strategic Myth", description: "Flawed big-picture thinking", whenToUse: "Flawed strategy being widely promoted" }, { name: "Motivational Myth", description: "Feel-good advice that harms", whenToUse: "Audience consumed motivational content without results" }, { name: "Identity Myth", description: "False beliefs about who succeeds", whenToUse: "Have evidence contradicting success beliefs" }, { name: "Timeline Myth", description: "Wrong expectations about duration", whenToUse: "Audience showing timeline discouragement" }], primaryHookCategories: ["E-Contrarian", "C-Mistake", "P-Data"], secondaryHookCategories: ["D-Curiosity", "L-Reframe", "W-Definition"], incompatibleHookCategories: ["G-Aspiration", "N-Permission", "H-Relatable"], bestFunnelStages: [1, 2], psychologicalPrinciples: ["Whistleblower heuristic", "Expert heuristic", "Loss aversion"] },
  { id: 9, name: "Reframe", mechanism: "Shift the meaning of something known by changing the frame. Creates highest-save 'I never thought of it that way' moments.", variants: [{ name: "Problem-to-Resource", description: "Problem IS the resource", whenToUse: "Audience frustrated by recurring obstacle" }, { name: "Weakness-to-Strength", description: "Flaw is competitive edge", whenToUse: "Audience self-deprecates about a trait" }, { name: "Loss-to-Lesson", description: "Failure contains instruction", whenToUse: "Have genuine distance from the loss" }, { name: "Limitation-to-Advantage", description: "Constraint forced better outcome", whenToUse: "Audience uses resource gap as excuse" }, { name: "Fear-to-Data", description: "Fear as actionable signal", whenToUse: "Audience experiences disproportionate fear" }, { name: "Timeline Reframe", description: "Slow path is actually faster", whenToUse: "Audience frustrated about speed" }, { name: "Definition Reframe", description: "Changes meaning of single word", whenToUse: "Audience using a word in limiting way" }, { name: "Cost Reframe", description: "Expensive option is cheapest", whenToUse: "Audience debating purchase decision" }], primaryHookCategories: ["L-Reframe", "W-Definition", "E-Contrarian"], secondaryHookCategories: ["D-Curiosity", "A-Specificity", "N-Permission"], incompatibleHookCategories: ["F-Social Proof", "R-Process", "X-Numbers"], bestFunnelStages: [2, 3, 4], psychologicalPrinciples: ["Figure-ground reversal", "Cognitive reappraisal", "Sapir-Whorf effect"] },
  { id: 10, name: "Data & Research", mechanism: "Lead with specific numbers, studies, or statistics as primary authority.", variants: [{ name: "Personal Data", description: "Creator's own tracked metrics", whenToUse: "Tracked something long enough" }, { name: "Industry Data", description: "Published research/reports", whenToUse: "Relevant report drops or need validation" }, { name: "Platform Data", description: "Algorithm/analytics insights", whenToUse: "Observed genuine platform shift" }, { name: "Client Data", description: "Aggregated results across clients", whenToUse: "Have 15-20+ clients for patterns" }, { name: "Comparison Data", description: "Two data sets side by side", whenToUse: "Tested two approaches under comparable conditions" }, { name: "Micro-Data", description: "One small data point illuminating larger truth", whenToUse: "Have single striking data point" }], primaryHookCategories: ["P-Data", "A-Specificity", "X-Numbers"], secondaryHookCategories: ["E-Contrarian", "D-Curiosity", "O-Comparison"], incompatibleHookCategories: ["H-Relatable", "T-Confession", "N-Permission"], bestFunnelStages: [2, 3], psychologicalPrinciples: ["Concreteness effect", "Authority bias", "Contrast effect"] },
  { id: 11, name: "Aspiration", mechanism: "Paint vivid picture of desired future. Sell tickets to destinations, not solutions to problems.", variants: [{ name: "Lifestyle Aspiration", description: "Daily reality of achieved goal", whenToUse: "Genuinely live the lifestyle" }, { name: "Identity Aspiration", description: "Who they want to become", whenToUse: "Core issue is self-concept" }, { name: "Financial Aspiration", description: "Specific financial milestone", whenToUse: "Can speak honestly about financial results" }, { name: "Freedom Aspiration", description: "Autonomy and optionality", whenToUse: "Genuinely have the freedom described" }, { name: "Daily Reality Aspiration", description: "Single small moment in desired routine", whenToUse: "Need grounded realistic aspiration" }, { name: "Competence Aspiration", description: "Skill level and effortless expertise", whenToUse: "Can demonstrate high-level competence" }], primaryHookCategories: ["G-Aspiration", "U-Future Pacing", "S-Timeline"], secondaryHookCategories: ["B-Identity", "V-Micro-Story", "A-Specificity"], incompatibleHookCategories: ["C-Mistake", "E-Contrarian", "M-Challenge"], bestFunnelStages: [1, 4, 5], psychologicalPrinciples: ["Mental simulation", "Possible selves framework", "Self-determination theory"] },
  { id: 12, name: "Relatability", mechanism: "Mirror audience's experience so precisely they feel seen. Power is in recognition.", variants: [{ name: "Shared Frustration", description: "Universal annoyance named", whenToUse: "Identified universal frustration" }, { name: "Shared Confusion", description: "Something everyone secretly doesn't understand", whenToUse: "Identified shared confusion" }, { name: "Shared Private Thought", description: "What everyone thinks but nobody says", whenToUse: "Identified widely shared unspoken thought" }, { name: "Shared Silent Struggle", description: "Invisible difficulty behind scenes", whenToUse: "Experiencing or experienced the struggle" }, { name: "Shared Contradiction", description: "Hypocrisy everyone lives with", whenToUse: "Can name contradiction with self-aware humor" }, { name: "Shared Pride", description: "Small win everyone secretly celebrates", whenToUse: "Want to foster positive energy" }], primaryHookCategories: ["H-Relatable", "B-Identity", "N-Permission"], secondaryHookCategories: ["V-Micro-Story", "T-Confession", "D-Curiosity"], incompatibleHookCategories: ["P-Data", "J-Authority", "R-Process"], bestFunnelStages: [1, 4], psychologicalPrinciples: ["Communal coping", "Pluralistic ignorance", "Mirror neurons"] },
  { id: 13, name: "Objection Handling", mechanism: "Surface and resolve specific resistance preventing action.", variants: [{ name: "Price Objection", description: "Reframes 'too expensive'", whenToUse: "During launches" }, { name: "Timing Objection", description: "Dismantles 'not the right time'", whenToUse: "Mid-launch or procrastination seasons" }, { name: "Trust Objection", description: "Addresses 'how do I know this works'", whenToUse: "Entering saturated markets" }, { name: "Self-Doubt Objection", description: "Neutralizes 'I'm not ready enough'", whenToUse: "Early in launch" }, { name: "Previous Failure Objection", description: "Overcomes 'I tried before'", whenToUse: "Market saturated with underdelivering offers" }, { name: "Comparison Objection", description: "Answers 'why you vs alternative'", whenToUse: "Active comparison mode" }], primaryHookCategories: ["N-Permission", "C-Mistake", "L-Reframe"], secondaryHookCategories: ["F-Social Proof", "A-Specificity", "Q-Stakes"], incompatibleHookCategories: ["G-Aspiration", "H-Relatable", "D-Curiosity"], bestFunnelStages: [5, 6], psychologicalPrinciples: ["Loss aversion", "Sunk cost fallacy", "Identity-based motivation"] },
  { id: 14, name: "Social Proof", mechanism: "Evidence of others' actions, results, or endorsements to build trust.", variants: [{ name: "Client Result", description: "Specific measurable outcome", whenToUse: "Throughout launches, weekly evergreen" }, { name: "Testimonial", description: "Client's own words", whenToUse: "1-2x/week launch, every 2 weeks evergreen" }, { name: "Case Study", description: "Full transformation narrative", whenToUse: "Before/during launches, monthly" }, { name: "Community Proof", description: "Aggregate behavior/size", whenToUse: "Launching community offerings" }, { name: "Volume Proof", description: "Sheer quantity of results", whenToUse: "Establishing category authority" }], primaryHookCategories: ["F-Social Proof", "A-Specificity", "S-Timeline"], secondaryHookCategories: ["V-Micro-Story", "X-Numbers", "O-Comparison"], incompatibleHookCategories: ["E-Contrarian", "M-Challenge", "T-Confession"], bestFunnelStages: [3, 5, 6], psychologicalPrinciples: ["Social comparison", "Herd behavior", "FOMO", "Authority transfer"] },
  { id: 15, name: "Curiosity & Open Loop", mechanism: "Create information gap the audience feels compelled to close.", variants: [{ name: "Withheld Reveal", description: "Promises info, delays payoff", whenToUse: "Have genuinely surprising insight" }, { name: "Partial Story", description: "Compelling narrative left unfinished", whenToUse: "Have genuinely dramatic story" }, { name: "Unexpected Pairing", description: "Combines two unrelated domains", whenToUse: "Standard content blending into feed" }, { name: "Forbidden Knowledge", description: "Something you shouldn't share", whenToUse: "Have genuinely non-obvious insider insight" }], primaryHookCategories: ["D-Curiosity", "V-Micro-Story", "E-Contrarian"], secondaryHookCategories: ["A-Specificity", "T-Confession", "L-Reframe"], incompatibleHookCategories: ["R-Process", "F-Social Proof", "N-Permission"], bestFunnelStages: [1, 2], psychologicalPrinciples: ["Zeigarnik effect", "Narrative transportation", "Information gap theory", "Reactance theory"] },
  { id: 16, name: "Authority & Expertise", mechanism: "Demonstrate depth of knowledge, experience, or access.", variants: [{ name: "Earned Opinion", description: "Perspective backed by experience", whenToUse: "Have genuine uncommon experience" }, { name: "Category Expertise", description: "Deep narrow domain knowledge", whenToUse: "Want to attract serious clients" }, { name: "Experience-Based Declaration", description: "Confident statement from years of practice", whenToUse: "Genuinely hold defensible conviction" }, { name: "Pattern Recognition Claim", description: "Insight from observing hundreds of cases", whenToUse: "Accumulated enough reps for real patterns" }, { name: "Insider Access", description: "Info only available from your position", whenToUse: "Genuinely have access audience doesn't" }], primaryHookCategories: ["J-Authority", "A-Specificity", "P-Data"], secondaryHookCategories: ["E-Contrarian", "D-Curiosity", "V-Micro-Story"], incompatibleHookCategories: ["H-Relatable", "N-Permission", "T-Confession"], bestFunnelStages: [2, 3], psychologicalPrinciples: ["Authority bias", "Expert halo effect", "Costly signaling"] },
  { id: 17, name: "Humor & Pattern Interrupt", mechanism: "Use comedy, absurdity, or surprise to break scroll and lower defenses.", variants: [{ name: "Self-Deprecating Humor", description: "Making fun of own mistakes", whenToUse: "Audience perceives you as too polished" }, { name: "Industry Satire", description: "Exaggerating industry norms", whenToUse: "Positioning as alternative to mainstream" }, { name: "Absurdist Observation", description: "Following situation to logical extreme", whenToUse: "Straight version said 1000x" }, { name: "Unexpected Comparison", description: "Comparing niche to something unrelated", whenToUse: "Audience heard standard explanations" }, { name: "Deadpan Expert", description: "Expertise in flat comedic tone", whenToUse: "As consistent persona element" }], primaryHookCategories: ["H-Relatable", "E-Contrarian", "I-Visual"], secondaryHookCategories: ["B-Identity", "L-Reframe", "Z-Platform"], incompatibleHookCategories: ["J-Authority", "P-Data", "Q-Stakes"], bestFunnelStages: [1, 4], psychologicalPrinciples: ["Pratfall effect", "Incongruity theory", "Benign violation"] },
  { id: 18, name: "Trend & Cultural Moment", mechanism: "Attach content to something already capturing collective attention.", variants: [{ name: "Newsjacking", description: "Attaching expertise to breaking news", whenToUse: "Within 24-48 hours of breaking story" }, { name: "Trend Application", description: "Applying viral format to niche", whenToUse: "During trend growth phase" }, { name: "Platform Moment Response", description: "Reacting to platform changes", whenToUse: "Within 24-48 hours of platform change" }, { name: "Zeitgeist Commentary", description: "Naming the broader cultural mood", whenToUse: "Perceive shift not yet widely named" }], primaryHookCategories: ["K-Urgency", "Z-Platform", "E-Contrarian"], secondaryHookCategories: ["D-Curiosity", "L-Reframe", "H-Relatable"], incompatibleHookCategories: ["R-Process", "A-Specificity", "J-Authority"], bestFunnelStages: [1], psychologicalPrinciples: ["Cognitive priming", "Authority through currency", "Borrowed relevance"] },
  { id: 19, name: "Comparison & Contrast", mechanism: "Place two things side by side to make a point through difference.", variants: [{ name: "Before & After", description: "Two states of same subject", whenToUse: "Have genuine transformation" }, { name: "This vs. That", description: "Two options compared directly", whenToUse: "Audience stuck between options" }, { name: "Amateur vs. Professional", description: "Same task at different skill levels", whenToUse: "Audience actively leveling up" }, { name: "Right Way vs. Wrong Way", description: "Incorrect vs correct side by side", whenToUse: "See common mistake being repeated" }, { name: "Expectation vs. Reality", description: "What people think vs what happens", whenToUse: "Audience holds idealized views" }], primaryHookCategories: ["O-Comparison", "A-Specificity", "I-Visual"], secondaryHookCategories: ["E-Contrarian", "C-Mistake", "L-Reframe"], incompatibleHookCategories: ["N-Permission", "T-Confession", "H-Relatable"], bestFunnelStages: [2, 3], psychologicalPrinciples: ["Contrast effect", "Gap-detection", "Social comparison"] },
  { id: 20, name: "Challenge & Provocation", mechanism: "Directly dare or push the audience to act, respond, or prove something.", variants: [{ name: "Direct Challenge", description: "Telling audience to do something difficult", whenToUse: "Audience has knowledge lacks activation" }, { name: "Assumption Challenge", description: "Questioning something taken for granted", whenToUse: "Audience operates on unexamined beliefs" }, { name: "Comfort Challenge", description: "Calling out complacency", whenToUse: "Audience stuck in learning mode" }, { name: "Inaction Challenge", description: "Exposing cost of doing nothing", whenToUse: "Audience in analysis paralysis" }, { name: "Standard Challenge", description: "Raising the bar on good enough", whenToUse: "Audience plateaued without realizing" }], primaryHookCategories: ["M-Challenge", "E-Contrarian", "Q-Stakes"], secondaryHookCategories: ["B-Identity", "K-Urgency", "A-Specificity"], incompatibleHookCategories: ["N-Permission", "G-Aspiration", "H-Relatable"], bestFunnelStages: [4, 5], psychologicalPrinciples: ["Identity-based motivation", "Productive discomfort", "Loss aversion"] },
  { id: 21, name: "Hybrid & Combination", mechanism: "Fuse two or more angle families for categorically stronger results.", variants: [{ name: "Contrarian Story", description: "Contrarian position via narrative", whenToUse: "Have contrarian position AND real story" }, { name: "Data-Backed Myth Bust", description: "Myth dismantled with cited data", whenToUse: "Can cite real verifiable data" }, { name: "Aspirational Reframe", description: "Desire + shifted perspective", whenToUse: "Audience frustrated with conventional path" }, { name: "Curiosity-Driven Framework", description: "Open loop resolving into system", whenToUse: "Have genuine system producing results" }, { name: "Social Proof Story", description: "Client result through narrative", whenToUse: "Have genuine client stories" }], primaryHookCategories: ["Y-Hybrid", "D-Curiosity", "V-Micro-Story"], secondaryHookCategories: ["A-Specificity", "E-Contrarian", "F-Social Proof"], incompatibleHookCategories: [], bestFunnelStages: [1, 2, 3, 4, 5, 6], psychologicalPrinciples: ["Mechanism stacking", "Multiple trigger activation"] },
  { id: 22, name: "Confession & Vulnerability", mechanism: "Share something risky or revealing to build deep trust. Vulnerability-authority paradox.", variants: [{ name: "Honest Admission", description: "Confessing something uncomfortable", whenToUse: "Gap between perception and truth growing" }, { name: "Unpopular Opinion", description: "Belief that might cost followers", whenToUse: "Have genuine conviction you've been softening" }, { name: "Regret Confession", description: "What you'd do differently", whenToUse: "Have genuine hindsight on audience's decision" }], primaryHookCategories: ["T-Confession", "V-Micro-Story", "H-Relatable"], secondaryHookCategories: ["A-Specificity", "D-Curiosity", "N-Permission"], incompatibleHookCategories: ["J-Authority", "F-Social Proof", "R-Process"], bestFunnelStages: [4], psychologicalPrinciples: ["Transparency heuristic", "Costly signaling", "Pratfall effect"] },
  { id: 23, name: "Permission & Reassurance", mechanism: "Give explicit permission to feel, think, or act in a way they've been resisting.", variants: [{ name: "Permission to Quit", description: "Okay to stop", whenToUse: "Audience burning out on advice" }, { name: "Permission to Start Small", description: "Validates imperfect beginnings", whenToUse: "Audience in preparation phase" }, { name: "Permission to Feel", description: "Normalizes an emotion", whenToUse: "Audience in struggling season" }, { name: "Permission to Be Different", description: "Validates unconventional path", whenToUse: "Audience performing behaviors they don't gravitate toward" }, { name: "Reassurance Through Normalizing", description: "Struggle is universal", whenToUse: "Predictable challenge causing anxiety" }], primaryHookCategories: ["N-Permission", "H-Relatable", "B-Identity"], secondaryHookCategories: ["T-Confession", "V-Micro-Story", "L-Reframe"], incompatibleHookCategories: ["M-Challenge", "E-Contrarian", "Q-Stakes"], bestFunnelStages: [4, 5], psychologicalPrinciples: ["Sunk cost fallacy", "Validation effect", "Distinctiveness motive"] },
  { id: 24, name: "Prediction & Future-Casting", mechanism: "Project forward in time claiming what will happen. Builds authority as trusted advisor.", variants: [{ name: "Industry Prediction", description: "Where industry is headed", whenToUse: "See clear signals of change" }, { name: "Platform Prediction", description: "Platform algorithm/feature changes", whenToUse: "Observing signals of upcoming changes" }, { name: "Behavior Prediction", description: "How audience behavior will shift", whenToUse: "Observing genuine behavior shift" }, { name: "Personal Trajectory Prediction", description: "What will happen to THEM on current path", whenToUse: "Audience at behavioral crossroads" }], primaryHookCategories: ["K-Urgency", "E-Contrarian", "D-Curiosity"], secondaryHookCategories: ["P-Data", "J-Authority", "Q-Stakes"], incompatibleHookCategories: ["H-Relatable", "N-Permission", "T-Confession"], bestFunnelStages: [1, 2, 3], psychologicalPrinciples: ["Uncertainty reduction", "Authority heuristic", "Temporal self-continuity"] },
  { id: 25, name: "Curation & Resource", mechanism: "Position as filter and guide in overwhelming information landscape.", variants: [{ name: "Best-Of List", description: "Curated collection of best tools", whenToUse: "Have genuine experience with enough options" }, { name: "Hidden Gem", description: "Surfacing something underrated", whenToUse: "Genuinely discovered something better" }, { name: "Stack Reveal", description: "Exact tool combination for result", whenToUse: "Stack genuinely produces desired result" }, { name: "Filtered Feed", description: "Summarizing most important info", whenToUse: "Already consuming broadly" }], primaryHookCategories: ["A-Specificity", "X-Numbers", "R-Process"], secondaryHookCategories: ["D-Curiosity", "P-Data", "J-Authority"], incompatibleHookCategories: ["T-Confession", "H-Relatable", "M-Challenge"], bestFunnelStages: [2, 3], psychologicalPrinciples: ["Decision fatigue", "Reciprocity", "Exclusivity motive"] },
  { id: 26, name: "Teaching & Education", mechanism: "Demonstrate expertise through teaching. Foundation of authority-building content.", variants: [{ name: "The Breakdown", description: "Deconstructs complex into simple parts", whenToUse: "Topic intimidating audience" }, { name: "The Analogy", description: "Explains via parallel to familiar domain", whenToUse: "Concept difficult with technical language" }, { name: "The Live Demo", description: "Teaching by showing in real time", whenToUse: "Audience consumed enough theory" }, { name: "The Common Question", description: "Answering most FAQ definitively", whenToUse: "Consistently receive same question" }, { name: "The Advanced Lesson", description: "Only intermediate+ can implement", whenToUse: "Intermediate+ practitioners underserved" }], primaryHookCategories: ["A-Specificity", "R-Process", "D-Curiosity"], secondaryHookCategories: ["X-Numbers", "J-Authority", "E-Contrarian"], incompatibleHookCategories: ["T-Confession", "N-Permission", "H-Relatable"], bestFunnelStages: [2, 3], psychologicalPrinciples: ["Chunking effect", "Conceptual blending", "Reciprocity", "Mastery drive"] },
];
```

- [ ] **Step 3: Create hooks data**

Create `src/data/hooks.ts`:
```ts
import { HookCategory } from "@/lib/types";

export const hooks: HookCategory[] = [
  { id: "A", name: "Specificity", mechanism: "Precision as credibility — specific numbers and details signal insider knowledge", formulas: [{ code: "A6", name: "Exact Cost Hook", pattern: "[Exact dollar amount] — that's exactly what it cost me to [outcome]. Here's the breakdown.", examples: ["$4,217 — that's what it actually cost me to go from zero to ten thousand a month."] }, { code: "A7", name: "Specific Failure Number Hook", pattern: "I [failed/lost/wasted] [specific number] [times/dollars] before I figured out [thing].", examples: ["I lost $43,000 and blew through 6 business ideas before I figured out the one thing that actually matters."] }, { code: "A9", name: "Time-Stamped Result Hook", pattern: "At [exact time/date], [thing happened]. By [exact time/date], [result].", examples: ["On March 3rd I had 412 followers and $0. On April 17th — 45 days later — I had my first $10K month."] }, { code: "A10", name: "Inventory Hook", pattern: "Everything I [use/own/do] to [outcome] — listed out, no gatekeeping.", examples: ["Every single thing I use to run my business — every app, every tool, every subscription."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Screen/Device", "Carousel"], bestFunnelStages: [1, 2, 3] },
  { id: "B", name: "Identity", mechanism: "Self-recognition — viewer stops because they see themselves named", formulas: [{ code: "B7", name: "Anti-Identity Hook", pattern: "If you're the kind of person who [negative trait], this isn't for you. But if you're [positive identity] — keep watching.", examples: ["If you're still blaming the algorithm, this will annoy you. But if you're ready to hear what's actually wrong — this is the most important 60 seconds you'll watch."] }, { code: "B8", name: "Stage-of-Life Identity Hook", pattern: "You're [age/life stage] and you're realizing that [realization]. Nobody told you about this part.", examples: ["You're 27 and you're realizing that the career you chose at 21 doesn't fit anymore."] }, { code: "B9", name: "Behavioral Identity Hook", pattern: "You don't [trait], you don't [trait], but you [subtle behavior] — and that's exactly why [outcome].", examples: ["You don't post every day, don't have a huge following, but you screenshot content ideas at 2 AM."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Text-on-Screen"], bestFunnelStages: [1, 4, 5] },
  { id: "C", name: "Mistake & Warning", mechanism: "Threat detection — brain's negativity bias prioritizes potential danger, losses weighted 2x vs gains", formulas: [{ code: "C7", name: "Silent Killer Hook", pattern: "The thing [killing] your [result] isn't [obvious suspect] — it's [unexpected thing].", examples: ["The thing killing your content isn't your hooks or the algorithm. It's something in the first 0.3 seconds."] }, { code: "C8", name: "Expensive Mistake Hook", pattern: "[Action] is costing you [quantified loss] every [timeframe] — and you're doing it right now.", examples: ["The way you write your email subject lines is costing you 67% of your opens."] }, { code: "C9", name: "Cascade Failure Hook", pattern: "[Minor action] leads to [consequence] leads to [bigger] leads to [devastating]. Starts with [minor].", examples: ["Skipping one follow-up → lost lead → empty pipeline → revenue gap → discounted offers."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Text-on-Screen", "Split Screen"], bestFunnelStages: [1, 2, 5] },
  { id: "D", name: "Curiosity & Open Loop", mechanism: "Zeigarnik effect — incomplete information creates cognitive tension demanding resolution", formulas: [{ code: "D9", name: "Withheld Variable Hook", pattern: "I changed [one variable] about my [system] and [dramatic result]. I'll show you exactly what.", examples: ["I added one sentence to every sales call and my close rate went from 22% to 39%."] }, { code: "D10", name: "Incomplete List Hook", pattern: "There are [number] reasons [thing]. Most people know [n-1]. The one they're missing is...", examples: ["There are 5 reasons your content gets low engagement. You probably know 4."] }, { code: "D13", name: "Contradiction Hook", pattern: "[Statement A] is true. [Contradicting Statement B] is also true. Understanding why is the difference.", examples: ["You need to post consistently to grow. You also need to disappear sometimes."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Tension/Suspense", "B-Roll/VO"], bestFunnelStages: [1, 2] },
  { id: "E", name: "Contrarian", mechanism: "Belief disruption — challenges worldview forcing re-evaluation via cognitive dissonance", formulas: [{ code: "E6", name: "Industry Heresy Hook", pattern: "I work in [industry] and I'll tell you what nobody will say publicly: [truth].", examples: ["I'm a licensed dietitian and 80% of the supplements recommended by influencers have zero clinical evidence."] }, { code: "E8", name: "Reverse Advice Hook", pattern: "If you want to [fail at thing], here's exactly what to do: [common advice as failure instructions].", examples: ["If you want your business to fail: Step 1: Perfect your logo. Step 2: Build a website before a single customer."] }, { code: "E10", name: "Permission to Disagree Hook", pattern: "You've been told [advice] by everyone. Part of you has always felt it's wrong. Trust that feeling.", examples: ["Everyone says you need a content strategy before you start posting. Part of you thinks that's procrastination."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Text-on-Screen"], bestFunnelStages: [1, 2] },
  { id: "F", name: "Social Proof", mechanism: "Herd validation — others' behavior reduces perceived risk", formulas: [{ code: "F5", name: "Specific Client Moment Hook", pattern: "My [client] texted me [exact quote] [time]. That's when I knew [insight].", examples: ["My client Sarah texted me at 11:30 on a Tuesday night: 'I just closed my first $10K month.'"] }, { code: "F8", name: "Volume Proof Hook", pattern: "[Large number] [clients] in [timeframe]. Not followers. Not views. [Meaningful metric].", examples: ["347 people have gone through this program in 18 months. Not followers — paying clients."] }], primaryFormatFamilies: ["Multi-Person", "PIP", "Process/Transformation", "Screen/Device"], bestFunnelStages: [3, 5, 6] },
  { id: "G", name: "Aspiration", mechanism: "Identity desire — viewer sees the person they want to become, reward-anticipation dopamine", formulas: [{ code: "G4", name: "Tuesday Morning Hook", pattern: "Here's what [ordinary time] looks like when you [achieved outcome]. Nobody shows this part.", examples: ["Here's what a normal Wednesday looks like when your content creates income while you sleep."] }, { code: "G6", name: "Aspirational Contrast Hook", pattern: "A year ago I was [painful]. Right now I'm [aspirational]. The distance wasn't [expected] — it was [unexpected].", examples: ["A year ago I was checking my bank account every morning with anxiety. Now I check it curious how much came in overnight."] }], primaryFormatFamilies: ["Environmental Storytelling", "B-Roll/VO", "Talking Head"], bestFunnelStages: [1, 4, 5] },
  { id: "H", name: "Relatable", mechanism: "Mirror neuron recognition — instant emotional identification with shared experience", formulas: [{ code: "H5", name: "Intrusive Thought Hook", pattern: "Tell me you're [identity] without telling me. I'll go first: [private thought].", examples: ["Tell me you're an entrepreneur without telling me. I'll go first: I've calculated how many clients would need to leave before I couldn't pay rent."] }, { code: "H8", name: "Internal Monologue Hook", pattern: "The conversation in your head right now: [exact internal monologue].", examples: ["'I'll start Monday. This time for real. But actually, I should plan first...' You've been in this loop for 6 months."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Text-on-Screen"], bestFunnelStages: [1, 4] },
  { id: "I", name: "Visual-First", mechanism: "Pre-cognitive processing — visual pattern interrupts bypass rational evaluation", formulas: [{ code: "I8", name: "Frozen Action Hook", pattern: "First frame: creator frozen mid-action in unusual pose.", examples: ["(Visual: freeze mid-gesture, mouth open, eyes wide — cut mid-word)"] }, { code: "I11", name: "Pattern Break Visual Hook", pattern: "First frame breaks viewer's feed pattern — unexpected color, extreme close-up.", examples: ["(Visual: extreme macro close-up of unexpected object with bold color)"] }], primaryFormatFamilies: ["Environmental Storytelling", "Color/Visual Rhythm", "Spatial/Depth"], bestFunnelStages: [1] },
  { id: "J", name: "Authority & Credibility", mechanism: "Expertise heuristic — specific experience markers shortcut credibility evaluation", formulas: [{ code: "J1", name: "Pattern Recognition Hook", pattern: "After [volume of experience], you start to see [pattern]. Once you see it, you can't unsee it.", examples: ["After working with 300 business owners, there's one pattern in every single failure."] }, { code: "J3", name: "Diagnostic Authority Hook", pattern: "I can tell within [timeframe] of [looking at] your [thing] exactly [what's wrong].", examples: ["Give me 30 seconds of your content and I can tell you exactly why it's not growing."] }], primaryFormatFamilies: ["Talking Head", "Screen/Device", "Documentary"], bestFunnelStages: [2, 3] },
  { id: "K", name: "Urgency & Timing", mechanism: "Temporal scarcity — time pressure converts passive interest to immediate attention", formulas: [{ code: "K1", name: "Window Closing Hook", pattern: "[Strategy] still works right now — but the window is closing.", examples: ["Organic reach on Reels is still higher than it's been in 2 years. That won't last."] }, { code: "K2", name: "Right Now Moment Hook", pattern: "Right now is the single best time to [action]. Here's why.", examples: ["April 2026 is the single best month to start a content business."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Text-on-Screen"], bestFunnelStages: [5, 6] },
  { id: "L", name: "Reframe & Perspective Shift", mechanism: "Cognitive reorientation — familiar information becomes unfamiliar through new lens. Highest save rates.", formulas: [{ code: "L1", name: "Lens Shift Hook", pattern: "Stop thinking about [topic] as [common lens]. Start thinking about it as [new lens].", examples: ["Stop thinking about content creation as marketing. Start thinking about it as product development."] }, { code: "L4", name: "Wrong Question Hook", pattern: "You keep asking '[common question].' The right question is '[reframed question].'", examples: ["You keep asking 'how do I get more followers?' The right question: 'how do I get 20 people in my DMs this week?'"] }], primaryFormatFamilies: ["Typography", "Talking Head", "Text-on-Screen", "Carousel"], bestFunnelStages: [2, 3, 4] },
  { id: "M", name: "Direct Challenge", mechanism: "Ego activation — personal challenge triggers need to prove/disprove. Highest comment rates.", formulas: [{ code: "M1", name: "Capability Question Hook", pattern: "Can you actually [skill]? Because [evidence most can't]. Let's find out.", examples: ["Can you actually write a hook? Because 90% of creators who think their hooks are good are writing introductions."] }], primaryFormatFamilies: ["Talking Head", "Interactive", "Text-on-Screen"], bestFunnelStages: [4, 5] },
  { id: "N", name: "Permission & Validation", mechanism: "Suppression relief — validates what they've been afraid to feel. Highest DM rates.", formulas: [{ code: "N1", name: "It's Okay Hook", pattern: "It's okay that you [guilty thing]. You're not [negative]. You're [positive reframe].", examples: ["It's okay that you haven't started yet. You're not lazy. You're someone who wants to do it right."] }, { code: "N2", name: "You're Not Crazy Hook", pattern: "If you've been feeling like [unsettling feeling], you're not crazy. You're [what's actually happening].", examples: ["If something feels off even though you're doing everything right — you're not crazy. You're experiencing a market shift."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Text-on-Screen"], bestFunnelStages: [4, 5] },
  { id: "O", name: "Comparison & Contrast", mechanism: "Distinction clarity — side-by-side forces self-placement", formulas: [{ code: "O1", name: "Amateur vs Professional Hook", pattern: "[Amateur] [action]: [how]. [Pro] [action]: [how]. The difference is [factor].", examples: ["Amateur writes the caption first. Pro writes the hook first. That one sequence difference is the entire gap."] }], primaryFormatFamilies: ["Split Screen", "Typography", "Carousel", "Screen/Device"], bestFunnelStages: [2, 3] },
  { id: "P", name: "Data & Research", mechanism: "Evidence surprise — specific finding contradicts assumed reality. Highest saves IG, shares LinkedIn.", formulas: [{ code: "P1", name: "Single Stat Hook", pattern: "[Surprising statistic]. Let that sink in. Here's what it means for [your situation].", examples: ["80% of sales are made after the 5th follow-up. Most salespeople stop after one."] }], primaryFormatFamilies: ["Typography", "Screen/Device", "Carousel", "Split Screen"], bestFunnelStages: [2, 3] },
  { id: "Q", name: "Stakes & Consequence", mechanism: "Loss/gain salience — naming what's at stake makes inaction feel costly", formulas: [{ code: "Q1", name: "What's At Stake Hook", pattern: "What's at stake if you [don't/keep doing] [thing] isn't [what you think]. It's [larger consequence].", examples: ["What's at stake if you don't learn to sell isn't revenue. It's every idea you'll have that dies."] }], primaryFormatFamilies: ["Talking Head", "Typography"], bestFunnelStages: [5, 6] },
  { id: "R", name: "Process Revelation", mechanism: "Method curiosity — existence of navigable system creates hope and intrigue", formulas: [{ code: "R1", name: "Exact System Hook", pattern: "Here's the exact [system] I use to [outcome] — step by step, nothing left out.", examples: ["Here's the exact system I use to go from content idea to published Reel in under 40 minutes."] }], primaryFormatFamilies: ["Screen/Device", "Process/Transformation", "Talking Head", "Carousel"], bestFunnelStages: [2, 3] },
  { id: "S", name: "Timeline & Transformation", mechanism: "Temporal specificity — concrete timeframe makes outcomes feel achievable", formulas: [{ code: "S1", name: "X Days To Y Hook", pattern: "[Number] days from now, you could [outcome]. Here's what that looks like day by day.", examples: ["90 days from right now, you could have a fully functioning content machine."] }], primaryFormatFamilies: ["Process/Transformation", "Typography", "Talking Head"], bestFunnelStages: [3, 5] },
  { id: "T", name: "Confession & Transparency", mechanism: "Vulnerability trust — disclosure signals authenticity. Vulnerability-authority paradox.", formulas: [{ code: "T1", name: "I Was Wrong Hook", pattern: "I've been telling you [advice] for [timeframe]. I was wrong. Here's what I should have said.", examples: ["For 2 years, I told every client to post 5 times a week. I was wrong. Fundamentally wrong."] }], primaryFormatFamilies: ["Talking Head", "Text-on-Screen"], bestFunnelStages: [4] },
  { id: "U", name: "Future Pacing", mechanism: "Prospective experiencing — vivid future simulation produces real emotional responses", formulas: [{ code: "U1", name: "Imagine This Hook", pattern: "Imagine [specific future moment in sensory detail]. That's not fantasy. That's [timeframe] from now if you [action].", examples: ["Imagine opening your laptop Monday morning, seeing 3 new clients booked overnight."] }], primaryFormatFamilies: ["B-Roll/VO", "Environmental Storytelling", "Talking Head"], bestFunnelStages: [4, 5, 6] },
  { id: "V", name: "Micro-Story", mechanism: "Narrative compression — complete story arc in one sentence creates involuntary engagement", formulas: [{ code: "V1", name: "One-Sentence Story Hook", pattern: "[Character] + [unexpected thing] + [consequence]. And the lesson is [teased].", examples: ["My client made one cold DM on a Tuesday — same DM she'd sent 112 times — and it turned into a $47,000 contract."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Documentary"], bestFunnelStages: [1, 3, 4] },
  { id: "W", name: "Definition Reframe", mechanism: "Semantic disruption — redefining familiar term makes known feel unknown", formulas: [{ code: "W1", name: "Real Definition Hook", pattern: "[Term] doesn't mean [what you think]. It actually means [reframed definition].", examples: ["Consistency doesn't mean posting every day. It means showing up at a rhythm your audience expects."] }], primaryFormatFamilies: ["Typography", "Text-on-Screen", "Talking Head"], bestFunnelStages: [2, 3] },
  { id: "X", name: "Numbers & Math", mechanism: "Numerical revelation — mathematical relationship changes understanding", formulas: [{ code: "X1", name: "Math Nobody Does Hook", pattern: "Do the math on [situation]. [Calculation]. That number is [surprisingly high/low].", examples: ["Do the math on scrolling: 4 hours/day = 28 hours/week = 60 days/year."] }, { code: "X2", name: "Hidden Ratio Hook", pattern: "The ratio that determines [outcome] isn't [obvious]. It's [unexpected]. Most have it inverted.", examples: ["The ratio that predicts sales isn't followers to revenue. It's saves to shares."] }], primaryFormatFamilies: ["Typography", "Screen/Device", "Carousel"], bestFunnelStages: [2, 3] },
  { id: "Y", name: "Hybrid", mechanism: "Mechanism stacking — two psychological triggers firing simultaneously exceed either alone", formulas: [{ code: "Y1", name: "Authority + Confession", pattern: "After [experience volume], here's what I should have been telling you — and why I didn't.", examples: ["After 8 years in this industry, here's what I should have told every client on day one."] }, { code: "Y4", name: "Specificity + Micro-Story", pattern: "[Number] [timeframe] ago, [character] was [start]. Today: [result]. The difference: [teased].", examples: ["14 months ago, my client had 412 followers and zero revenue. Today: 22,000 followers and $11K/month."] }], primaryFormatFamilies: ["Talking Head", "Typography", "Documentary", "B-Roll/VO"], bestFunnelStages: [1, 2, 3, 4, 5, 6] },
  { id: "Z", name: "Platform-Native", mechanism: "Cultural fluency — leveraging platform-specific behaviors signals insider status", formulas: [{ code: "Z1", name: "Comment Call-Out Hook", pattern: "Someone commented '[comment]' on my last post. Let's talk about that.", examples: ["Someone commented: 'This sounds great but it would never work in MY industry.'"] }, { code: "Z3", name: "Algorithm Transparency Hook", pattern: "If this showed up on your feed, it's because [reason algorithm selected you].", examples: ["The algorithm didn't show you this by accident. You've been consuming content about this topic."] }], primaryFormatFamilies: ["Talking Head", "Text-on-Screen"], bestFunnelStages: [1, 4] },
  { id: "AA", name: "Audio-Only", mechanism: "Auditory arrest — sound alone creates stop before eyes reach screen", formulas: [{ code: "AA1", name: "Whisper-to-Command Hook", pattern: "(whispered) Most people will scroll past this... (normal) Don't.", examples: ["(whispered) Most people will scroll past this... (normal) Don't. The next 45 seconds will save you 6 months."] }], primaryFormatFamilies: ["Talking Head", "B-Roll/VO", "Musical/Rhythmic"], bestFunnelStages: [1] },
  { id: "AB", name: "Silent & Text-Only", mechanism: "Visual-text sufficiency — full scroll-stop with zero audio", formulas: [{ code: "AB1", name: "Bold Statement Text Hook", pattern: "Single provocative statement in large text — no creator visible.", examples: ["YOUR CONTENT IS FINE. YOUR HOOKS ARE THE PROBLEM."] }, { code: "AB2", name: "Text Reveal Hook", pattern: "Text appears line by line, each addition changing meaning.", examples: ["I quit my job. → I lost my savings. → I failed publicly. → Best year of my life."] }], primaryFormatFamilies: ["Typography", "Text-on-Screen", "Kinetic Text"], bestFunnelStages: [1] },
];
```

- [ ] **Step 4: Create remaining data files**

Create `src/data/funnel-stages.ts`:
```ts
import { FunnelStage } from "@/lib/types";

export const funnelStages: FunnelStage[] = [
  { number: 1, name: "Interruption", psychologicalState: "Passive scrolling, diffuse attention, 0.3-1.5 second rejection rate. Zero trust, zero awareness. Brain operating on binary: does this break my pattern enough to stop?", creativeJob: "Stop the scroll. Not educate, impress, or convert.", optimalAngles: ["Contrarian", "Counterintuitive", "Mistake & Warning", "Relatability", "Humor", "Trend", "Identity & Tribe", "Curiosity & Open Loop"], optimalHooks: ["E-Contrarian", "D-Curiosity", "I-Visual", "H-Relatable", "C-Mistake", "B-Identity"], optimalFormats: ["Talking Head", "B-Roll/VO", "Text-on-Screen", "Environmental Storytelling", "Typography"], ctaIntensity: "soft", ctaExamples: ["Follow for more", "Save this", "Share with someone who needs it"], metrics: ["Hook rate (40-60% good)", "Reach/Impressions", "New audience %", "Shares"] },
  { number: 2, name: "Consumption", psychologicalState: "Active evaluation. Brain shifted from scanning to testing. Asking: worth my time? Do they know their stuff? Learning something I can't find elsewhere?", creativeJob: "Deliver on the hook's promise. Build competence trust. Earn right to future attention.", optimalAngles: ["Framework & System", "Teaching", "Counterintuitive", "Data & Research", "Curation", "Myth-Busting", "Comparison", "Story"], optimalHooks: ["A-Specificity", "X-Numbers", "D-Curiosity", "R-Process", "P-Data", "E-Contrarian"], optimalFormats: ["Carousel", "Screen/Device", "Typography", "Talking Head", "Documentary"], ctaIntensity: "soft", ctaExamples: ["Save this for later", "Share with someone who needs it"], metrics: ["Save rate (2-5% good)", "Watch time (50%+ retention)", "Carousel completion (30-50%)", "Follow rate (1-3%)"] },
  { number: 3, name: "Interest", psychologicalState: "Active investigation. Shifted from 'Is this person credible?' to 'I think they're credible — now I want to know more.' Reading bio, scrolling grid, checking pinned posts.", creativeJob: "Demonstrate depth of expertise. Provide social proof. Differentiate from alternatives.", optimalAngles: ["Social Proof", "Authority", "Framework & System", "Data & Research", "Comparison", "Teaching", "Behind the Scenes"], optimalHooks: ["F-Social Proof", "J-Authority", "A-Specificity", "P-Data", "S-Timeline"], optimalFormats: ["Carousel", "Documentary", "Screen/Device", "Multi-Person", "Talking Head"], ctaIntensity: "medium", ctaExamples: ["Learn more (link in bio)", "DM me [keyword] for [resource]", "Check the pinned post"], metrics: ["Profile visit rate (5-15%)", "Visit-to-follow rate (20-40%)", "DM inquiry rate"] },
  { number: 4, name: "Relationship", psychologicalState: "Competence trust established. Now emotional evaluation: Do I like this person? Honest? Values aligned? Would I trust them?", creativeJob: "Humanize. Demonstrate values alignment. Create parasocial proximity. Mirror the audience.", optimalAngles: ["Story", "Confession & Vulnerability", "Relatability", "Behind the Scenes", "Identity & Tribe", "Permission", "Aspiration", "Reframe"], optimalHooks: ["V-Micro-Story", "T-Confession", "H-Relatable", "B-Identity", "N-Permission", "U-Future Pacing"], optimalFormats: ["Stories", "Talking Head", "Text-on-Screen", "Environmental Storytelling", "Community/Relationship"], ctaIntensity: "soft", ctaExamples: ["What do you think?", "Has anyone else experienced this?", "DM me your thoughts"], metrics: ["Story reply rate (3-8%)", "DM quality shift", "Comment sentiment depth", "Follower retention (<2% monthly unfollow)"] },
  { number: 5, name: "Engagement", psychologicalState: "Trust sufficient but inertia remains. Never crossed from passive follower to active participant. Needs compelling low-risk reason to act.", creativeJob: "Create low-risk action opportunity. Deliver disproportionate value. Create behavioral precedent. Collect contact info.", optimalAngles: ["Identity & Tribe", "Challenge & Provocation", "Objection Handling", "Social Proof", "Permission", "Aspiration", "Curation"], optimalHooks: ["B-Identity", "M-Challenge", "N-Permission", "K-Urgency", "F-Social Proof", "G-Aspiration"], optimalFormats: ["Interactive", "Community/Relationship", "Stories", "Talking Head", "Multi-Person"], ctaIntensity: "hard", ctaExamples: ["Sign up", "Join", "Download", "Register", "DM me [keyword]"], metrics: ["Opt-in rate (5-15%)", "Email list growth", "Event attendance (30-50%)", "Challenge completion (20-40%)"] },
  { number: 6, name: "Conversion", psychologicalState: "Full trust sequence complete. In decision state: Is this right for me? Can I afford it? What if it doesn't work? Is now the right time?", creativeJob: "Present offer with complete clarity. Address objections before raised. Reduce perceived risk. Create real urgency. Make next step frictionless.", optimalAngles: ["Objection Handling", "Social Proof", "Mistake & Warning", "Aspiration", "Authority", "Permission", "Identity & Tribe"], optimalHooks: ["F-Social Proof", "K-Urgency", "N-Permission", "C-Mistake", "A-Specificity", "Q-Stakes"], optimalFormats: ["Talking Head", "Multi-Person", "Text-on-Screen", "PIP", "Process/Transformation", "Stories"], ctaIntensity: "hard", ctaExamples: ["Buy now", "Enroll today", "Apply here", "Book your call", "Join before [deadline]"], metrics: ["Sales page conversion (2-5% cold, 5-15% warm)", "Application completion (60-80%)", "Cart abandonment (<30%)", "Revenue per follower"] },
];
```

Create `src/data/platforms.ts`:
```ts
import { Platform } from "@/lib/types";

export const platforms: Platform[] = [
  { id: "ig-reels", name: "Instagram Reels", consumptionState: "Passive discovery scroll, visual-first evaluation, 0-3 second hook window", algorithmSignal: "Watch time %, shares, saves, replays, relationship signals", topAngles: ["Contrarian", "Myth-Busting", "Relatability", "Behind the Scenes", "Identity & Tribe", "Humor"], topHooks: ["E-Contrarian", "H-Relatable", "I-Visual", "D-Curiosity", "A-Specificity"], topFormats: ["Talking Head", "B-Roll/VO", "Environmental Storytelling", "Process/Transformation", "Split Screen"], hookTiming: "0-3 seconds, visual hook must work in first frame", failureModes: ["Over-produced content (authenticity penalty)", "No text overlay (muted viewers lost)", "Selling in Stage 1 content"] },
  { id: "ig-stories", name: "Instagram Stories", consumptionState: "Intimate, already-following context, low-production expectation, Stage 3-6 territory", algorithmSignal: "Completion rate, replies, sticker interactions, DMs", topAngles: ["Behind the Scenes", "Confession", "Objection Handling", "Permission", "Social Proof", "Relatability"], topHooks: ["T-Confession", "N-Permission", "H-Relatable", "R-Process"], topFormats: ["Text-on-Screen", "Talking Head", "Interactive", "Community/Relationship"], hookTiming: "2-second tap-through decision, must hook immediately", failureModes: ["Over-produced Stories", "Stage 1 content in Stories", "No interactive elements"] },
  { id: "ig-carousels", name: "Instagram Carousels", consumptionState: "Intent to learn, save-worthy evaluation, willing to invest time swiping", algorithmSignal: "Saves, shares, carousel completion rate, time on post", topAngles: ["Framework & System", "Teaching", "Data & Research", "Curation", "Comparison", "Counterintuitive"], topHooks: ["X-Numbers", "A-Specificity", "D-Curiosity", "O-Comparison"], topFormats: ["Typography", "Text-on-Screen", "Split Screen", "Process/Transformation"], hookTiming: "Slide 1 must work as standalone feed image, 1-2 second scan", failureModes: ["Weak slide 1 (no swipe trigger)", "Too much text per slide", "No CTA on final slide"] },
  { id: "tiktok", name: "TikTok", consumptionState: "Rapid-fire discovery, brutally short attention, content-first not follower-first, 1-second judgment", algorithmSignal: "Watch time %, shares, comments, replays, follows-from-video", topAngles: ["Relatability", "Contrarian", "Story (Micro)", "Humor", "Identity & Tribe", "Counterintuitive"], topHooks: ["E-Contrarian", "D-Curiosity", "H-Relatable", "I-Visual", "C-Mistake", "Z-Platform"], topFormats: ["Talking Head", "B-Roll/VO", "Text-on-Screen", "Interactive", "Split Screen"], hookTiming: "1-second decision, first frame is everything", failureModes: ["Over-produced content", "Slow builds", "Brand-first intros", "Named frameworks (too structured)"] },
  { id: "yt-shorts", name: "YouTube Shorts", consumptionState: "Similar to TikTok but slightly older, more intent-driven, tolerates more depth", algorithmSignal: "CTR, watch time %, likes, subscribes-from-short", topAngles: ["Counterintuitive", "Contrarian", "Myth-Busting", "Framework & System", "Data & Research", "Teaching"], topHooks: ["A-Specificity", "E-Contrarian", "D-Curiosity", "X-Numbers", "P-Data"], topFormats: ["Talking Head", "B-Roll/VO", "Split Screen", "Screen/Device", "Process/Transformation"], hookTiming: "0-3 seconds, similar to Reels", failureModes: ["No subscribe prompt", "Content that doesn't bridge to long-form"] },
  { id: "yt-longform", name: "YouTube Long-Form", consumptionState: "Intent-driven search and browse, willing to invest 10-20+ minutes, seeking depth", algorithmSignal: "Watch time, session time, CTR on thumbnails, likes, comments, subscribes", topAngles: ["Framework & System", "Story", "Teaching", "Data & Research", "Authority", "Behind the Scenes", "Documentary"], topHooks: ["D-Curiosity", "A-Specificity", "V-Micro-Story", "Q-Stakes", "J-Authority"], topFormats: ["Documentary", "Talking Head", "Screen/Device", "PIP", "Multi-Person", "Split Screen"], hookTiming: "First 30 seconds treated with TikTok intensity, then deliver relentlessly", failureModes: ["Weak first 30 seconds", "No chapters", "Single-CTA (need multiple throughout)"] },
  { id: "linkedin", name: "LinkedIn", consumptionState: "Professional context, B2B audience, thought-leadership evaluation, 210-char truncation", algorithmSignal: "Dwell time, comments (especially early), reactions, reshares, follows", topAngles: ["Authority", "Contrarian", "Data & Research", "Story (Decision/Mentor)", "Teaching", "Reframe", "Confession"], topHooks: ["E-Contrarian", "A-Specificity", "T-Confession", "W-Definition", "J-Authority", "P-Data"], topFormats: ["Text posts", "Typography", "Carousel (PDF)", "Talking Head video"], hookTiming: "First line is everything — truncates after ~2 lines", failureModes: ["Casual/unprofessional tone", "Surface-level relatable content", "Link in main post (suppressed)"] },
  { id: "x-twitter", name: "X / Twitter", consumptionState: "Speed-first, news/opinion-oriented, maximum compression, 280 chars", algorithmSignal: "Engagement velocity (first 30 min), replies, quote tweets, bookmarks", topAngles: ["Contrarian", "Relatability", "Humor", "Prediction", "Curation", "Identity & Tribe", "Reframe"], topHooks: ["E-Contrarian", "H-Relatable", "B-Identity", "X-Numbers", "W-Definition"], topFormats: ["Text (tweets/threads)", "Typography (images)", "Interactive (polls)"], hookTiming: "First 5 words determine engagement, entire tweet is the hook", failureModes: ["Long paragraphs", "Visual-dependent content", "Threads without standalone tweet 1"] },
  { id: "facebook", name: "Facebook", consumptionState: "Community-oriented, 35+ demographic, family/friend network, meaningful interactions", algorithmSignal: "Comments, shares to Messenger, group shares, video watch time, reactions", topAngles: ["Story", "Relatability", "Social Proof", "Objection Handling", "Identity & Tribe", "Aspiration", "Permission"], topHooks: ["H-Relatable", "F-Social Proof", "V-Micro-Story", "N-Permission", "C-Mistake"], topFormats: ["Talking Head", "Multi-Person", "Text-on-Screen", "Community/Relationship", "Reels"], hookTiming: "Similar to Instagram but audience more patient, 3-5 second window", failureModes: ["Gen-Z tone", "Link posts in feed (suppressed)", "Ignoring Groups strategy"] },
  { id: "pinterest", name: "Pinterest", consumptionState: "Intent-driven search and planning, aspirational browsing, mostly female, evergreen discovery", algorithmSignal: "Saves (repins), outbound clicks, close-ups, keyword relevance, freshness", topAngles: ["Aspiration", "Curation", "Teaching", "Comparison", "Framework & System", "Social Proof"], topHooks: ["G-Aspiration", "X-Numbers", "O-Comparison", "I-Visual"], topFormats: ["Typography", "Environmental Storytelling", "Process/Transformation", "Text-on-Screen"], hookTiming: "Thumbnail must communicate value proposition without click", failureModes: ["No keyword optimization", "Ugly thumbnails", "Treating it like social media (it's a search engine)"] },
];
```

Create `src/data/pillars.ts`:
```ts
import { ContentPillar } from "@/lib/types";

export const pillars: ContentPillar[] = [
  { id: 1, name: "Awareness", purpose: "Introduce new audiences to your brand, ideas, and point of view", funnelStages: [1, 2], optimalAngles: ["Myth-Busting", "Contrarian", "Counterintuitive", "Trend", "Relatability", "Humor", "Reframe"], optimalHooks: ["E-Contrarian", "D-Curiosity", "I-Visual", "H-Relatable", "C-Mistake"], optimalFormats: ["Talking Head", "B-Roll/VO", "Text-on-Screen", "Environmental Storytelling"], ctaIntensity: "soft" },
  { id: 2, name: "Educational / Value", purpose: "Demonstrate expertise, provide actionable value, build authority", funnelStages: [2, 3], optimalAngles: ["Framework & System", "Teaching", "Data & Research", "Counterintuitive", "Curation", "Comparison", "Myth-Busting"], optimalHooks: ["A-Specificity", "X-Numbers", "R-Process", "J-Authority", "P-Data"], optimalFormats: ["Carousel", "Screen/Device", "Typography", "Talking Head", "Split Screen"], ctaIntensity: "soft" },
  { id: 3, name: "Social Proof", purpose: "Demonstrate results, showcase success, build trust through validation", funnelStages: [3, 5, 6], optimalAngles: ["Social Proof", "Story (Client Transformation)", "Data & Research", "Comparison (Before/After)", "Authority"], optimalHooks: ["F-Social Proof", "S-Timeline", "A-Specificity", "X-Numbers", "O-Comparison"], optimalFormats: ["Multi-Person", "Process/Transformation", "Screen/Device", "PIP", "Documentary"], ctaIntensity: "medium" },
  { id: 4, name: "Relatability", purpose: "Build emotional connection, create parasocial bonding, make audience feel seen", funnelStages: [1, 4], optimalAngles: ["Relatability", "Confession", "Story", "Humor", "Identity & Tribe", "Permission", "Behind the Scenes"], optimalHooks: ["H-Relatable", "T-Confession", "V-Micro-Story", "B-Identity", "N-Permission"], optimalFormats: ["Talking Head", "Text-on-Screen", "Stories", "Environmental Storytelling", "Community/Relationship"], ctaIntensity: "soft" },
  { id: 5, name: "Objection Handling", purpose: "Identify and dismantle reasons audience is not taking action", funnelStages: [5, 6], optimalAngles: ["Objection Handling", "Mistake & Warning", "Social Proof", "Permission", "Comparison", "Reframe"], optimalHooks: ["N-Permission", "C-Mistake", "O-Comparison", "F-Social Proof", "K-Urgency", "A-Specificity"], optimalFormats: ["Talking Head", "Stories", "Split Screen", "Typography", "PIP"], ctaIntensity: "hard" },
  { id: 6, name: "Aspiration / Inspiration", purpose: "Paint vivid picture of desired outcome connected to your brand", funnelStages: [1, 4, 5], optimalAngles: ["Aspiration", "Story", "Identity & Tribe", "Behind the Scenes", "Social Proof", "Permission", "Prediction"], optimalHooks: ["G-Aspiration", "U-Future Pacing", "S-Timeline", "B-Identity", "V-Micro-Story"], optimalFormats: ["Environmental Storytelling", "B-Roll/VO", "Documentary", "Process/Transformation", "Talking Head"], ctaIntensity: "medium" },
];
```

Create `src/data/mechanisms.ts`:
```ts
import { Mechanism } from "@/lib/types";

export const mechanisms: Mechanism[] = [
  { name: "Loss Aversion", description: "Losses are ~2x as psychologically powerful as equivalent gains", triggers: ["Potential loss named", "Cost of inaction quantified", "Before/after framing"], hookCategories: ["C-Mistake", "Q-Stakes", "K-Urgency", "A-Specificity"], anglesFamilies: ["Mistake & Warning", "Objection Handling", "Challenge & Provocation"], formatFamilies: ["Split Screen", "Typography", "Talking Head"] },
  { name: "Zeigarnik Effect", description: "Unfinished tasks occupy more mental space than completed ones — open loops demand closure", triggers: ["Questions unanswered", "Stories unfinished", "Lists incomplete", "Contradictions unresolved"], hookCategories: ["D-Curiosity", "V-Micro-Story", "S-Timeline"], anglesFamilies: ["Curiosity & Open Loop", "Story", "Framework & System"], formatFamilies: ["Tension/Suspense", "Documentary", "Typography"] },
  { name: "Social Proof", description: "Under uncertainty, people follow others' behavior as decision shortcut", triggers: ["Decision uncertainty", "Unfamiliar category", "High stakes"], hookCategories: ["F-Social Proof", "A-Specificity", "X-Numbers"], anglesFamilies: ["Social Proof", "Story (Client)", "Data & Research"], formatFamilies: ["Multi-Person", "PIP", "Process/Transformation"] },
  { name: "Authority", description: "People defer to perceived expertise and credentials", triggers: ["Need for reassurance", "Complex decisions", "Information overload"], hookCategories: ["J-Authority", "A-Specificity", "P-Data"], anglesFamilies: ["Authority & Expertise", "Data & Research", "Teaching"], formatFamilies: ["Talking Head", "Screen/Device", "Documentary"] },
  { name: "Scarcity / Urgency", description: "Limited availability increases perceived value — FOMO activates", triggers: ["Limited time", "Limited quantity", "Exclusive access", "Disappearing content"], hookCategories: ["K-Urgency", "Q-Stakes", "F-Social Proof"], anglesFamilies: ["Trend", "Prediction", "Objection Handling"], formatFamilies: ["Typography", "Talking Head", "Stories"] },
  { name: "Reciprocity", description: "Giving value creates felt obligation to return", triggers: ["Receiving unexpected value", "Free content/tools", "Personalized outreach"], hookCategories: ["R-Process", "A-Specificity", "D-Curiosity"], anglesFamilies: ["Teaching", "Framework & System", "Curation & Resource", "Behind the Scenes"], formatFamilies: ["Carousel", "Screen/Device", "Process/Transformation"] },
  { name: "Commitment & Consistency", description: "Small yeses create pressure for larger yeses — foot-in-the-door", triggers: ["Any public commitment", "Small action taken", "Identity label accepted"], hookCategories: ["M-Challenge", "B-Identity", "N-Permission"], anglesFamilies: ["Challenge & Provocation", "Identity & Tribe", "Objection Handling"], formatFamilies: ["Interactive", "Community/Relationship", "Stories"] },
  { name: "Identity / Self-Concept", description: "People prioritize information relevant to their identity and act consistently with self-image", triggers: ["Identity named", "In-group/out-group drawn", "Aspiring self activated"], hookCategories: ["B-Identity", "G-Aspiration", "N-Permission", "M-Challenge"], anglesFamilies: ["Identity & Tribe", "Aspiration", "Permission", "Challenge & Provocation"], formatFamilies: ["Talking Head", "Typography", "Community/Relationship"] },
  { name: "Curiosity Gap", description: "Brain cannot rest with incomplete information — information gap theory", triggers: ["Knowledge gap revealed", "Surprise hinted", "Pattern broken"], hookCategories: ["D-Curiosity", "E-Contrarian", "L-Reframe"], anglesFamilies: ["Curiosity & Open Loop", "Counterintuitive", "Myth-Busting"], formatFamilies: ["Tension/Suspense", "Typography", "Talking Head"] },
  { name: "Pattern Interrupt", description: "Novelty breaks automatic processing, forcing conscious attention", triggers: ["Visual novelty", "Unexpected statement", "Format break", "Sound surprise"], hookCategories: ["I-Visual", "E-Contrarian", "AA-Audio", "AB-Silent"], anglesFamilies: ["Humor", "Contrarian", "Trend"], formatFamilies: ["Color/Visual Rhythm", "Environmental Storytelling", "Spatial/Depth"] },
  { name: "Narrative Transportation", description: "Story processing bypasses critical faculty and reduces counterarguing", triggers: ["Named character", "Specific setting", "Conflict introduced", "Emotional detail"], hookCategories: ["V-Micro-Story", "T-Confession", "H-Relatable"], anglesFamilies: ["Story", "Confession & Vulnerability", "Relatability", "Behind the Scenes"], formatFamilies: ["Documentary", "Talking Head", "Environmental Storytelling"] },
  { name: "Cognitive Fluency", description: "Easy-to-process = perceived as more true and trustworthy", triggers: ["Simple language", "Clear structure", "Visual clarity", "Familiar patterns"], hookCategories: ["A-Specificity", "R-Process", "W-Definition"], anglesFamilies: ["Framework & System", "Teaching", "Comparison"], formatFamilies: ["Typography", "Carousel", "Split Screen"] },
  { name: "Anchoring / Contrast", description: "First number encountered becomes reference point for all subsequent evaluation", triggers: ["First number seen", "High-low comparison", "Before/after presented"], hookCategories: ["X-Numbers", "O-Comparison", "A-Specificity"], anglesFamilies: ["Comparison", "Data & Research", "Objection Handling (Price)"], formatFamilies: ["Split Screen", "Typography", "Screen/Device"] },
  { name: "Peak-End Rule", description: "Experiences judged by most intense point and ending — invest in strongest proof and close", triggers: ["Emotional peak in content", "Final moment/CTA", "P.S. or final slide"], hookCategories: ["Q-Stakes", "U-Future Pacing", "F-Social Proof"], anglesFamilies: ["Story", "Social Proof", "Aspiration"], formatFamilies: ["Documentary", "Tension/Suspense", "Process/Transformation"] },
  { name: "Borrowed Relevance", description: "Attaching content to something already capturing collective attention", triggers: ["Trending topic", "Cultural moment", "Breaking news", "Seasonal event"], hookCategories: ["Z-Platform", "K-Urgency", "E-Contrarian"], anglesFamilies: ["Trend & Cultural Moment", "Humor"], formatFamilies: ["Text-on-Screen", "Talking Head", "Musical/Rhythmic"] },
  { name: "Parasocial Relationship", description: "One-sided emotional bond where audience feels they know the creator personally", triggers: ["Personal disclosure", "Consistent voice", "Direct address", "Accumulated small moments"], hookCategories: ["T-Confession", "H-Relatable", "N-Permission", "V-Micro-Story"], anglesFamilies: ["Confession & Vulnerability", "Relatability", "Behind the Scenes", "Story", "Permission"], formatFamilies: ["Talking Head", "Stories", "Environmental Storytelling", "Community/Relationship"] },
  { name: "Mere Exposure", description: "Repeated exposure increases positive feelings — familiarity breeds preference", triggers: ["Consistent posting", "Brand asset repetition", "Voice consistency"], hookCategories: ["Z-Platform", "B-Identity"], anglesFamilies: ["Identity & Tribe (Ritual)", "Behind the Scenes (Day-in-Life)"], formatFamilies: ["Stories", "Community/Relationship"] },
  { name: "Cognitive Dissonance", description: "Holding two conflicting beliefs creates psychological discomfort demanding resolution", triggers: ["Belief challenged", "Contradiction exposed", "Identity-behavior gap named"], hookCategories: ["E-Contrarian", "L-Reframe", "M-Challenge", "D-Curiosity"], anglesFamilies: ["Contrarian", "Myth-Busting", "Reframe", "Challenge & Provocation"], formatFamilies: ["Typography", "Talking Head", "Split Screen"] },
  { name: "Bandwagon Effect", description: "People adopt behaviors they see others adopting — social momentum", triggers: ["Volume claims", "Trend positioning", "Community size", "Visible adoption"], hookCategories: ["F-Social Proof", "K-Urgency", "B-Identity"], anglesFamilies: ["Social Proof", "Identity & Tribe", "Trend"], formatFamilies: ["Multi-Person", "Community/Relationship", "Interactive"] },
  { name: "Halo Effect", description: "Positive impression in one area creates assumptions in others — design quality signals product quality", triggers: ["High production value", "Visual polish", "Professional presentation"], hookCategories: ["I-Visual", "J-Authority", "G-Aspiration"], anglesFamilies: ["Authority & Expertise", "Aspiration", "Behind the Scenes"], formatFamilies: ["Color/Visual Rhythm", "Environmental Storytelling", "Typography"] },
];
```

Create `src/data/objectives.ts`:
```ts
import { BusinessObjective } from "@/lib/types";

export const objectives: BusinessObjective[] = [
  { name: "Community / Movement Building", description: "Build tribe identity, shared values, belonging", optimalAngles: ["Identity & Tribe", "Relatability", "Story", "Permission", "Behind the Scenes", "Confession"], optimalFormats: ["Community/Relationship", "Interactive", "Stories", "Multi-Person", "Talking Head"], optimalHooks: ["B-Identity", "H-Relatable", "N-Permission", "T-Confession", "V-Micro-Story"] },
  { name: "Lead Generation", description: "Drive booked calls, email signups, DM inquiries", optimalAngles: ["Framework & System", "Teaching", "Social Proof", "Objection Handling", "Curiosity & Open Loop", "Curation"], optimalFormats: ["Carousel", "Talking Head", "Typography", "Screen/Device", "Interactive"], optimalHooks: ["A-Specificity", "D-Curiosity", "R-Process", "F-Social Proof", "X-Numbers"] },
  { name: "Direct Sales", description: "Drive transactions, purchases, enrollments", optimalAngles: ["Objection Handling", "Social Proof", "Aspiration", "Mistake & Warning", "Authority", "Permission"], optimalFormats: ["Talking Head", "Multi-Person", "PIP", "Process/Transformation", "Typography"], optimalHooks: ["F-Social Proof", "K-Urgency", "N-Permission", "Q-Stakes", "A-Specificity", "C-Mistake"] },
  { name: "Personal Brand Authority", description: "Establish thought leadership and expert positioning", optimalAngles: ["Authority & Expertise", "Contrarian", "Data & Research", "Framework & System", "Teaching", "Prediction"], optimalFormats: ["Talking Head", "Screen/Device", "Documentary", "Typography", "Carousel"], optimalHooks: ["J-Authority", "E-Contrarian", "P-Data", "A-Specificity", "L-Reframe"] },
  { name: "Recruiting / Team Building", description: "Attract talent, build employer brand, show culture", optimalAngles: ["Behind the Scenes", "Identity & Tribe", "Story", "Aspiration", "Social Proof (Team Win)"], optimalFormats: ["Multi-Person", "Environmental Storytelling", "Documentary", "Community/Relationship", "Behind the Scenes"], optimalHooks: ["G-Aspiration", "B-Identity", "V-Micro-Story", "H-Relatable", "T-Confession"] },
  { name: "Education / Audience Development", description: "Grow reach, build trust with new audiences", optimalAngles: ["Teaching", "Framework & System", "Counterintuitive", "Myth-Busting", "Curation", "Comparison"], optimalFormats: ["Carousel", "Typography", "Screen/Device", "Talking Head", "B-Roll/VO"], optimalHooks: ["A-Specificity", "D-Curiosity", "E-Contrarian", "R-Process", "X-Numbers"] },
];
```

Create `src/data/calendar-template.ts`:
```ts
import { ContentPurpose, InstagramFormat } from "@/lib/types";

export interface WeeklySlotTemplate {
  dayOfWeek: string;
  timeOfDay: "AM" | "PM";
  purpose: ContentPurpose;
  defaultFormat: InstagramFormat;
  funnelStage: number;
  pillar: string;
}

export const weeklyTemplate: WeeklySlotTemplate[] = [
  // MONDAY
  { dayOfWeek: "Monday", timeOfDay: "AM", purpose: "social-proof", defaultFormat: "Story", funnelStage: 3, pillar: "Social Proof" },
  { dayOfWeek: "Monday", timeOfDay: "PM", purpose: "value-pain", defaultFormat: "Reel", funnelStage: 2, pillar: "Educational / Value" },
  // TUESDAY
  { dayOfWeek: "Tuesday", timeOfDay: "AM", purpose: "connection", defaultFormat: "Story", funnelStage: 4, pillar: "Relatability" },
  { dayOfWeek: "Tuesday", timeOfDay: "PM", purpose: "value-pain", defaultFormat: "Carousel", funnelStage: 2, pillar: "Educational / Value" },
  // WEDNESDAY
  { dayOfWeek: "Wednesday", timeOfDay: "AM", purpose: "social-proof", defaultFormat: "Carousel", funnelStage: 3, pillar: "Social Proof" },
  { dayOfWeek: "Wednesday", timeOfDay: "PM", purpose: "awareness", defaultFormat: "Reel", funnelStage: 1, pillar: "Awareness" },
  // THURSDAY
  { dayOfWeek: "Thursday", timeOfDay: "AM", purpose: "connection", defaultFormat: "Story", funnelStage: 4, pillar: "Relatability" },
  { dayOfWeek: "Thursday", timeOfDay: "PM", purpose: "value-pain", defaultFormat: "Reel", funnelStage: 2, pillar: "Educational / Value" },
  // FRIDAY
  { dayOfWeek: "Friday", timeOfDay: "AM", purpose: "social-proof", defaultFormat: "Story", funnelStage: 3, pillar: "Social Proof" },
  { dayOfWeek: "Friday", timeOfDay: "PM", purpose: "value-pain", defaultFormat: "Carousel", funnelStage: 2, pillar: "Educational / Value" },
  // SATURDAY
  { dayOfWeek: "Saturday", timeOfDay: "AM", purpose: "social-proof", defaultFormat: "Story", funnelStage: 3, pillar: "Social Proof" },
  { dayOfWeek: "Saturday", timeOfDay: "PM", purpose: "reflection", defaultFormat: "Story", funnelStage: 4, pillar: "Relatability" },
  // SUNDAY
  { dayOfWeek: "Sunday", timeOfDay: "AM", purpose: "connection", defaultFormat: "Story", funnelStage: 4, pillar: "Aspiration / Inspiration" },
  { dayOfWeek: "Sunday", timeOfDay: "PM", purpose: "hard-cta", defaultFormat: "Reel", funnelStage: 6, pillar: "Objection Handling" },
];

export const purposeColors: Record<ContentPurpose, string> = {
  "social-proof": "bg-emerald-600/80 border-emerald-500",
  "value-pain": "bg-red-600/80 border-red-500",
  "connection": "bg-amber-600/80 border-amber-500",
  "awareness": "bg-yellow-500/80 border-yellow-400",
  "objection-handle": "bg-purple-600/80 border-purple-500",
  "soft-cta": "bg-sky-600/80 border-sky-500",
  "hard-cta": "bg-emerald-500/90 border-emerald-400",
  "reflection": "bg-orange-600/80 border-orange-500",
  "testimonial": "bg-green-600/80 border-green-500",
  "identity": "bg-yellow-500/80 border-yellow-400",
};

export const purposeLabels: Record<ContentPurpose, string> = {
  "social-proof": "Social Proof",
  "value-pain": "Value + Pain Point",
  "connection": "Connection",
  "awareness": "Awareness",
  "objection-handle": "Objection Handle",
  "soft-cta": "Soft CTA",
  "hard-cta": "Hard CTA",
  "reflection": "Reflection",
  "testimonial": "Testimonial",
  "identity": "Identity",
};
```

Create `src/data/system-prompt.ts` — this contains the full AI system injection from Part 12 of the Connection Guide:
```ts
export const SYSTEM_PROMPT = `You are a content strategist operating within a specific creative decision-making system called the Content Intelligence Framework. Every piece of content requires four decisions made in strict hierarchical order: (1) Strategic Decision -- select the funnel stage (1-Interruption, 2-Consumption, 3-Interest, 4-Relationship, 5-Engagement, 6-Conversion) and identify the target psychological state. (2) Angle Decision -- select from 26 angle families (Contrarian, Counterintuitive Insight, Mistake/Warning, Story, Framework/System, BTS, Identity/Tribe, Myth-Busting, Reframe, Data/Research, Aspiration, Relatability, Objection Handling, Social Proof, Curiosity/Open Loop, Authority, Humor, Trend, Comparison, Challenge, Hybrid, Confession, Permission, Prediction, Curation, Teaching). (3) Format Decision -- select production container from format families including Talking Head, B-Roll/Voiceover, Text-on-Screen, Typography, Split Screen, PIP, Screen/Device, Documentary, Multi-Person, Interactive, Environmental Storytelling, Process/Transformation, and others. (4) Hook Decision -- select from 28 hook categories (A-Specificity, B-Identity, C-Mistake/Warning, D-Curiosity, E-Contrarian, F-Social Proof, G-Aspiration, H-Relatable, I-Visual-First, J-Authority, K-Urgency, L-Reframe, M-Challenge, N-Permission, O-Comparison, P-Data, Q-Stakes, R-Process, S-Timeline, T-Confession, U-Future Pacing, V-Micro-Story, W-Definition Reframe, X-Numbers, Y-Hybrid, Z-Platform-Native, AA-Audio-Only, AB-Silent/Text-Only).

Content serves six pillars: Awareness, Educational/Value, Social Proof, Relatability, Objection Handling, Aspiration/Inspiration. Content mix targets: 40% Authority (Stages 2-3), 30% Story (Stage 4), 20% Relatable (Stages 1,4), 10% Community (Stages 5-6). Audience temperature mix: Cold 60-70%, Warm 20-30%, Conversion 5-10%.

Every hook must be specified on three dimensions: Visual (what they see), Audio (what they hear), Text (what they read). Body structure follows copywriting frameworks: PAS, AIDA, BAB, PPPP, or PASTOR. CTAs follow the formula: Action verb + specific outcome + friction reducer + micro-commitment language. CTA intensity must match funnel stage: Stages 1-2 soft (follow, save, share), Stages 3-4 medium (comment, DM, link in bio), Stages 5-6 hard (buy, sign up, apply).

Every piece of content must deploy a minimum of three psychological mechanisms from: Loss Aversion, Zeigarnik Effect, Social Proof, Authority, Scarcity/Urgency, Reciprocity, Commitment/Consistency, Identity/Self-Concept, Curiosity Gap, Pattern Interrupt, Narrative Transportation, Cognitive Fluency, Anchoring/Contrast, Peak-End Rule, Borrowed Relevance, Parasocial Relationship, Mere Exposure, Cognitive Dissonance, Bandwagon, Halo Effect.

CRITICAL INSTRUCTION: All copy — hooks, captions, CTAs — must be written in the ICP's language. Use their words, their phrases, their tone. Mirror how they speak about their problems and desires. The copy must feel like the viewer wrote it about themselves. Never use generic marketing language. Every piece of content speaks directly to one person — the ICP — and lands because it uses the exact language patterns, frustrations, and aspirations they carry in their head.`;
```

- [ ] **Step 5: Verify TypeScript compilation**

```bash
cd /Users/christophercagle/content-intelligence-engine
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd /Users/christophercagle/content-intelligence-engine
git add src/lib/types.ts src/data/
git commit -m "feat: add complete data layer — angles, hooks, formats, stages, platforms, mechanisms, pillars, objectives, calendar template, system prompt"
```

---

## Task 3: Claude API Integration and Prompt Engineering

**Files:**
- Create: `src/lib/claude.ts`, `src/lib/prompts.ts`, `src/app/api/analyze/route.ts`, `src/app/api/calendar/route.ts`

- [ ] **Step 1: Create Claude API client**

Create `src/lib/claude.ts`:
```ts
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
  const block = message.content[0];
  if (block.type === "text") return block.text;
  throw new Error("Unexpected response type");
}
```

- [ ] **Step 2: Create prompt templates**

Create `src/lib/prompts.ts`:
```ts
import { SYSTEM_PROMPT } from "@/data/system-prompt";
import { angles } from "@/data/angles";
import { hooks } from "@/data/hooks";
import { funnelStages } from "@/data/funnel-stages";
import { platforms } from "@/data/platforms";
import { pillars } from "@/data/pillars";
import { objectives } from "@/data/objectives";
import { weeklyTemplate } from "@/data/calendar-template";

function buildAngleSummary(): string {
  return angles.map(a => `${a.id}. ${a.name}: ${a.mechanism} | Variants: ${a.variants.map(v => v.name).join(", ")} | Best stages: ${a.bestFunnelStages.join(",")}`).join("\n");
}

function buildHookSummary(): string {
  return hooks.map(h => `${h.id}-${h.name}: ${h.mechanism} | Best stages: ${h.bestFunnelStages.join(",")}`).join("\n");
}

function buildPlatformSummary(): string {
  return platforms.map(p => `${p.name}: Top angles: ${p.topAngles.join(", ")} | Top hooks: ${p.topHooks.join(", ")}`).join("\n");
}

export function buildICPAnalysisPrompt(icpInput: string): { system: string; user: string } {
  return {
    system: `${SYSTEM_PROMPT}

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
${objectives.map(o => `${o.name}: ${o.description}`).join("\n")}`,

    user: `Analyze the following ICP (Ideal Customer Profile) and return a JSON object with this EXACT structure. Be extremely specific — use the ICP's actual language, their specific pain points, their actual words and phrases.

ICP INPUT:
${icpInput}

Return ONLY valid JSON with this structure:
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

CRITICAL: Generate at least 10 topCombinations spanning different funnel stages and pillars. Every writtenHook must use the ICP's EXACT language patterns — their words, their frustrations, their desires. These hooks should feel like the ICP wrote them about themselves. Be brutally specific, not generic.`
  };
}

export function buildCalendarPrompt(icpAnalysis: string, calendarLength: number): { system: string; user: string } {
  const templateDesc = weeklyTemplate.map(s => 
    `${s.dayOfWeek} ${s.timeOfDay}: purpose=${s.purpose}, format=${s.defaultFormat}, stage=${s.funnelStage}, pillar=${s.pillar}`
  ).join("\n");

  return {
    system: `${SYSTEM_PROMPT}

You are generating a ${calendarLength}-day content calendar. Every single piece of content must speak DIRECTLY to the ICP using their exact language patterns, frustrations, desires, and tone.

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
${buildHookSummary()}`,

    user: `Generate a complete ${calendarLength}-day content calendar based on this ICP analysis:

${icpAnalysis}

Return ONLY valid JSON with this structure:
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
      "pm": { ... same structure ... }
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
8. Generate ALL ${calendarLength} days with BOTH AM and PM slots fully specified`
  };
}
```

- [ ] **Step 3: Create API route for ICP analysis**

Create `src/app/api/analyze/route.ts`:
```ts
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
```

- [ ] **Step 4: Create API route for calendar generation**

Create `src/app/api/calendar/route.ts`:
```ts
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
```

- [ ] **Step 5: Verify build**

```bash
cd /Users/christophercagle/content-intelligence-engine
npm run build
```

- [ ] **Step 6: Commit**

```bash
cd /Users/christophercagle/content-intelligence-engine
git add src/lib/claude.ts src/lib/prompts.ts src/app/api/
git commit -m "feat: add Claude API integration with ICP analysis and calendar generation endpoints"
```

---

## Task 4: Navigation and Layout Components

**Files:**
- Create: `src/components/nav.tsx`, `src/components/loading-state.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create navigation component**

Create `src/components/nav.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, BarChart3, Calendar, BookOpen } from "lucide-react";

const navItems = [
  { href: "/", label: "Engine", icon: Brain },
  { href: "/recommendations", label: "Recommendations", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/reference", label: "Reference", icon: BookOpen },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Content Intelligence Engine</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create loading state component**

Create `src/components/loading-state.tsx`:
```tsx
import { Brain } from "lucide-react";

interface LoadingStateProps {
  title: string;
  subtitle: string;
}

export function LoadingState({ title, subtitle }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative">
        <Brain className="w-16 h-16 text-primary animate-pulse" />
        <div className="absolute inset-0 w-16 h-16 border-2 border-primary/30 rounded-full animate-spin border-t-primary" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update root layout with nav**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Content Intelligence Engine",
  description: "AI-powered content strategy — from ICP to 30-day calendar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <Nav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/christophercagle/content-intelligence-engine
npm run build
```

- [ ] **Step 5: Commit**

```bash
cd /Users/christophercagle/content-intelligence-engine
git add src/components/nav.tsx src/components/loading-state.tsx src/app/layout.tsx
git commit -m "feat: add navigation bar and loading state components"
```

---

## Task 5: Home Page — ICP Input

**Files:**
- Create: `src/components/icp-input.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create ICP input component**

Create `src/components/icp-input.tsx`:
```tsx
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
```

- [ ] **Step 2: Update home page**

Replace `src/app/page.tsx`:
```tsx
import { ICPInput } from "@/components/icp-input";

export default function Home() {
  return <ICPInput />;
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/christophercagle/content-intelligence-engine
npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/christophercagle/content-intelligence-engine
git add src/components/icp-input.tsx src/app/page.tsx
git commit -m "feat: add ICP input page with example profiles and Claude API analysis"
```

---

## Task 6: Recommendations Page

**Files:**
- Create: `src/components/recommendation-grid.tsx`, `src/components/icp-analysis-card.tsx`, `src/app/recommendations/page.tsx`

- [ ] **Step 1: Create ICP analysis card component**

Create `src/components/icp-analysis-card.tsx`:
```tsx
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
```

- [ ] **Step 2: Create recommendation grid component**

Create `src/components/recommendation-grid.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentCombination } from "@/lib/types";
import { purposeColors } from "@/data/calendar-template";
import { Lightbulb } from "lucide-react";

function stageToPurpose(stage: number): string {
  const map: Record<number, string> = { 1: "Awareness", 2: "Education", 3: "Interest", 4: "Relationship", 5: "Engagement", 6: "Conversion" };
  return map[stage] || "Unknown";
}

export function RecommendationGrid({ combinations }: { combinations: ContentCombination[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-primary" />
        Top Content Combinations
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {combinations.map((combo, i) => (
          <Card key={i} className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{combo.angle}</CardTitle>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">Stage {combo.funnelStage}</Badge>
                  <Badge variant="secondary" className="text-xs">{combo.platform}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-secondary/50 rounded-lg p-3 border border-border">
                <p className="text-sm font-medium text-primary">&ldquo;{combo.writtenHook}&rdquo;</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground block">Hook</span>
                  <span className="font-medium">{combo.hook}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Format</span>
                  <span className="font-medium">{combo.format}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Pillar</span>
                  <span className="font-medium">{combo.pillar}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{combo.reason}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create recommendations page**

Create `src/app/recommendations/page.tsx`:
```tsx
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
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/christophercagle/content-intelligence-engine
npm run build
```

- [ ] **Step 5: Commit**

```bash
cd /Users/christophercagle/content-intelligence-engine
git add src/components/icp-analysis-card.tsx src/components/recommendation-grid.tsx src/app/recommendations/
git commit -m "feat: add recommendations page with ICP analysis display and combination grid"
```

---

## Task 7: Calendar Page

**Files:**
- Create: `src/components/calendar-grid.tsx`, `src/components/calendar-cell.tsx`, `src/components/content-piece-modal.tsx`, `src/app/calendar/page.tsx`

- [ ] **Step 1: Create calendar cell component**

Create `src/components/calendar-cell.tsx`:
```tsx
import { CalendarSlot, ContentPurpose } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { purposeColors, purposeLabels } from "@/data/calendar-template";

interface CalendarCellProps {
  slot: CalendarSlot;
  onClick: () => void;
}

export function CalendarCell({ slot, onClick }: CalendarCellProps) {
  const colorClass = purposeColors[slot.purpose] || "bg-secondary border-border";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2 rounded-lg border ${colorClass} hover:opacity-90 transition-opacity cursor-pointer min-h-[80px]`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
          {slot.timeOfDay}
        </span>
        <Badge variant="outline" className="text-[9px] px-1 py-0 bg-black/20 border-white/20">
          {slot.format}
        </Badge>
      </div>
      <p className="text-[11px] font-semibold leading-tight mb-1">
        {purposeLabels[slot.purpose]}
      </p>
      <p className="text-[10px] opacity-75 leading-tight line-clamp-2">
        {slot.writtenHook}
      </p>
    </button>
  );
}
```

- [ ] **Step 2: Create content piece modal**

Create `src/components/content-piece-modal.tsx`:
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CalendarSlot } from "@/lib/types";
import { purposeLabels } from "@/data/calendar-template";
import { Copy } from "lucide-react";

interface ContentPieceModalProps {
  slot: CalendarSlot | null;
  dayLabel: string;
  open: boolean;
  onClose: () => void;
}

export function ContentPieceModal({ slot, dayLabel, open, onClose }: ContentPieceModalProps) {
  if (!slot) return null;

  function copyCaption() {
    if (slot?.caption) {
      navigator.clipboard.writeText(slot.caption);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {dayLabel} — {slot.timeOfDay}
            <Badge>{slot.format}</Badge>
            <Badge variant="outline">{purposeLabels[slot.purpose]}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Hook</h4>
            <p className="text-lg font-semibold text-primary">&ldquo;{slot.writtenHook}&rdquo;</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">Angle</span>
              <p className="font-medium">{slot.angle} — {slot.angleVariant}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Hook Category</span>
              <p className="font-medium">{slot.hookCategory}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Funnel Stage</span>
              <p className="font-medium">Stage {slot.funnelStage}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Pillar</span>
              <p className="font-medium">{slot.pillar}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Copy Framework</span>
              <p className="font-medium">{slot.copywritingFramework}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">CTA Type</span>
              <p className="font-medium capitalize">{slot.ctaType}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Body Structure</h4>
            <p className="text-sm">{slot.bodyStructure}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">CTA</h4>
            <p className="text-sm font-medium">&ldquo;{slot.writtenCta}&rdquo;</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Psychological Mechanisms</h4>
            <div className="flex flex-wrap gap-1">
              {slot.mechanisms.map((m, i) => (
                <Badge key={i} variant="outline" className="text-xs">{m}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Caption</h4>
              <Button variant="ghost" size="sm" onClick={copyCaption}>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-sm whitespace-pre-wrap border border-border">
              {slot.caption}
            </div>
          </div>

          {slot.productionNotes && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Production Notes</h4>
              <p className="text-sm text-muted-foreground">{slot.productionNotes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Create calendar grid component**

Create `src/components/calendar-grid.tsx`:
```tsx
"use client";

import { useState } from "react";
import { ContentCalendar, CalendarSlot } from "@/lib/types";
import { CalendarCell } from "@/components/calendar-cell";
import { ContentPieceModal } from "@/components/content-piece-modal";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function CalendarGrid({ calendar }: { calendar: ContentCalendar }) {
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null);
  const [selectedDayLabel, setSelectedDayLabel] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Group days into weeks
  const weeks: typeof calendar.days[][] = [];
  for (let i = 0; i < calendar.days.length; i += 7) {
    weeks.push(calendar.days.slice(i, i + 7));
  }

  function handleCellClick(slot: CalendarSlot, dayLabel: string) {
    setSelectedSlot(slot);
    setSelectedDayLabel(dayLabel);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Week {weekIdx + 1}</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekIdx === 0 && daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground pb-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {week.map((day) => (
              <div key={day.dayNumber} className="space-y-1">
                <div className="text-center text-xs text-muted-foreground">{day.dayNumber}</div>
                <CalendarCell
                  slot={day.am}
                  onClick={() => handleCellClick(day.am, `Day ${day.dayNumber} (${day.dayOfWeek})`)}
                />
                <CalendarCell
                  slot={day.pm}
                  onClick={() => handleCellClick(day.pm, `Day ${day.dayNumber} (${day.dayOfWeek})`)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <ContentPieceModal
        slot={selectedSlot}
        dayLabel={selectedDayLabel}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
```

- [ ] **Step 4: Create calendar page**

Create `src/app/calendar/page.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarGrid } from "@/components/calendar-grid";
import { ContentCalendar } from "@/lib/types";
import { ArrowLeft, Download } from "lucide-react";

export default function CalendarPage() {
  const [calendar, setCalendar] = useState<ContentCalendar | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("contentCalendar");
    if (stored) {
      setCalendar(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [router]);

  function exportCSV() {
    if (!calendar) return;
    const rows = [["Day", "Day of Week", "Time", "Purpose", "Format", "Angle", "Hook", "Caption", "CTA", "Funnel Stage", "Pillar"].join(",")];
    for (const day of calendar.days) {
      for (const slot of [day.am, day.pm]) {
        rows.push([
          day.dayNumber,
          day.dayOfWeek,
          slot.timeOfDay,
          slot.purpose,
          slot.format,
          `"${slot.angle} - ${slot.angleVariant}"`,
          `"${slot.writtenHook.replace(/"/g, '""')}"`,
          `"${(slot.caption || "").replace(/"/g, '""')}"`,
          `"${slot.writtenCta.replace(/"/g, '""')}"`,
          slot.funnelStage,
          slot.pillar,
        ].join(","));
      }
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-calendar-${calendar.month?.replace(/\s/g, "-") || "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!calendar) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">30-Day Content Calendar</h1>
          <p className="text-muted-foreground text-sm">{calendar.icpSummary}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/recommendations")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge className="bg-emerald-600/80">Social Proof</Badge>
        <Badge className="bg-red-600/80">Value + Pain Point</Badge>
        <Badge className="bg-amber-600/80">Connection</Badge>
        <Badge className="bg-yellow-500/80">Awareness</Badge>
        <Badge className="bg-purple-600/80">Objection Handle</Badge>
        <Badge className="bg-sky-600/80">Soft CTA</Badge>
        <Badge className="bg-emerald-500/90">Hard CTA</Badge>
        <Badge className="bg-orange-600/80">Reflection</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Click any cell to see the full content brief — hook, angle, format, caption, CTA, and production notes.
      </p>

      <CalendarGrid calendar={calendar} />
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
cd /Users/christophercagle/content-intelligence-engine
npm run build
```

- [ ] **Step 6: Commit**

```bash
cd /Users/christophercagle/content-intelligence-engine
git add src/components/calendar-grid.tsx src/components/calendar-cell.tsx src/components/content-piece-modal.tsx src/app/calendar/
git commit -m "feat: add 30-day content calendar with AM/PM grid, color-coded cells, and detail modal"
```

---

## Task 8: Reference Browser Page

**Files:**
- Create: `src/components/reference-browser.tsx`, `src/app/reference/page.tsx`

- [ ] **Step 1: Create reference browser component**

Create `src/components/reference-browser.tsx`:
```tsx
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { angles } from "@/data/angles";
import { hooks } from "@/data/hooks";
import { funnelStages } from "@/data/funnel-stages";
import { platforms } from "@/data/platforms";
import { mechanisms } from "@/data/mechanisms";
import { pillars } from "@/data/pillars";
import { Search } from "lucide-react";

export function ReferenceBrowser() {
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();

  const filteredAngles = useMemo(() =>
    angles.filter(a => a.name.toLowerCase().includes(q) || a.mechanism.toLowerCase().includes(q) || a.variants.some(v => v.name.toLowerCase().includes(q))),
    [q]
  );

  const filteredHooks = useMemo(() =>
    hooks.filter(h => h.name.toLowerCase().includes(q) || h.mechanism.toLowerCase().includes(q) || h.formulas.some(f => f.name.toLowerCase().includes(q))),
    [q]
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search angles, hooks, stages, platforms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="angles">
        <TabsList>
          <TabsTrigger value="angles">Angles ({filteredAngles.length})</TabsTrigger>
          <TabsTrigger value="hooks">Hooks ({filteredHooks.length})</TabsTrigger>
          <TabsTrigger value="stages">Funnel Stages</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="mechanisms">Mechanisms</TabsTrigger>
          <TabsTrigger value="pillars">Pillars</TabsTrigger>
        </TabsList>

        <TabsContent value="angles" className="space-y-3 mt-4">
          {filteredAngles.map((a) => (
            <Card key={a.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {a.id}. {a.name}
                  <div className="flex gap-1 ml-auto">
                    {a.bestFunnelStages.map(s => (
                      <Badge key={s} variant="outline" className="text-xs">S{s}</Badge>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{a.mechanism}</p>
                <div className="flex flex-wrap gap-1">
                  {a.variants.map((v) => (
                    <Badge key={v.name} variant="secondary" className="text-xs">{v.name}</Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                  <div>
                    <span className="text-muted-foreground block">Primary Hooks</span>
                    {a.primaryHookCategories.map(h => <Badge key={h} className="text-[10px] mr-1 mb-1">{h}</Badge>)}
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Secondary</span>
                    {a.secondaryHookCategories.map(h => <Badge key={h} variant="outline" className="text-[10px] mr-1 mb-1">{h}</Badge>)}
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Avoid</span>
                    {a.incompatibleHookCategories.map(h => <Badge key={h} variant="destructive" className="text-[10px] mr-1 mb-1">{h}</Badge>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="hooks" className="space-y-3 mt-4">
          {filteredHooks.map((h) => (
            <Card key={h.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{h.id} — {h.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{h.mechanism}</p>
                <div className="space-y-2">
                  {h.formulas.map((f) => (
                    <div key={f.code} className="bg-secondary/50 rounded p-2 text-sm border border-border">
                      <span className="font-medium">{f.code}: {f.name}</span>
                      <p className="text-xs text-muted-foreground mt-1">{f.pattern}</p>
                      {f.examples[0] && (
                        <p className="text-xs text-primary/80 italic mt-1">&ldquo;{f.examples[0]}&rdquo;</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="stages" className="space-y-3 mt-4">
          {funnelStages.map((s) => (
            <Card key={s.number}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stage {s.number}: {s.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{s.psychologicalState}</p>
                <p><strong>Job:</strong> {s.creativeJob}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><span className="text-muted-foreground block mb-1">Angles</span>{s.optimalAngles.map(a => <Badge key={a} variant="secondary" className="text-[10px] mr-1 mb-1">{a}</Badge>)}</div>
                  <div><span className="text-muted-foreground block mb-1">Hooks</span>{s.optimalHooks.map(h => <Badge key={h} variant="secondary" className="text-[10px] mr-1 mb-1">{h}</Badge>)}</div>
                  <div><span className="text-muted-foreground block mb-1">CTA</span><Badge className="text-[10px] capitalize">{s.ctaIntensity}</Badge></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-3 mt-4">
          {platforms.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{p.consumptionState}</p>
                <p className="text-xs"><strong>Algorithm:</strong> {p.algorithmSignal}</p>
                <p className="text-xs"><strong>Hook Timing:</strong> {p.hookTiming}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.topAngles.map(a => <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="mechanisms" className="space-y-3 mt-4">
          {mechanisms.filter(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)).map((m) => (
            <Card key={m.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{m.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{m.description}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><span className="text-muted-foreground block mb-1">Hooks</span>{m.hookCategories.map(h => <Badge key={h} variant="secondary" className="text-[10px] mr-1 mb-1">{h}</Badge>)}</div>
                  <div><span className="text-muted-foreground block mb-1">Angles</span>{m.anglesFamilies.map(a => <Badge key={a} variant="secondary" className="text-[10px] mr-1 mb-1">{a}</Badge>)}</div>
                  <div><span className="text-muted-foreground block mb-1">Formats</span>{m.formatFamilies.map(f => <Badge key={f} variant="secondary" className="text-[10px] mr-1 mb-1">{f}</Badge>)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pillars" className="space-y-3 mt-4">
          {pillars.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{p.purpose}</p>
                <div className="text-xs">
                  <span className="text-muted-foreground">Stages: </span>
                  {p.funnelStages.map(s => <Badge key={s} variant="outline" className="text-[10px] mr-1">S{s}</Badge>)}
                  <span className="text-muted-foreground ml-2">CTA: </span>
                  <Badge className="text-[10px] capitalize">{p.ctaIntensity}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 2: Create reference page**

Create `src/app/reference/page.tsx`:
```tsx
import { ReferenceBrowser } from "@/components/reference-browser";

export default function ReferencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Intelligence Reference</h1>
        <p className="text-muted-foreground">
          Browse the complete system — 26 angle families, 28 hook categories, 6 funnel stages, 10 platforms, 20 mechanisms, 6 pillars
        </p>
      </div>
      <ReferenceBrowser />
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/christophercagle/content-intelligence-engine
npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/christophercagle/content-intelligence-engine
git add src/components/reference-browser.tsx src/app/reference/
git commit -m "feat: add searchable reference browser with tabs for angles, hooks, stages, platforms, mechanisms, pillars"
```

---

## Task 9: Deploy to Vercel via GitHub

**Files:**
- None created — deployment commands only

- [ ] **Step 1: Create GitHub repository**

```bash
cd /Users/christophercagle/content-intelligence-engine
gh repo create content-intelligence-engine --public --source=. --push
```

- [ ] **Step 2: Deploy to Vercel**

```bash
cd /Users/christophercagle/content-intelligence-engine
vercel link --yes
vercel env add ANTHROPIC_API_KEY
```

When prompted for the value, enter your Anthropic API key.

```bash
vercel --prod
```

- [ ] **Step 3: Verify deployment**

Open the Vercel URL in browser. Test:
1. Home page loads with ICP input
2. Navigation works between all 4 pages
3. Reference browser loads with searchable data

- [ ] **Step 4: Commit any Vercel config**

```bash
cd /Users/christophercagle/content-intelligence-engine
git add -A
git commit -m "chore: add Vercel deployment config"
git push
```
