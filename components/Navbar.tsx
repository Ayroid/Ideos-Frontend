"use client";
import { useFocusMode } from "@/store/pomodoro/focusMode";
import { ProfileAvatar } from "./ProfileAvatar";
import RelativeBreadCrumb from "./RelativeBreadCrumb";
import { ThemeSwitch } from "./ui/theme-switch";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

const Navbar = () => {
  const [focusModeEnabled] = useFocusMode((state) => [
    state.isEnabled,
    state.enableFocusMode,
    state.disableFocusMode,
  ]);
  return (
    <div
      className={`${focusModeEnabled && "hidden"} flex items-center justify-between p-6`}
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <RelativeBreadCrumb />
      </div>
    </div>
  );
};

export default Navbar;
