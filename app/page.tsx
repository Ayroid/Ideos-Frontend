import Link from "next/link";
export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center gap-6">
      <Link
        href="/pages/auth"
        className="rounded-md bg-slate-600 px-4 py-2 text-white"
      >
        Auth Page
      </Link>
      <Link
        href="/pages/kanbanboard"
        className="rounded-md bg-slate-600 px-4 py-2 text-white"
      >
        Kanban Board
      </Link>
    </main>
  );
}
