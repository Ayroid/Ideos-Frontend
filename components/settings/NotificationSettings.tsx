import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";

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
  return (
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
            description:
              "Receive notifications about your team's activity via email",
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
            <input type="checkbox" id={id} className="mt-1 h-4 w-4 rounded" />
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
  );
};

export default NotificationSettings;
