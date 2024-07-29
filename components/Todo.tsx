import { Id, TodoProps } from "@/app/pages/types";
import { DatePicker } from "@/components/ui/date-picker"; // Import DatePicker
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiTag } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

interface Props {
  todo: TodoProps;
  updateTodoTitle: (id: Id, title: string) => void;
  updateTodoDescription: (id: Id, description: string) => void;
  updateTodoDueDate: (id: Id, dueDate: string) => void;
}

const Todo = ({
  todo,
  updateTodoTitle,
  updateTodoDescription,
  updateTodoDueDate,
}: Props) => {
  const [titleEditMode, setTitleEditMode] = useState<boolean>(false);
  const [descEditMode, setDescEditMode] = useState<boolean>(false);

  const [todoTitle, setTodoTitle] = useState<string>(todo.title);
  const [todoDescription, setTodoDescription] = useState<string>(
    todo.description,
  );
  const [todoDueDate, setTodoDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined,
  ); // State for due date

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (descEditMode && textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [descEditMode, todoDescription]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to auto to shrink if needed
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setTodoDueDate(date);
    if (date) {
      updateTodoDueDate(todo.id, date.toISOString());
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`h-fit w-full rounded-md border-2 bg-primary-foreground p-4 ${isDragging ? "opacity-40" : "opacity-100"} flex flex-col`}
    >
      <div className="flex items-start justify-between">
        <div id="tags" className="mb-2 flex flex-wrap gap-2">
          {todo.tags.map((tag) => (
            <p
              key={tag.title}
              style={{ backgroundColor: tag.color }}
              className="text-nowrap rounded-sm px-2 py-1 text-[0.75rem] font-medium text-black"
            >
              {tag.title}
            </p>
          ))}
        </div>
        <div className="mt-1 flex gap-1">
          <HiTag size="18" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <BsThreeDotsVertical
                color="rgb(255 255 255)"
                className="cursor-pointer"
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
      </div>
      <div id="content">
        {titleEditMode ? (
          <input
            type="text"
            value={todoTitle}
            className="text-md my-2 w-full bg-transparent text-xl font-bold text-white outline-none"
            onChange={(e) => setTodoTitle(e.target.value)}
            autoFocus
            onBlur={() => {
              setTitleEditMode(false);
              updateTodoTitle(todo.id, todoTitle);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setTitleEditMode(false);
              updateTodoTitle(todo.id, todoTitle);
            }}
          />
        ) : (
          <h1
            className="my-2 bg-transparent text-xl font-bold text-white"
            onClick={() => setTitleEditMode(true)}
          >
            {todoTitle}
          </h1>
        )}
        {descEditMode ? (
          <textarea
            ref={textareaRef}
            value={todoDescription}
            className="text-md w-full resize-none text-clip bg-transparent text-gray-400 outline-none"
            onChange={(e) => setTodoDescription(e.target.value)}
            autoFocus
            onBlur={() => {
              setDescEditMode(false);
              updateTodoDescription(todo.id, todoDescription);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setDescEditMode(false);
              updateTodoDescription(todo.id, todoDescription);
            }}
          />
        ) : (
          <p
            className="text-wrap break-words text-gray-400"
            onClick={() => setDescEditMode(true)}
          >
            {todoDescription}
          </p>
        )}
      </div>
      <DatePicker selectedDate={todoDueDate} onDateChange={handleDateChange} />
    </div>
  );
};

export default Todo;
