"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Wrench,
  UserCheck,
  Bell,
  LineChart,
  Settings
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  subtext?: string;
}

const StatsCard = ({ title, value, icon: Icon, subtext }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && (
        <p className="text-xs text-muted-foreground">{subtext}</p>
      )}
    </CardContent>
  </Card>
);

function HomeContent() {
  const searchParams = useSearchParams();
  const login = searchParams.get("login");
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const { user, isLoading } = useKindeBrowserClient();

  useEffect(() => {
    try {
      if (login === "true") {
        fetch("/api/handleLogin", { method: "POST" });
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to handle login:", error);
    }
  }, [login, router]);

  useEffect(() => {
    setProgress(13);
  }, []);

  const pagesData = [
    {
      id: 1,
      title: "Authentication",
      icon: <UserCheck size={24} />,
      link: "/auth",
      description: "Manage user authentication and access control",
      buttonText: "Manage Access",
    },
    {
      id: 2,
      title: "Tools",
      icon: <Wrench size={24} />,
      link: "/tools",
      description: "Access and manage various tools and utilities",
      buttonText: "View Tools",
    },
    {
      id: 3,
      title: "Settings",
      icon: <Settings size={24} />,
      link: "/settings",
      description: "Configure system and user preferences",
      buttonText: "Configure",
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
    { user: "Diana Prince", action: "Joined the team", time: "2 days ago" },
    { user: "Eve Adams", action: "Commented on a task", time: "3 days ago" },
  ];

  const quickTips = [
    {
      title: "Auth Management",
      description: "Use the Auth section to manage your account and security settings.",
    },
    {
      title: "Productivity Tools",
      description: "Explore our Tools to enhance your productivity and workflow.",
    },
    {
      title: "Customization",
      description: "Customize your experience in the Settings area.",
    },
    {
      title: "Notifications",
      description: "Set up notifications to stay updated with the latest activities.",
    },
    {
      title: "User Profiles",
      description: "Update your profile to keep your information current.",
    },
  ];

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.given_name ?? "User"}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="26"
          icon={UserCheck}
          subtext="+40% from last month"
        />
        <StatsCard
          title="Active Tools"
          value="3"
          icon={Wrench}
          subtext="+2 new this week"
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">13%</div>
              <Badge variant="secondary">In Progress</Badge>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>
        <StatsCard
          title="Upcoming Deadlines"
          value="3"
          icon={Bell}
          subtext="within next 7 days"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pagesData.map((page) => (
          <Link key={page.id} href={page.link}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    {page.icon}
                  </div>
                  <div>
                    <CardTitle>{page.title}</CardTitle>
                    <CardDescription className="mt-1">{page.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  {page.buttonText}
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your team's latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-4 px-2">
                      <Avatar>
                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <Badge variant="secondary">{activity.time}</Badge>
                    </div>
                    {index !== recentActivities.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
            <CardDescription>Helpful information to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {quickTips.map((tip, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                    {index !== quickTips.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
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