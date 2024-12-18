"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: isAuthLoading } = useKindeBrowserClient();

  useEffect(() => {
    const checkWorkspaces = async () => {
      try {
        // Check authentication first
        if (isAuthLoading) return;

        if (!isAuthenticated) {
          router.push('/');
          return;
        }

        const response = await fetch('/api/workspace', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          if (data.length > 0) {
            // User has workspaces, redirect to the first one
            router.push(`/workspace/${data[0]._id}`);
          } else {
            // No workspaces found, redirect to workspace creation
            router.push('/workspaces');
          }
        } else {
          // Handle error by redirecting to workspace creation
          router.push('/workspaces');
        }
      } catch (error) {
        console.error('Error checking workspaces:', error);
        // On error, redirect to workspace creation
        router.push('/workspaces');
      } finally {
        setIsLoading(false);
      }
    };

    checkWorkspaces();
  }, [router, isAuthenticated, isAuthLoading]);

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
};

export default Page;