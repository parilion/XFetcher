import { AppShell } from "@/components/app-shell";
import { DailyPageContent } from "@/components/daily/daily-page-content";

type DailyByDatePageProps = {
  params: Promise<{
    date: string;
  }>;
};

export default async function DailyByDatePage({ params }: DailyByDatePageProps) {
  const { date } = await params;

  return (
    <AppShell activePath="/daily">
      <DailyPageContent date={date} />
    </AppShell>
  );
}
