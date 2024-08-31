import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AiFillHourglass } from "react-icons/ai";
import { BsKanbanFill } from "react-icons/bs";
import { FaCheck, FaRobot } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";

const pagesData = [
  {
    id: 1,
    title: "Kanban",
    icon: <BsKanbanFill size={96} />,
    status: true,
    link: "/tools/kanban",
  },
  {
    id: 2,
    title: "Pomodoro",
    icon: <AiFillHourglass size={96} />,
    status: false,
    link: "/tools/pomodoro",
  },
  {
    id: 3,
    title: "Notes",
    icon: <FaNoteSticky size={96} />,
    status: false,
    link: "/tools/notes",
  },
  {
    id: 4,
    title: "IDOe Assist",
    icon: <FaRobot size={96} />,
    status: false,
    link: "/tools/idoe",
  },
];

const Pages = () => {
  return (
    <div className="flex w-full gap-4 p-10">
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
