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
