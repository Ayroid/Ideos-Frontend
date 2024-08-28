import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import React from "react";
import { ThemeSwitch } from "@/components/ui/theme-switch";

const loginPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center gap-6">
      <LoginLink>
        <Button>Sign in</Button>
      </LoginLink>
      <RegisterLink>
        <Button>Sign up</Button>
      </RegisterLink>
      <LogoutLink>
        <Button>Sign out</Button>
      </LogoutLink>
      <Link href="/">
        <Button>Homepage</Button>
      </Link>
      <ThemeSwitch />
    </div>
  );
};

export default loginPage;
