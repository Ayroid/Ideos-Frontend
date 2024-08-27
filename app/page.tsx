"use client";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";

function HomeContent() {
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

  const testRouteCall = async () => {
    try {
      const response = await axios.get("https://api.ideos.live/test");
      console.log("Columns:", response.data);
      toast.success("Test Route Works");
    } catch (error) {
      console.error("Error fetching columns:", error);
      toast.error("Error fetching columns");
    }
  };

  return (
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

        <Button
          onClick={() => {
            testRouteCall();
          }}
        >
          Not Protected
        </Button>

        <ThemeSwitch />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
