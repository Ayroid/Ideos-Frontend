"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { FaUserAlt } from "react-icons/fa";
import { User } from "@/types/user";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { PiSignInBold, PiSignOutBold } from "react-icons/pi";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const UserAvatar = ({
  storedUser,
  loading,
  className: customClasses = "",
}: {
  storedUser: User | null;
  loading?: boolean | null;
  className?: string;
}) => {
  return (
    <Avatar className={`h-7 w-7 ${customClasses}`}>
      <AvatarImage
        src={loading ? undefined : (storedUser?.picture ?? undefined)}
        alt="U"
      />
      <AvatarFallback>
        {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaUserAlt />}
      </AvatarFallback>
    </Avatar>
  );
};

const ProfileAvatar = () => {
  const { user, isLoading } = useKindeBrowserClient();

  const sideBarData = [
    {
      label: "Profile",
      href: "/pages/profile",
      icon: <FaUserAlt />,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger>
        <UserAvatar storedUser={user} loading={isLoading} />
      </SheetTrigger>
      <SheetContent className="w-80 p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-4">
            <UserAvatar
              storedUser={user}
              className="h-10 w-10"
              loading={isLoading}
            />
            <div className="flex flex-col gap-0">
              <h1>{user?.given_name ?? "User"}</h1>
              <span className="text-sm font-normal text-muted-foreground">
                Software Developer
              </span>
            </div>
          </SheetTitle>
          <Separator className="!mt-4" />
          <SheetDescription>
            <ScrollArea>
              {sideBarData.map((link, index) => (
                <SheetClose asChild key={index}>
                  <Link href={link.href} className="w-full">
                    <Button
                      className="flex w-full items-center justify-start gap-2 p-2"
                      variant="ghost"
                    >
                      {link.icon}
                      {link.label}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
              <Separator className="!my-2" />
              {user ? (
                <LogoutLink>
                  <Button
                    className="flex w-full items-center justify-start gap-2 p-2"
                    variant="ghost"
                  >
                    <PiSignOutBold className="-mr-1 h-5 w-5" />
                    Sign out
                  </Button>
                </LogoutLink>
              ) : (
                <LoginLink>
                  <Button
                    className="flex w-full items-center justify-start gap-2 p-2"
                    variant="ghost"
                  >
                    <PiSignInBold className="-mr-1 h-5 w-5" />
                    Sign in
                  </Button>
                </LoginLink>
              )}
            </ScrollArea>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export { UserAvatar, ProfileAvatar };
