import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Bell, Settings } from "lucide-react";

const NotificationItemSkeleton = () => {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <Skeleton className="mt-1 h-4 w-4" />
      <div className="flex-1">
        <Skeleton className="mb-2 h-4 w-1/3" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
};

export const NotificationSkeleton = () => {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-3">
        <NotificationItemSkeleton />
        <NotificationItemSkeleton />
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  const notificationsData = [
    {
      id: "emailNotifications",
      icon: Bell,
      title: "Email Notifications",
      description: "Receive notifications about your team's activity via email",
      configured: true,
    },
    {
      id: "browserNotifications",
      icon: Bell,
      title: "Browser Notifications",
      description: "Receive notifications in your browser",
      configured: false,
    },
    {
      id: "slackNotifications",
      icon: Bell,
      title: "Slack Notifications",
      description: "Receive notifications in your Slack workspace",
      configured: true,
    },
    {
      id: "discordNotifications",
      icon: Bell,
      title: "Discord Notifications",
      description: "Receive notifications in your Discord server",
      configured: false,
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>
      <div className="flex flex-col gap-2 space-y-3">
        {notificationsData.map(({ id, title, description, configured }) => (
          <div
            key={id}
            className="flex items-center justify-between gap-3 rounded-lg border p-4"
          >
            <div className="flex items-start gap-3">
              <div>
                <Label htmlFor={id} className="text-base font-medium">
                  {title}
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              </div>
            </div>
            {configured ? (
              <div className="flex items-center gap-2">
                <Switch id={id} />
                <Settings className="h-5 w-5" />
              </div>
            ) : (
              <Button size="sm" variant="default">
                Configure
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
