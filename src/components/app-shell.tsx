import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "精选", icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8Z" },
  {
    href: "/daily",
    label: "AI 日报",
    icon: "M6 3h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 5h8M8 12h8M8 16h5",
  },
  {
    href: "/status",
    label: "系统状态",
    icon: "M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
];

type AppShellProps = {
  activePath: string;
  children: ReactNode;
};

export function AppShell({ activePath, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden border-r border-[var(--border)] bg-[var(--sidebar)] px-4 py-5 lg:block">
        <Link
          aria-label="AI HOT 首页"
          className="mb-7 flex h-11 items-center gap-2 rounded-md px-3 text-xl font-black tracking-normal text-[var(--text)]"
          href="/"
        >
          <span>AI</span>
          <span className="grid size-5 place-items-center rounded-full border border-[var(--accent)]">
            <span className="size-2 rounded-full bg-[var(--accent)]" />
          </span>
          <span>HOT</span>
        </Link>
        <nav className="grid gap-1">
          {navItems.map((item) => (
            <Link
              className={
                item.href === activePath
                  ? "flex min-h-11 items-center gap-3 rounded-lg bg-[var(--nav-active)] px-3 text-sm font-semibold text-[var(--text)]"
                  : "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--text)]"
              }
              href={item.href}
              key={item.href}
            >
              <svg
                aria-hidden="true"
                className="size-[18px]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 backdrop-blur lg:hidden">
          <Link
            className="flex items-center gap-2 text-lg font-black text-[var(--text)]"
            href="/"
          >
            <span>AI</span>
            <span className="size-2 rounded-full bg-[var(--accent)]" />
            <span>HOT</span>
          </Link>
          <Link
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--muted)]"
            href="/daily"
          >
            日报
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
