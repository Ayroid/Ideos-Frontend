import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/theme-switch";
export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center gap-6">
      <Link href="/pages/auth">
        <Button>Auth Page</Button>
      </Link>
      <Link href="/pages/kanbanboard">
        <Button>Kanban Board</Button>
      </Link>
      <Link href="/pages/protected">
        <Button>Protected</Button>
      </Link>
      <ThemeSwitch />
    </main>
  );
}
