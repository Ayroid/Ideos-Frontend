"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Calendar, Globe, Lock, Mail } from "lucide-react";

function UserProfile() {
  const { user, isLoading } = useKindeBrowserClient();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
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

            {/* Account Details */}
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
