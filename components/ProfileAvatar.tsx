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

const UserAvatar = ({
  storedUser,
  className: customClasses = "",
}: {
  storedUser: User | null;
  className?: string;
}) => {
  return (
    <Avatar className={`h-7 w-7 ${customClasses}`}>
      <AvatarImage src={storedUser?.picture ?? undefined} alt="U" />
      <AvatarFallback>
        <FaUserAlt />
      </AvatarFallback>
    </Avatar>
  );
};

const ProfileAvatar = () => {
  const [storedUser, setStoredUser] = useState<User | null>(null);

  const sideBarData = [
    {
      label: "Profile",
      href: "/pages/profile",
      icon: <FaUserAlt />,
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setStoredUser(JSON.parse(user));
      }
    }
  }, []);

  return (
    <Sheet>
      <SheetTrigger>
        <UserAvatar storedUser={storedUser} />
      </SheetTrigger>
      <SheetContent className="w-80 p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-4">
            <UserAvatar storedUser={storedUser} className="h-10 w-10" />
            <div className="flex flex-col gap-0">
              <h1>{storedUser?.given_name ?? "User"}</h1>
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
              {storedUser ? (
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
