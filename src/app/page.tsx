import { FilterBar } from "@/components/feed/filter-bar";
import { PostCard } from "@/components/feed/post-card";

export default function FeedPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <h1 className="text-4xl font-semibold">{"\u5b9e\u65f6\u6d41"}</h1>
      <FilterBar />
      <PostCard />
    </main>
  );
}
