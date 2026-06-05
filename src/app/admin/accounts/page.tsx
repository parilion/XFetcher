import { AccountForm } from "@/components/admin/account-form";

export default function AdminAccountsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-semibold">账号管理</h1>
      <AccountForm />
    </main>
  );
}
