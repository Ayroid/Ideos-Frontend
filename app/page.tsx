"use client";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { User } from "@/types/user";

export default function Home() {
  const searchParams = useSearchParams();
  const login = searchParams.get("login");
  const logout = searchParams.get("logout");
  const router = useRouter();

  const [storedUser, setStoredUser] = useState<User | null>(null);

  const { user, isLoading } = useKindeBrowserClient();

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setStoredUser(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem("user", JSON.stringify(user));
      setStoredUser(user);
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (login == "true") {
      fetch("/api/handleLogin", {
        method: "POST",
      });
    }
    if (logout == "true") {
      localStorage.removeItem("user");
      setStoredUser(null);
    }
    router.push("/");
  }, [login, logout, router]);

  return (
    <main className="flex flex-col items-center justify-center gap-6">
      {storedUser && (
        <div>
          <h1>
            Welcome back, {storedUser.given_name} {storedUser.family_name}
          </h1>
        </div>
      )}
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
  );
}
