"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  HomeIcon,
  LayoutDashboard,
  MoveLeft,
} from "lucide-react";
import { useWorkspaceStore } from "@/store/workspace";

const NotFound = () => {

    const { activeWorkspace } =
      useWorkspaceStore();

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-xl mt-2">
            Oops! Page not found
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {activeWorkspace?._id ? (
            <>
              <Button
                variant="default"
                className="w-full"
                asChild
              >
                <Link href={`/workspaces/${activeWorkspace?._id}`} className="flex items-center justify-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Back to Workspace
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href="/workspaces" className="flex items-center justify-center gap-2">
                  <HomeIcon className="h-4 w-4" />
                  All Workspaces
                </Link>
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              className="w-full"
              asChild
            >
              <Link href="/workspaces" className="flex items-center justify-center gap-2">
                <MoveLeft className="h-4 w-4" />
                Back to Workspaces
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;