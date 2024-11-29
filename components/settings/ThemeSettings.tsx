"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

const ThemePreviewSkeleton = () => {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="rounded-md border p-2">
        <Skeleton className="mb-2 h-4 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-5/6" />
          <Skeleton className="h-2 w-4/6" />
        </div>
        <div className="mt-3">
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-2 h-3 w-full" />
    </div>
  );
};

export const ThemeSkeleton = () => {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ThemePreviewSkeleton />
        <ThemePreviewSkeleton />
        <ThemePreviewSkeleton />
      </div>
    </div>
  );
};

const ThemePreview = ({ isDark = false }) => {
  const baseContent = (
    <>
      <div
        className={`mb-2 h-4 w-3/4 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
      />
      <div className="space-y-2">
        <div
          className={`h-2 w-full rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
        />
        <div
          className={`h-2 w-5/6 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
        />
        <div
          className={`h-2 w-4/6 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
        />
      </div>
      <div className="mt-3">
        <div
          className={`h-6 w-1/3 rounded ${isDark ? "bg-blue-600" : "bg-blue-500"}`}
        />
      </div>
    </>
  );

  return (
    <div
      className={`w-full rounded-md border p-2 ${isDark ? "bg-gray-900" : "bg-white"}`}
    >
      {baseContent}
    </div>
  );
};

const DiagonalSplitPreview = () => (
  <div className="relative h-[7.5rem] w-full overflow-hidden rounded-md border">
    {/* Light theme layer */}
    <div className="absolute inset-0 bg-white p-2">
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
      className="absolute inset-0 bg-gray-900 p-2"
      style={{
        clipPath: "polygon(100% 0, 100% 100%, 50% 100%, 50% 0)",
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

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <Sun className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Theme preferences</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Light theme preview */}
        <div
          className={`rounded-lg border p-4 transition-all ${
            theme === "light" ? "ring-2 ring-primary" : ""
          }`}
        >
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
        <div
          className={`rounded-lg border p-4 transition-all ${
            theme === "dark" ? "ring-2 ring-primary" : ""
          }`}
        >
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
        <div
          className={`rounded-lg border p-4 transition-all ${
            theme === "system" ? "ring-2 ring-primary" : ""
          }`}
        >
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
            Automatically switches between light and dark theme based on your
            system preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
