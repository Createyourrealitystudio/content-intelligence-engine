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
