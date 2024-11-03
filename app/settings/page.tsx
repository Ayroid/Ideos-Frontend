"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Building2,
  Globe,
  Moon,
  Sun,
  ChevronDown,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';

const ThemePreview = ({ isDark = false }) => {
  const baseContent = (
    <>
      <div className={`mb-2 h-4 w-3/4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
      <div className="space-y-2">
        <div className={`h-2 w-full rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-2 w-5/6 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-2 w-4/6 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </div>
      <div className="mt-3">
        <div className={`h-6 w-1/3 rounded ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`} />
      </div>
    </>
  );

  return (
    <div className={`w-full rounded-md border p-2 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {baseContent}
    </div>
  );
};

const DiagonalSplitPreview = () => (
  <div className="relative w-full h-[7.5rem] rounded-md border overflow-hidden">
    {/* Light theme layer */}
    <div className="absolute inset-0 p-2 bg-white">
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
      <div className="space-y-2">
        <div className="h-2 w-full rounded bg-gray-200" />
        <div className="h-2 w-5/6 rounded bg-gray-200" />
        <div className="h-2 w-4/6 rounded bg-gray-200" />
      </div>
      <div className="mt-3">
        <div className="h-6 w-1/3 rounded bg-blue-500" />
      </div>
    </div>

    {/* Dark theme layer with diagonal clip */}
    <div
      className="absolute inset-0 p-2 bg-gray-900"
      style={{
        clipPath: 'polygon(100% 0, 100% 100%, 50% 100%, 50% 0)',
      }}
    >
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-700" />
      <div className="space-y-2">
        <div className="h-2 w-full rounded bg-gray-700" />
        <div className="h-2 w-5/6 rounded bg-gray-700" />
        <div className="h-2 w-4/6 rounded bg-gray-700" />
      </div>
      <div className="mt-3">
        <div className="h-6 w-1/3 rounded bg-blue-600" />
      </div>
    </div>
  </div>
);

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <Card className="space-y-6">
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Card className="space-y-6">
          <CardContent className="pt-6">
            {/* Workspace Section */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Workspace</h2>
              </div>
              <div className="flex w-full items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="teamName" className="text-sm">
                    Workspace Name
                  </Label>
                  <Input
                    id="teamName"
                    placeholder="Enter workspace name"
                  />
                </div>
                <Button>Save</Button>
              </div>
            </div>

            {/* Theme Section */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Sun className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Theme preferences</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">


                {/* Light theme preview */}
                <div className={`rounded-lg border p-4 transition-all ${
                  theme === "light" ? "ring-2 ring-primary" : ""
                }`}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span className="text-sm font-medium">Light theme</span>
                    </div>
                    <Button
                      size="sm"
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                    >
                      {mounted && theme === "light" ? "Active" : "Activate"}
                    </Button>
                  </div>
                  <div className="relative overflow-hidden rounded-md border">
                    <ThemePreview isDark={false} />
                  </div>
                  <p className="mt-2 text-xs text-secondary-foreground">
                    This theme will be active when your system is set to "light mode"
                  </p>
                </div>

                {/* Dark theme preview */}
                <div className={`rounded-lg border p-4 transition-all ${
                  theme === "dark" ? "ring-2 ring-primary" : ""
                }`}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span className="text-sm font-medium">Dark theme</span>
                    </div>
                    <Button
                      size="sm"
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                    >
                      {mounted && theme === "dark" ? "Active" : "Activate"}
                    </Button>
                  </div>
                  <div className="relative overflow-hidden rounded-md border">
                    <ThemePreview isDark={true} />
                  </div>
                  <p className="mt-2 text-xs text-secondary-foreground">
                    This theme will be active when your system is set to "dark mode"
                  </p>
                </div>

                 {/* System theme preview */}
                 <div className={`rounded-lg border p-4 transition-all ${
                  theme === "system" ? "ring-2 ring-primary" : ""
                }`}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span className="text-sm font-medium">System theme</span>
                    </div>
                    <Button
                      size="sm"
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                    >
                      {mounted && theme === "system" ? "Active" : "Activate"}
                    </Button>
                  </div>
                  <DiagonalSplitPreview />
                  <p className="mt-2 text-xs text-secondary-foreground">
                    Automatically switches between light and dark theme based on your system preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="space-y-3">
                {[
                  {
                    id: "emailNotif",
                    title: "Email Notifications",
                    description: "Receive notifications about your team's activity via email",
                  },
                  {
                    id: "browserNotif",
                    title: "Browser Notifications",
                    description: "Receive notifications in your browser",
                  },
                ].map(({ id, title, description }) => (
                  <div
                    key={id}
                    className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <input
                      type="checkbox"
                      id={id}
                      className="mt-1 h-4 w-4 rounded"
                    />
                    <div>
                      <label htmlFor={id} className="text-sm font-medium">
                        {title}
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;