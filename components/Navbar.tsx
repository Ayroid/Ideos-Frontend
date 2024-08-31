"use client";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import RelativeBreadCrumb from "./RelativeBreadCrumb";
import { ThemeSwitch } from "./ui/theme-switch";
import { useFocusMode } from "@/store/pomodoro/focusMode";

const Navbar = () => {
  const [focusModeEnabled] = useFocusMode((state) => [
    state.isEnabled,
    state.enableFocusMode,
    state.disableFocusMode,
  ]);
  return (
    <div
      className={`${focusModeEnabled && "hidden"} flex items-center justify-between px-10 py-6`}
    >
      <RelativeBreadCrumb />
      <div className="flex items-center gap-8">
        <ThemeSwitch />
        <ProfileAvatar />
      </div>
    </div>
  );
};

export default Navbar;
