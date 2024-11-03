"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Calendar, Globe, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";

// Skeleton components
const ProfileHeaderSkeleton = () => (
  <div className="flex items-center gap-6">
    <Skeleton className="h-20 w-20 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

const PersonalInfoSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-40" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

const ContactInfoSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-40" />
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Skeleton className="h-5 w-5" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-1 h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Skeleton className="h-5 w-5" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-1 h-4 w-32" />
        </div>
      </div>
    </div>
  </div>
);

const AccountDetailsSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-40" />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Skeleton className="h-5 w-5" />
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-1 h-4 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Skeleton className="h-5 w-5" />
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-1 h-4 w-32" />
        </div>
      </div>
    </div>
  </div>
);

function UserProfile() {
  const { user, isLoading } = useKindeBrowserClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
          </div>

          <Card>
            <CardHeader className="border-b pb-6">
              <ProfileHeaderSkeleton />
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <PersonalInfoSkeleton />
              <ContactInfoSkeleton />
              <AccountDetailsSkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>

        <Card>
          <CardHeader className="border-b pb-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.picture ?? ""} />
                <AvatarFallback className="text-4xl">
                  {user?.given_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">
                  {user?.given_name} {user?.family_name}
                </h2>
                <p className="text-md">{user?.email}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={user?.given_name as string}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={user?.family_name as string}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Mail className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="text-sm">Email Address</p>
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                  <Badge variant="secondary">Verified</Badge>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Lock className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="text-sm">Password</p>
                    <p className="text-sm font-medium">Managed by Google</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Account Details</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-sm">Member Since</p>
                    <p className="text-sm font-medium">
                      {new Date(
                        user?.created_at ?? "2024-01-01",
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Globe className="h-5 w-5" />
                  <div>
                    <p className="text-sm">Account Type</p>
                    <p className="text-sm font-medium">Google Account</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserProfile;