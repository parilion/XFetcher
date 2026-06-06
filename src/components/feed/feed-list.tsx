import { PostCard } from "@/components/feed/post-card";
import type { AihotFeedMode } from "@/lib/aihot";
import type { FeedListItem } from "@/modules/aihot/feed";

type FeedListProps = {
  initialItems: FeedListItem[];
  mode: AihotFeedMode;
};

export function FeedList({
  initialItems,
  mode,
}: FeedListProps) {
  return (
    <section aria-label="AI 资讯时间线" className="timeline">
      {initialItems.map((post) => (
        <PostCard
          categoryLabel={post.categoryLabel}
          clock={post.clock}
          key={post.id}
          publishedAt={post.publishedAt}
          source={post.source}
          summary={post.summary}
          title={post.title}
          url={post.url}
          variant={mode}
        />
      ))}
    </section>
  );
}
