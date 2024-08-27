"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { LuKanbanSquare } from "react-icons/lu";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user";
import { FaUserAlt } from "react-icons/fa";

export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
      <span className="whitespace-pre font-medium text-black dark:text-white">
        Ideos
      </span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm">
        <img
          src="/io-logo-color 1.png"
          className="h-6 w-6 rounded-full"
          alt="Logo"
        />
      </div>
    </Link>
  );
};

export default function SidebarComponent() {
  const [storedUser, setStoredUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setStoredUser(JSON.parse(user));
      }
    }
  }, []);

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Kanban Board",
      href: "/pages/kanbanboard",
      icon: (
        <LuKanbanSquare className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/pages/settings",
      icon: (
        <IconSettings className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex h-screen flex-col overflow-hidden border-r border-background bg-secondary",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <div className="flex items-center gap-2">
              <LogoIcon /> {open ? "Ideos" : null}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: storedUser?.given_name ?? "User",
                href: "/pages/profile",
                icon: storedUser?.picture ? (
                  <Image
                    src={storedUser?.picture}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ) : (
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback>
                      <FaUserAlt />
                    </AvatarFallback>
                  </Avatar>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
