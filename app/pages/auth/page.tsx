import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

import React from "react";

const loginPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-6">
      <LoginLink className="rounded-md bg-slate-600 px-4 py-2 text-white">
        Sign in
      </LoginLink>
      <RegisterLink className="rounded-md bg-slate-600 px-4 py-2 text-white">
        Sign up
      </RegisterLink>
      <LogoutLink className="rounded-md bg-slate-600 px-4 py-2 text-white">
        Sign out
      </LogoutLink>
      <Link
        href="/"
        className="rounded-md bg-slate-600 px-4 py-2 text-white"
      >
        HomePage
      </Link>
    </div>
  );
};

export default loginPage;
