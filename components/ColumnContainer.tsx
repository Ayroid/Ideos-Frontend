import { ColumnTypes, Id } from "@/app/pages/types";
import React from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Todo from "./Todo";

interface Props {
  column: ColumnTypes;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn } = props;

  const [editMode, setEditMode] = React.useState(false);

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

      <div className="flex flex-grow">
        <Todo
          title="Research Featured Order"
          description="An order feature is needed for users when making purchases"
          dueDate="16 May"
          tags={[
            {
              title: "UI Design",
              color: "#b1d1f5",
            },
            {
              title: "Research",
              color: "#d5ff81",
            },
          ]}
        />
      </div>

      <div>Footer</div>
    </div>
  );
}

export default ColumnContainer;
