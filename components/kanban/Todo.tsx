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
import { FaUserCircle } from "react-icons/fa";
import Popup from "../Popup";
import UpdateTodoForm from "./UpdateTodoForm";

import { deleteTodo as deleteTodoService } from "@/services/kanban/todo";
import { useTodo } from "@/store/kanban/todo";
import { useTodoColumn } from "@/store/kanban/todoColumn";
import { Badge } from "@/components/ui/badge";

interface Props {
  todo: TodoTypes;
  columnId?: string;
  boardId: string;
}

const Todo = ({ todo, columnId, boardId }: Props) => {
  const { deleteTodos } = useTodo((state) => state);
  const { deleteTodoIdFromColumn } = useTodoColumn((state) => state);

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
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!columnId) {
      console.error("Column ID is required for deleting todo");
      return;
    }

    try {
      await deleteTodoService(
        boardId,
        todo.uniqueId,
        columnId,
        deleteTodos,
        deleteTodoIdFromColumn,
      );
    } catch (error) {
      // Error handling is done in the service
      console.error("Error in delete handler:", error);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group h-fit w-full rounded-md border-2 bg-primary-foreground p-4
          ${isDragging ? "opacity-40" : "opacity-100"}
          hover:border-primary/50 flex flex-col gap-3`}
      >
        <div className="flex items-start justify-between">
          <div id="tags" className="flex flex-wrap gap-2">
            {todo.tags.map((tag: { title: string; color: string }) => (
              <Badge
                key={tag.title}
                style={{
                  backgroundColor: tag.color,
                  color: 'white'
                }}
                className="px-2 py-1 text-[0.75rem] font-bold"
              >
                {tag.title}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <BsThreeDotsVertical className="cursor-pointer hover:text-primary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setPopUpVisible(true)}
                  className="cursor-pointer"
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsAssignPopupOpen(true)}
                  className="cursor-pointer"
                >
                  Assign
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div id="content">
          <h1 className="mb-2 bg-transparent text-xl font-bold">
            {todo.title}
          </h1>
          <p className="text-wrap break-words text-muted-foreground">
            {todo.description}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <DatePicker
            disabled
            selectedDate={new Date(String(todo.dueDate))}
          />
          {todo.assignedTo && (
            <div className="flex items-center gap-2">
              <FaUserCircle className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                {todo.assignedTo}
              </span>
            </div>
          )}
        </div>
      </div>

      {popUpVisible && (
        <Popup isOpen={popUpVisible} onClose={() => setPopUpVisible(false)}>
          <UpdateTodoForm
            todo={todo}
            boardId={boardId}
            activeColumnId={columnId!}
            onClose={() => setPopUpVisible(false)}
          />
        </Popup>
      )}

      {/* Add your AssignTodoForm component here when ready */}
      {isAssignPopupOpen && (
        <Popup isOpen={isAssignPopupOpen} onClose={() => setIsAssignPopupOpen(false)}>
          {/* Add your AssignTodoForm component here when ready */}
          {/* <AssignTodoForm
            todo={todo}
            boardId={boardId}
            onClose={() => setIsAssignPopupOpen(false)}
          /> */}
          <div />
        </Popup>
      )}
    </>
  );
};

export default Todo;