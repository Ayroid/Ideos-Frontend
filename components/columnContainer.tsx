import { ColumnTypes, Id } from "@/app/pages/types";
import React from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
        className="bg-slate-800 text-primary-foreground shadow hover:bg-primary/90 
    opacity-40
    border-2
w-[350px]
h-[500px]
max-h-[500px]
rounded-md
flex
flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-800 text-primary-foreground shadow hover:bg-primary/90 
  w-[350px]
  h-[500px]
  max-h-[500px]
  rounded-md
  flex
  flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-slate-900
            text-md
            h-[60px]
            cursor-grab
            rounded-md
            rounded-b-none
            p-3
            font-bold
            border-slate-800 
            border-4
            flex
            items-center
            justify-between
        "
      >
        <div className="flex gap-2">
          <div
            className="
            flex
            justify-center
            items-center bg-slate-800 px-2 p-1 text-sm rounded-full
            "
          >
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
            value={column.title}
            className="bg-slate-900 text-primary-foreground border rounded outline-none px-2"
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
          className="hover-stroke-black hover:bg-slate-900 rounded px-1 py-2"
        >
          <TrashIcon></TrashIcon>
        </button>
      </div>

      <div className="flex flex-grow">Content</div>

      <div>Footer</div>
    </div>
  );
}

export default ColumnContainer;
