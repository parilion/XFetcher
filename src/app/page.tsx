import { AppShell } from "@/components/app-shell";
import { FeedPageContent } from "@/components/feed/feed-page";

type FeedPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
    page?: string | string[];
    q?: string | string[];
  }>;
};

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams;

  return (
    <AppShell activePath="/">
      <FeedPageContent
        category={params?.category}
        descriptionPrefix="实时滚动的 AI 资讯"
        emptyLabel="精选"
        mode="selected"
        page={params?.page}
        q={params?.q}
        title="AI HOT"
      />
    </AppShell>
  );
}
