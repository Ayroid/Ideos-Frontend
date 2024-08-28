"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { IconSettings } from "@tabler/icons-react";
import { Icon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { FaUserAlt, FaUserCheck } from "react-icons/fa";
import { LiaToolsSolid } from "react-icons/lia";

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

  const pagesData = [
    {
      id: 1,
      title: "Auth",
      icon: <FaUserCheck size={96} />,
      link: "/auth",
    },
    {
      id: 2,
      title: "Tools",
      icon: <LiaToolsSolid size={96} />,
      link: "/tools",
    },
    {
      id: 3,
      title: "Settings",
      icon: <IconSettings size={96} />,
      link: "/settings",
    },
  ];

  return (
    <main className="h-full w-full">
      <div className="flex flex-wrap gap-6">
        {pagesData.map((page) => (
          <Link
            key={page.id}
            className="flex flex-col items-center justify-center gap-2"
            href={page.link}
          >
            <Card className="h-80 w-80 hover:bg-primary-foreground/95">
              <CardHeader className="flex h-full w-full flex-col items-center justify-center">
                <CardTitle>{page.icon}</CardTitle>
              </CardHeader>
            </Card>
            <h2 className="text-center">{page.title}</h2>
          </Link>
        ))}
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
