import { AppShell } from "@/components/app-shell";
import { FeedPageContent } from "@/components/feed/feed-page";

type AllFeedPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
    page?: string | string[];
    q?: string | string[];
  }>;
};

export default async function AllFeedPage({ searchParams }: AllFeedPageProps) {
  const params = await searchParams;

  return (
    <AppShell activePath="/all">
      <FeedPageContent
        basePath="/all"
        category={params?.category}
        descriptionPrefix="覆盖全站来源的 AI 动态"
        emptyLabel="全部"
        mode="all"
        page={params?.page}
        q={params?.q}
        title="全部 AI 动态"
      />
    </AppShell>
  );
}
