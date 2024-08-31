"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { FaTools, FaUserCheck } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { RiSettings4Fill } from "react-icons/ri";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { useFocusMode } from "@/store/pomodoro/focusMode";

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
        <img src="/ideos.png" className="h-6 w-6 rounded-full" alt="Logo" />
      </div>
    </Link>
  );
};

export default function SidebarComponent() {
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <MdSpaceDashboard className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Authentication",
      href: "/auth",
      icon: (
        <FaUserCheck className="-mr-[0.1rem] ml-[0.15rem] h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Tools",
      href: "/tools",
      icon: (
        <FaTools className="h-[1.2rem] w-[1.2rem] flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <RiSettings4Fill className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [focusModeEnabled] = useFocusMode(
    (state) => [state.isEnabled, state.enableFocusMode, state.disableFocusMode],
  );

  return (
    <div
      className={cn(
        `flex h-screen flex-col overflow-hidden border-r border-background bg-secondary ${focusModeEnabled && "hidden"}`,
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
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
