"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaTools, FaUserCheck, FaBell, FaChartLine } from "react-icons/fa";
import { RiSettings4Fill } from "react-icons/ri";

function HomeContent() {
  const searchParams = useSearchParams();
  const login = searchParams.get("login");
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const { user, isLoading } = useKindeBrowserClient();

  useEffect(() => {
    try {
      if (login === "true") {
        fetch("/api/handleLogin", {
          method: "POST",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to handle login:", error);
    }
  }, [login, router]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(13), 500);
    return () => clearTimeout(timer);
  }, []);

  const pagesData = [
    {
      id: 1,
      title: "Auth",
      icon: <FaUserCheck size={32} />,
      link: "/auth",
      description: "Manage user authentication and access control",
    },
    {
      id: 2,
      title: "Tools",
      icon: <FaTools size={32} />,
      link: "/tools",
      description: "Access and manage various tools and utilities",
    },
    {
      id: 3,
      title: "Settings",
      icon: <RiSettings4Fill size={32} />,
      link: "/settings",
      description: "Configure system and user preferences",
    },
  ];

  const quickTips = [
    {
      title: "Auth Management",
      description:
        "Use the Auth section to manage your account and security settings.",
    },
    {
      title: "Productivity Tools",
      description:
        "Explore our Tools to enhance your productivity and workflow.",
    },
    {
      title: "Customization",
      description: "Customize your experience in the Settings area.",
    },
  ];

  const recentActivities = [
    {
      user: "Alice Johnson",
      action: "Updated profile picture",
      time: "2 hours ago",
    },
    { user: "Bob Smith", action: "Completed Project X", time: "5 hours ago" },
    { user: "Charlie Brown", action: "Added new tool", time: "1 day ago" },
  ];

  return (
    <div className="w-full p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">
            Welcome, {user?.given_name ?? "User!"}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <FaBell /> Notifications
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <FaUserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26</div>
            <p className="text-xs text-muted-foreground">
              +40% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <FaTools className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Project Progress
            </CardTitle>
            <FaChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13%</div>
            <Progress value={progress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Deadlines
            </CardTitle>
            <FaBell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">within next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pagesData.map((page) => (
          <Link
            key={page.id}
            href={page.link}
            className="block transition-transform hover:scale-105"
          >
            <Card className="h-full hover:bg-primary-foreground/95">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary-foreground p-2">
                  {page.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="mt-4 w-full">Access {page.title}</Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li key={index} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <Badge variant="secondary">{activity.time}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {quickTips.map((tip, index) => (
                <li key={index}>
                  <h3 className="mb-1 font-medium">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tip.description}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
