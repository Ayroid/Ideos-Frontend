import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ColumnColorType, ColumnTypes, TodoTypes } from "@/types/kanban";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import Todo from "./Todo";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const ColoredBar = ({ color }: { color: ColumnColorType }) => {
  return (
    <div className="relative flex items-center justify-center rounded-full p-1 px-2 text-sm">
      <div
        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 transform rounded-full"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};

interface Props {
  column: ColumnTypes;
  deleteColumn: (id: string) => void;
  updateColumn: (id: string, title: string, server: boolean) => void;
  setPopUpVisible: (value: boolean) => void;
  todos: TodoTypes[];
  boardId: string;
}

function ColumnContainer(props: Readonly<Props>) {
  const { column, deleteColumn, updateColumn, setPopUpVisible, todos, boardId } = props;
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
      boardId,
    },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleUpdateColumn = async (id: string, title: string, shouldUpdate: boolean) => {
    if (title.trim() === '') return;
    updateColumn(id, title, shouldUpdate);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2
          bg-primary-foreground text-primary-foreground opacity-40 shadow-xl"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="flex max-h-[75dvh] min-h-[500px] min-w-[350px] flex-col"
    >
      <CardHeader className="bg-secondary p-0 dark:bg-inherit">
        <CardTitle>
          <div
            {...attributes}
            {...listeners}
            className="group flex cursor-grab items-center justify-between rounded-md p-4
              font-bold hover:bg-primary-foreground"
          >
            <div
              className="flex w-9/12 items-center gap-2"
              onClick={() => setEditMode(true)}
            >
              <ColoredBar color={column.color} />
              {editMode ? (
                <input
                  value={column.title}
                  className="text-md w-full bg-transparent outline-none"
                  onChange={(e) => handleUpdateColumn(column.uniqueId, e.target.value, false)}
                  autoFocus
                  onBlur={() => {
                    handleUpdateColumn(column.uniqueId, column.title, true);
                    setEditMode(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    handleUpdateColumn(column.uniqueId, column.title, true);
                    setEditMode(false);
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-md cursor-text">{column.title}</p>
                  <Badge variant="secondary" className="text-xs">
                    {todos.length}
                  </Badge>
                </div>
              )}
            </div>
            <div className="z-10 flex w-3/12 justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPopUpVisible(true)}
                title="Add Task"
              >
                <PlusCircledIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => deleteColumn(column.uniqueId)}
                title="Delete Column"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="overflow-y-auto p-3">
        <div className="flex flex-grow flex-col gap-3 overflow-y-auto">
          <SortableContext items={todoIds}>
            {todos.map((todo) => (
              <Todo
                key={todo.uniqueId}
                todo={todo}
                columnId={column.uniqueId}
                boardId={boardId}
              />
            ))}
          </SortableContext>
          {todos.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed">
              <p className="text-sm text-muted-foreground">
                Drop tasks here or click + to add
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ColumnContainer;