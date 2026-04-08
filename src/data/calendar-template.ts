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
