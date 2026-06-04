const FILTER_LABELS = [
  "\u5168\u90e8",
  "\u5f85\u7ffb\u8bd1",
  "\u5df2\u53d1\u5e03",
];

export function FilterBar() {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_LABELS.map((label) => (
        <span
          key={label}
          className="rounded-full border border-black/10 px-3 py-1 text-sm text-black/70"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
