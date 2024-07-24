import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsCalendar2, BsThreeDots } from "react-icons/bs";

interface TodoProps {
  title: string;
  description: string;
  tags: {
    title: string;
    color: string;
  }[];
  dueDate: string;
}

const Todo = ({ title, description, tags, dueDate }: TodoProps) => {
  return (
    <div className="m-2 h-fit rounded-md bg-[#1c1c21] p-4">
      <div className="flex justify-between">
        <div id="tags" className="mb-2 flex gap-2">
          {tags.map((tag) => (
            <p
              key={tag.title}
              style={{ backgroundColor: tag.color }}
              className="rounded-sm px-2 py-1 font-medium text-black"
            >
              {tag.title}
            </p>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsThreeDots
              color="rgb(55 65 81)"
              className="-mt-3 cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="-mt-4 mr-24">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Assign</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div id="content">
        <h1 className="my-2 text-xl font-bold text-white">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>
      <div
        id="duedate"
        className="mt-4 w-fit rounded-sm border-[2px] border-gray-700 p-1 text-sm text-gray-400"
      >
        <BsCalendar2 className="-mt-[2px] inline" size="14" /> Due:{" "}
        <span className="text-white">{dueDate}</span>
      </div>
    </div>
  );
};

export default Todo;
