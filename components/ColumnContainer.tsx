import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ColumnTypes, TodoTypes } from "@/types/kanban";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";
import Todo from "./Todo";
import { Button } from "./ui/button";

// Function to get a random color class
function getRandomColor() {
  const colors = [
    "bg-blue-500",
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Separate ColoredBar component to avoid re-render issues
const ColoredBar = () => {
  const [colorClass, setColorClass] = useState("");

  useEffect(() => {
    setColorClass(getRandomColor());
  }, []);

  return (
    <div className="relative flex items-center justify-center rounded-full p-1 px-2 text-sm">
      <div
        className={`absolute left-0 top-1/2 h-6 w-1 ${colorClass} -translate-y-1/2 transform`}
      ></div>
    </div>
  );
};

interface Props {
  column: ColumnTypes;
  deleteColumn: (id: string) => void;
  updateColumn: (id: string, title: string, server: boolean) => void;
  updateTodo: (todoData: TodoTypes) => void;
  deleteTodo: (id: string) => void;
  setPopUpVisible: (value: boolean) => void;
  todos: TodoTypes[];
}
function ColumnContainer(props: Readonly<Props>) {
  const {
    column,
    deleteColumn,
    updateColumn,
    updateTodo,
    deleteTodo,
    setPopUpVisible,
    todos,
  } = props;
  const [editMode, setEditMode] = useState<boolean>(false);

  const todoIds = useMemo(() => todos.map((todo) => todo.uniqueId), [todos]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.uniqueId,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={
          "flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 bg-primary-foreground text-primary-foreground opacity-40 shadow-xl"
        }
      ></div>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={"flex min-h-[500px] min-w-[350px] flex-col"}
    >
      <CardHeader className="p-0">
        <CardTitle>
          <div
            {...attributes}
            {...listeners}
            className={
              "flex cursor-grab items-center justify-between rounded-md p-4 font-bold hover:bg-primary-foreground"
            }
          >
            <div
              className="flex w-9/12 gap-2"
              onClick={() => setEditMode(true)}
            >
              <ColoredBar />
              {editMode ? (
                <input
                  value={column.title}
                  className="text-md w-full bg-transparent outline-none"
                  onChange={(e) =>
                    updateColumn(column.uniqueId, e.target.value, !editMode)
                  }
                  autoFocus
                  onBlur={() => {
                    updateColumn(column.uniqueId, column.title, editMode);
                    setEditMode(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    updateColumn(column.uniqueId, column.title, editMode);
                    setEditMode(false);
                  }}
                />
              ) : (
                <p className="text-md">{column.title}</p>
              )}
            </div>
            <div className="z-10 flex w-3/12 justify-end gap-2">
              <Button
                variant="ghost"
                className="m-0 px-1"
                onClick={() => {
                  setPopUpVisible(true);
                }}
              >
                <PlusCircledIcon />
              </Button>
              <Button
                variant="ghost"
                className="m-0 px-1"
                onClick={() => deleteColumn(column.uniqueId)}
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-3">
        <div className="flex flex-grow flex-col gap-3 overflow-y-auto">
          <SortableContext items={todoIds}>
            {todos.map((todo) => (
              <Todo
                key={todo.uniqueId}
                todo={todo}
                columnId={column.uniqueId}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo}
              />
            ))}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}

export default ColumnContainer;
