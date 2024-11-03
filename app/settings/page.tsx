"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Building2,
  Globe,
  Moon,
  Palette,
  Shield,
  Sun,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Team Information */}
        <Card>
          <CardHeader className="border-b pb-6">
            <div className="flex items-center gap-4">
              <Building2 className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-semibold">Team Settings</h2>
                <p className="text-sm">
                  Manage your team information and members
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="teamName" className="text-sm">
                  Team Name
                </Label>
                <Input
                  id="teamName"
                  placeholder="Enter team name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamDomain" className="text-sm">
                  Team Domain
                </Label>
                <div className="flex">
                  <Input
                    id="teamDomain"
                    placeholder="your-team"
                    className="rounded-r-none"
                  />
                  <span className="flex items-center rounded-r-md border border-l-0 px-3 text-sm">
                    .ideos.com
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Users className="h-5 w-5" />
              <div className="flex-1">
                <p className="text-sm">Team Members</p>
                <p className="text-sm font-medium">12 Active Members</p>
              </div>
              <Button variant="outline">
                Manage Members
              </Button>
            </div>

            <div className="pt-4">
              <Button>
                Save Team Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader className="border-b pb-6">
            <div className="flex items-center gap-4">
              <Palette className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-semibold">Appearance</h2>
                <p className="text-sm">
                  Customize how Ideos looks on your device
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center rounded-lg border p-4 transition-all ${
                  theme === "light" ? "ring-2" : ""
                }`}
              >
                <Sun className="mb-2 h-6 w-6" />
                <span className="text-sm">Light</span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center rounded-lg border p-4 transition-all ${
                  theme === "dark" ? "ring-2" : ""
                }`}
              >
                <Moon className="mb-2 h-6 w-6" />
                <span className="text-sm">Dark</span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center rounded-lg border p-4 transition-all ${
                  theme === "system" ? "ring-2" : ""
                }`}
              >
                <Globe className="mb-2 h-6 w-6" />
                <span className="text-sm">System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="border-b pb-6">
            <div className="flex items-center gap-4">
              <Bell className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-sm">
                  Choose what you want to be notified about
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                id="emailNotif"
                className="h-4 w-4 rounded"
              />
              <div className="flex-1">
                <label htmlFor="emailNotif" className="text-sm font-medium">
                  Email Notifications
                </label>
                <p className="text-sm">
                  Receive notifications about your team's activity via email
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                id="browserNotif"
                className="h-4 w-4 rounded"
              />
              <div className="flex-1">
                <label htmlFor="browserNotif" className="text-sm font-medium">
                  Browser Notifications
                </label>
                <p className="text-sm">
                  Receive notifications in your browser
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="border-b pb-6">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-semibold">Security</h2>
                <p className="text-sm">
                  Manage your security preferences
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                id="twoFactor"
                className="h-4 w-4 rounded"
              />
              <div className="flex-1">
                <label htmlFor="twoFactor" className="text-sm font-medium">
                  Two-Factor Authentication
                </label>
                <p className="text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Badge variant="outline">
                Recommended
              </Badge>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                id="sessionTimeout"
                className="h-4 w-4 rounded"
              />
              <div className="flex-1">
                <label htmlFor="sessionTimeout" className="text-sm font-medium">
                  Auto Logout
                </label>
                <p className="text-sm">
                  Automatically log out after 24 hours of inactivity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;
