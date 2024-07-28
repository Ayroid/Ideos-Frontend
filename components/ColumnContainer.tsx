import { ColumnTypes, Id, TodoProps } from "@/app/pages/types";
import React, { useEffect, useMemo, useState } from "react";
import { TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Todo from "./Todo";

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
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTodo: (columnId: Id) => void;
  todos: TodoProps[];
}

function ColumnContainer(props: Readonly<Props>) {
  const { column, deleteColumn, updateColumn, createTodo, todos } = props;
  const [editMode, setEditMode] = useState(false);

  const todoIds = useMemo(() => todos.map((todo) => todo.id), [todos]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
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

  const columnContainerHoverColor = "#27282C";
  const columnTitleHoverColor = "#2B2E33";

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 bg-[#2C2F34] text-primary-foreground opacity-40 shadow-xl`}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex h-[600px] max-h-[500px] w-[350px] flex-col rounded-md bg-[#111214] text-primary-foreground shadow hover:bg-[${columnContainerHoverColor}]`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`text-md flex h-[60px] cursor-grab items-center justify-between rounded-md rounded-b-none border-slate-800 bg-[#111214] p-3 font-bold hover:bg-[${columnTitleHoverColor}]`}
      >
        <div className="flex gap-2 w-9/12" onClick={() => setEditMode(true)}>
          <ColoredBar />
          {editMode ? (
            <input
              value={column.title}
              className="text-md h-10 border-b-2 bg-transparent text-primary-foreground outline-none w-full"
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          ) : (
            <p className="text-md">{column.title}</p>
          )}
        </div>
        <div className="z-10 flex justify-center align-middle w-3/12">
          <button
            className="flex items-center gap-2 rounded-md border-0 border-slate-700 p-4 hover:bg-[#2A2D32]"
            onClick={() => createTodo(column.id)}
          >
            <PlusCircledIcon />
          </button>
          <button
            onClick={() => deleteColumn(column.id)}
            className="rounded px-1 py-2 hover:bg-[#2C2F34]"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="flex flex-grow flex-col overflow-y-auto overflow-x-hidden">
        <SortableContext items={todoIds}>
          {todos.map((todo) => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default ColumnContainer;
