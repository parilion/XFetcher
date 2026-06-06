import { AppShell } from "@/components/app-shell";
import { DailyPageContent } from "@/components/daily/daily-page-content";

export default function DailyPage() {
  return (
    <AppShell activePath="/daily">
      <DailyPageContent />
    </AppShell>
  );
}
