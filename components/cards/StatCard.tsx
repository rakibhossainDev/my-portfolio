import { GlassCard } from "@/components/cards/GlassCard";
import { cn } from "@/lib/utils";

type StatCardProps = {
  value: string;
  suffix: string;
  label: string;
  className?: string;
};

export function StatCard({ value, suffix, label, className }: StatCardProps) {
  return (
    <GlassCard className={cn("p-5 text-center sm:p-6", className)}>
      <p className="text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
          {value}
        </span>
        <span className="text-slate-800">{suffix}</span>
      </p>
      <p className="mt-2 text-balance text-sm font-medium leading-snug text-slate-600">{label}</p>
    </GlassCard>
  );
}
