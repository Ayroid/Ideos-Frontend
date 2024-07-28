import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsCalendar2, BsThreeDotsVertical } from "react-icons/bs";
import { TodoProps } from "@/app/pages/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  todo: TodoProps;
}

const Todo = ({ todo }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    data: {
      type: "Todo",
      todo,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`m-2 h-fit rounded-md p-4 ${isDragging ? "border-2 bg-slate-800 opacity-40" : "bg-[#1c1c21]"} flex flex-col`}
    >
      <div className="flex justify-between">
        <div id="tags" className="mb-2 flex gap-2">
          {todo.tags.map((tag) => (
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
            <BsThreeDotsVertical
              color="rgb(255 255 255)"
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
        <h1 className="my-2 text-xl font-bold text-white">{todo.title}</h1>
        <p className="text-gray-400">{todo.description}</p>
      </div>
      <div
        id="duedate"
        className="mt-4 w-fit rounded-sm border-[2px] border-gray-700 p-1 text-sm text-gray-400"
      >
        <BsCalendar2 className="-mt-[2px] inline" size="14" /> Due:{" "}
        <span className="text-white">{todo.dueDate}</span>
      </div>
    </div>
  );
};

export default Todo;
