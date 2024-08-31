"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { FaTools, FaUserCheck } from "react-icons/fa";
import { RiSettings4Fill } from "react-icons/ri";

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
      icon: <FaTools size={80} />,
      link: "/tools",
    },
    {
      id: 3,
      title: "Settings",
      icon: <RiSettings4Fill size={96} />,
      link: "/settings",
    },
  ];

  return (
    <main className="h-full w-full p-10">
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
