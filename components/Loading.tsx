import React from "react";
import { Loader2, Settings2, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface LoadingProps {
  variant?: "default" | "card" | "skeleton" | "minimal";
  text?: string;
  subText?: string;
  className?: string;
}

const Loading = ({
  variant = "default",
  text = "Loading...",
  subText = "This might take a few moments",
  className,
}: LoadingProps) => {
  // Minimal spinner with just the icon and optional text
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  // Card loading state with animated icons
  if (variant === "card") {
    return (
      <Card
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-8",
          className,
        )}
      >
        <div className="relative flex items-center justify-center">
          <Settings2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <CircleDashed className="absolute h-12 w-12 animate-spin text-primary/20" />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium">{text}</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we process your request
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="animate-pulse">
            Loading
          </Badge>
          <Badge variant="secondary" className="animate-pulse delay-75">
            Processing
          </Badge>
          <Badge variant="outline" className="animate-pulse delay-150">
            Please wait
          </Badge>
        </div>
      </Card>
    );
  }

  // Content placeholder with skeletons
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
      </div>
    );
  }

  // Default centered loading state with spinner and text
  return (
    <div
      className={cn(
        "flex min-h-[calc(100%-5.5rem)] flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="animate-pulse text-lg font-medium">{text}</h3>
        <p className="text-sm text-muted-foreground">{subText}</p>
      </div>
    </div>
  );
};
export default Loading;
