import { DatePicker } from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TodoTypes } from "@/types/kanban";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Popup from "./Popup";
import UpdateTodoForm from "./UpdateTodoForm";

interface Props {
  todo: TodoTypes;
  columnId?: string;
  updateTodo: (todoData: TodoTypes) => void;
  deleteTodo: (id: string) => void;
}

const Todo = ({ todo, columnId, updateTodo, deleteTodo }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.uniqueId,
    data: {
      type: "Todo",
      todo,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`h-fit w-full rounded-md border-2 bg-primary-foreground p-4 ${isDragging ? "opacity-40" : "opacity-100"} flex flex-col`}
      >
        <div className="flex items-start justify-between">
          <div id="tags" className="mb-2 flex flex-wrap gap-2">
            {todo.tags.map((tag: { title: string; color: string }) => (
              <p
                key={tag.title}
                style={{ backgroundColor: tag.color }}
                className="text-nowrap rounded-sm px-2 py-1 text-[0.75rem] font-bold text-white"
              >
                {tag.title}
              </p>
            ))}
          </div>
          <div className="mt-1 flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <BsThreeDotsVertical className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-24">
                <DropdownMenuItem
                  onClick={() => {
                    setPopUpVisible(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>Assign</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => {
                    deleteTodo(todo.uniqueId);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div id="content">
          <h1 className="my-2 bg-transparent text-xl font-bold">
            {todo.title}
          </h1>

          <p className="text-wrap break-words text-muted-foreground">
            {todo.description}
          </p>
        </div>
        <DatePicker disabled selectedDate={new Date(String(todo.dueDate))} />
      </div>
      {popUpVisible && (
        <Popup isOpen={popUpVisible} onClose={() => setPopUpVisible(false)}>
          <UpdateTodoForm
            updateTodo={updateTodo}
            todo={todo}
            activeColumnId={columnId!}
            onClose={() => setPopUpVisible(false)}
          />
        </Popup>
      )}
    </>
  );
};

export default Todo;
