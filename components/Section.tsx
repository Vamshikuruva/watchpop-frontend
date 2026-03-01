export function Section({ title, children }: any) {
  return (
    <div className="space-y-8">
      <p className="text-xs tracking-widest uppercase text-zinc-500">{title}</p>
      {children}
    </div>
  );
}
