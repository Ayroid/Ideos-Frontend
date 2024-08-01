"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/theme-switch";

export default function Home() {
  const searchParams = useSearchParams();
  const login = searchParams.get("login");
  const router = useRouter();

  useEffect(() => {
    if (login) {
      const handleLogin = async () => {
        try {
          await fetch("/api/handleLogin", {
            method: "POST",
          });
          console.log("Sending Request");
        } catch (error) {
          console.error("Login request failed", error);
        }
      };
      handleLogin();
      router.push("/");
    }
  }, [login]);

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
