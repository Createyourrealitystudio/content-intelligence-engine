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
