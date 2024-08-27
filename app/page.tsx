"use client";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const login = searchParams.get("login");
  const router = useRouter();

  useEffect(() => {
    if (login === "true") {
      fetch("/api/handleLogin", {
        method: "POST",
      });
      router.push("/");
    }
  }, [login, router]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex h-full w-full flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center gap-6">
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
        </div>
      </main>
    </Suspense>
  );
}
