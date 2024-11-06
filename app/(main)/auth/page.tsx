"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";

const actionsData = [
  {
    id: 1,
    title: "Sign up",
    description: "Create a new account to get started",
    icon: <FaUserPlus size={48} />,
    component: (
      <RegisterLink>
        <Button className="w-full h-12 text-lg">Sign Up</Button>
      </RegisterLink>
    ),
  },
  {
    id: 2,
    title: "Sign in",
    description: "Access your account and start using our tools",
    icon: <FaSignInAlt size={48} />,
    component: (
      <LoginLink>
        <Button className="w-full h-12 text-lg" variant="outline">Sign In</Button>
      </LoginLink>
    ),
  },
  {
    id: 3,
    title: "Sign out",
    description: "Securely log out of your current session",
    icon: <FaSignOutAlt size={48} />,
    component: (
      <LogoutLink>
        <Button className="w-full h-12 text-lg" variant="secondary">Sign Out</Button>
      </LogoutLink>
    ),
  },
];

const LoginPage = () => {
  return (
    <div className="p-8 md:py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Unlock the full potential of our productivity tools by creating an account or signing in. Your journey to enhanced efficiency starts here.
        </p>
      </header>

      <div className="flex gap-8">
        {actionsData.map((action) => (
          <Card key={action.id} className="flex flex-col w-full justify-between">
            <CardHeader>
              <div className="w-full h-16 rounded-full flex items-center justify-center mb-4">
                {action.icon}
              </div>
              <CardTitle className="text-2xl text-center mb-2">{action.title}</CardTitle>
              <CardDescription className="text-center">
                {action.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex justify-center items-end">
              {action.component} 
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;