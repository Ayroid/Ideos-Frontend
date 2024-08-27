import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { FaUserAlt, FaUserCheck } from "react-icons/fa";
import { LuKanbanSquare } from "react-icons/lu";

const pagesData = [
  {
    id: 1,
    title: "Profile",
    icon: <FaUserAlt size={80} />,
    link: "/pages/profile",
  },
  {
    id: 2,
    title: "Kanban",
    icon: <LuKanbanSquare size={96} />,
    link: "/pages/kanban",
  },
  {
    id: 3,
    title: "Auth",
    icon: <FaUserCheck size={96} />,
    link: "/pages/auth",
  },
  {
    id: 4,
    title: "Settings",
    icon: <IconSettings size={96} />,
    link: "/pages/settings",
  },
];

const Pages = () => {
  return (
    <div className="flex h-full w-full items-start gap-4">
      {pagesData.map((page) => (
        <Link
          key={page.id}
          className="flex flex-col items-center justify-center gap-2"
          href={page.link}
        >
          <Card className="h-80 w-80 hover:bg-primary-foreground/95">
            <CardHeader className="flex h-full w-full flex-col items-center justify-center">
              <CardTitle>{page.icon}</CardTitle>
            </CardHeader>
          </Card>
          <h2 className="text-center">{page.title}</h2>
        </Link>
      ))}
    </div>
  );
};

export default Pages;
