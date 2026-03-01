export function DetailBlock({ label, value }: any) {
  if (!value || value === "N/A") return null;

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>

      <p className="text-sm text-zinc-300 leading-relaxed">{value}</p>
    </div>
  );
}
