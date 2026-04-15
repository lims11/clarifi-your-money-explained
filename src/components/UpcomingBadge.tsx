export function UpcomingBadge({ label = 'UPCOMING', tooltip }: { label?: string; tooltip?: string }) {
  return (
    <span
      title={tooltip}
      className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
    >
      ⚡ {label}
    </span>
  );
}
