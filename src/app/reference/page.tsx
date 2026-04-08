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
