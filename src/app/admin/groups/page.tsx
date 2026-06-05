import { GroupForm } from "@/components/admin/group-form";

export default function AdminGroupsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-semibold">分组管理</h1>
      <GroupForm />
    </main>
  );
}
