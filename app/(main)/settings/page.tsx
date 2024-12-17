"use client";

import NotificationSettings, {
  NotificationSkeleton,
} from "@/components/settings/NotificationSettings";
import ThemeSettings, {
  ThemeSkeleton,
} from "@/components/settings/ThemeSettings";
import WorkspaceSettings, {
  WorkspaceSkeleton,
} from "@/components/settings/WorkspaceSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

function SettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-8">
        <div className="max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="space-y-6">
            <div className="pt-6">
              <WorkspaceSkeleton />
              <ThemeSkeleton />
              <NotificationSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <div className="space-y-6 border-none">
          <div className="pt-6">
            <WorkspaceSettings />
            <ThemeSettings />
            <NotificationSettings />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
