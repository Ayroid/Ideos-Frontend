import { ColumnTypes, Id, TodoProps } from "@/app/pages/types";
import React, { useMemo } from "react";
import { TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Todo from "./Todo";

interface Props {
  column: ColumnTypes;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTodo: (columnId: Id) => void;
  todos: TodoProps[];
}

function ColumnContainer(props: Readonly<Props>) {
  const { column, deleteColumn, updateColumn, createTodo, todos } = props;

  const [editMode, setEditMode] = React.useState(false);

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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 bg-slate-800 text-primary-foreground opacity-40 shadow hover:bg-primary/90"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md bg-slate-800 text-primary-foreground shadow hover:bg-primary/90"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="text-md flex h-[60px] cursor-grab items-center justify-between rounded-md rounded-b-none border-4 border-slate-800 bg-slate-900 p-3 font-bold"
      >
        <div className="flex gap-2">
          <div className="flex items-center justify-center rounded-full bg-slate-800 p-1 px-2 text-sm">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              value={column.title}
              className="rounded border bg-slate-900 px-2 text-primary-foreground outline-none"
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="hover-stroke-black rounded px-1 py-2 hover:bg-slate-900"
        >
          <TrashIcon></TrashIcon>
        </button>
      </div>

      <div className="flex flex-grow flex-col overflow-x-hidden overflow-y-auto ">
        <SortableContext items={todoIds}>
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo = {todo}
          />
        ))}
        </SortableContext>
      </div>

      <button
        className="active:slate-700 flex items-center gap-2 rounded-md border-2 border-slate-700 p-4 hover:bg-slate-600"
        onClick={() => {
          createTodo(column.id);
        }}
      >
        <PlusCircledIcon></PlusCircledIcon>Add Todo
      </button>
    </div>
  );
}

export default ColumnContainer;
