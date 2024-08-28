import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FaRegNoteSticky } from "react-icons/fa6";
import { GoHourglass } from "react-icons/go";
import { LuKanbanSquare } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";

const pagesData = [
  {
    id: 1,
    title: "Kanban",
    icon: <LuKanbanSquare size={96} />,
    status: true,
    link: "/tools/kanban",
  },
  {
    id: 2,
    title: "Pomodoro",
    icon: <GoHourglass size={96} />,
    status: false,
    link: "/tools/pomodoro",
  },
  {
    id: 3,
    title: "Notes",
    icon: <FaRegNoteSticky size={96} />,
    status: false,
    link: "/tools/notes",
  },
];

const Pages = () => {
  return (
    <div className="flex w-full gap-4">
      {pagesData.map((page) => (
        <Link
          key={page.id}
          className={"flex flex-col items-center justify-center gap-2"}
          href={page.link}
        >
          <Card className="relative h-80 w-80 hover:bg-primary-foreground/95">
            <FaCheck
              className={`absolute right-4 top-4 ${page.status ? "block" : "hidden"}`}
            />
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
