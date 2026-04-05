/** Compact star count like GitHub (e.g. 1.2k). */
export function formatStarCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n < 1000) return String(Math.floor(n));
  const k = n / 1000;
  if (k < 10) return `${k.toFixed(1).replace(/\.0$/, "")}k`;
  return `${Math.floor(k)}k`;
}
