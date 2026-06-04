type PostCardProps = {
  title?: string;
  summary?: string;
};

export function PostCard({
  title = "\u793a\u4f8b\u5185\u5bb9",
  summary = "\u5b9e\u65f6\u6d41\u5185\u5bb9\u5c06\u5728\u540e\u7eed\u4efb\u52a1\u4e2d\u63a5\u5165\u3002",
}: PostCardProps) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-2 text-sm text-black/70">{summary}</p>
    </article>
  );
}
