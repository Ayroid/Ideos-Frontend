import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

const actionsData = [
  {
    id: 1,
    title: "Sign up",
    icon: <FaUserPlus size={96} />,
    component: (
      <RegisterLink>
        <Card className="relative h-80 w-80 hover:bg-primary-foreground/95">
          <CardHeader className="flex h-full w-full flex-col items-center justify-center">
            <CardTitle>{<FaUserPlus size={96} />}</CardTitle>
          </CardHeader>
        </Card>
      </RegisterLink>
    ),
  },
  {
    id: 2,
    title: "Sign in",
    icon: <FaSignInAlt size={96} />,
    component: (
      <LoginLink>
        <Card className="relative h-80 w-80 hover:bg-primary-foreground/95">
          <CardHeader className="flex h-full w-full flex-col items-center justify-center">
            <CardTitle>{<FaSignInAlt size={96} />}</CardTitle>
          </CardHeader>
        </Card>
      </LoginLink>
    ),
  },

  {
    id: 3,
    title: "Sign out",
    icon: <FaSignOutAlt size={96} />,
    component: (
      <LogoutLink>
        <Card className="relative h-80 w-80 hover:bg-primary-foreground/95">
          <CardHeader className="flex h-full w-full flex-col items-center justify-center">
            <CardTitle>{<FaSignOutAlt size={96} />}</CardTitle>
          </CardHeader>
        </Card>
      </LogoutLink>
    ),
  },
];

const LoginPage = () => {
  return (
    <div className="flex w-full items-center gap-4">
      {actionsData.map((action) => (
        <div
          key={action.id}
          className="flex flex-col items-center justify-center gap-2"
        >
          {action.component}
          <h2 className="text-center">{action.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default LoginPage;
