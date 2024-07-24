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
    <div className="bg-[#1c1c21] p-4 rounded-md h-fit m-2">
      <div className="flex justify-between">
        <div id="tags" className="flex gap-2 mb-2">
          {tags.map((tag) => (
            <p
              key={tag.title}
              style={{ backgroundColor: tag.color }}
              className="py-1 px-2 rounded-sm text-black font-medium"
            >
              {tag.title}
            </p>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsThreeDots
              color="rgb(55 65 81)"
              className="cursor-pointer -mt-3"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="-mt-4 mr-24">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Assign</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div id="content">
        <h1 className="text-xl font-bold text-white my-2">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>
      <div
        id="duedate"
        className="text-gray-400 mt-4 border-gray-700 border-[2px] rounded-sm p-1 w-fit text-sm"
      >
        <BsCalendar2 className="inline -mt-[2px]" size="14" /> Due:{" "}
        <span className="text-white">{dueDate}</span>
      </div>
    </div>
  );
};

export default Todo;
