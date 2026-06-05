import { SettingsForm } from "@/components/admin/settings-form";

export default function AdminSettingsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-semibold">系统设置</h1>
      <SettingsForm />
    </main>
  );
}
