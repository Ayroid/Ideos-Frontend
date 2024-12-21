"use client";

import ColumnContainer from "@/components/kanban/ColumnContainer";
import Todo from "@/components/kanban/Todo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnTypes, TodoTypes } from "@/types/kanban";
import { generateUniqueId } from "@/utils/generateId";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ICONS
import { ArrowLeft } from "lucide-react";
import { GoPlusCircle } from "react-icons/go";
import { PiKanbanLight } from "react-icons/pi";

// STATE MANAGEMENT IMPORTS
import CreateTodoForm from "@/components/kanban/CreateTodoForm";
import TodoColumnDeleteConfirmation from "@/components/kanban/TodoColumnDeleteConfirmation";
import { TodoStore, useTodo } from "@/store/kanban/todo";
import { ColumnStore, useTodoColumn } from "@/store/kanban/todoColumn";
import { usePopup } from "@/store/popup";
import { getRandomColor } from "@/utils/randomColor";
import Link from "next/link";
import { toast } from "sonner";

interface Board {
  id: string;
  title: string;
  description?: string;
}

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

const BoardPage = ({ params }: BoardPageProps) => {
  const router = useRouter();
  const boardId = params.boardId;

  // STATE MANAGEMENT
  const [
    columns,
    addAllTodoColumns,
    updateTodoColumnName,
    updateTodoColumnOrder,
    deleteTodoColumn,
    addTodoColumn,
  ] = useTodoColumn((state: ColumnStore) => [
    state.columns,
    state.addAllTodoColumns,
    state.updateTodoColumnName,
    state.updateTodoColumnOrder,
    state.deleteTodoColumn,
    state.addTodoColumn,
  ]);

  const [
    todos,
    addAllTodos,
    updateTodosOrderOverTodo,
    updateTodosOrderOverColumn,
    deleteAllColumnTodos,
  ] = useTodo((state: TodoStore) => [
    state.todos,
    state.addAllTodos,
    state.updateTodosOrderOverTodo,
    state.updateTodosOrderOverColumn,
    state.deleteAllColumnTodos,
  ]);

  const [popUpVisible, openPopUp, closePopUp] = usePopup((state) => [
    state.isOpen,
    state.open,
    state.close,
  ]);

  // LOADING AND ERROR STATES
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // BOARD STATE
  const [board, setBoard] = useState<Board | null>(null);

  // ACTIVE STATES
  const [activeTodo, setActiveTodo] = useState<TodoTypes | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnTypes | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<"deleteColumn" | "createTodo">();
  const [columnIdToDelete, setColumnIdToDelete] = useState<string | null>(null);

  // OTHER STATES
  const [isClient, setIsClient] = useState(false);

  const { getAccessTokenRaw } = useKindeBrowserClient();
  const accessToken = getAccessTokenRaw();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

  // Set isClient
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch board and its columns
  useEffect(() => {
    const fetchBoardData = async () => {
      if (!accessToken || !boardId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch board details
        const boardResponse = await axios.get(`/api/kanban/boards/${boardId}`);
        setBoard(boardResponse.data);

        // Fetch columns and todos
        const columnsResponse = await axios.get(
          `/api/kanban/boards/${boardId}/columns`,
        );
        const fetchedColumns = columnsResponse.data;

        const fetchedTodos = fetchedColumns.reduce(
          (acc: TodoTypes[], col: ColumnTypes) => {
            if (col.todoIds && col.todoIds.length > 0) {
              acc.push(...col.todoIds);
            }
            return acc;
          },
          [],
        );

        addAllTodoColumns(fetchedColumns);
        addAllTodos(fetchedTodos);
      } catch (error: any) {
        console.error("Error fetching board data:", error);
        setError(error.response?.data?.message || "Error loading board");
        toast.error("Error loading board");
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [accessToken, boardId, addAllTodoColumns, addAllTodos]);

  async function createNewColumn() {
    try {
      const data: ColumnTypes = {
        uniqueId: generateUniqueId({ obj: "Col" }),
        color: getRandomColor(),
        title: "New Column",
        todoIds: [],
      };

      addTodoColumn(data);
      await axios.post(`/api/kanban/boards/${boardId}/columns`, data);
      toast.success("Column created successfully");
    } catch (error) {
      console.error("Error creating new column:", error);
      toast.error("Error creating new column");
    }
  }

  async function updateColumn(
    columnId: string,
    title: string,
    serverUpdate: boolean,
  ) {
    try {
      if (serverUpdate) {
        await axios.put(`/api/kanban/boards/${boardId}/columns/${columnId}`, {
          title,
        });
        toast.success("Column updated successfully");
      } else {
        updateTodoColumnName(columnId, title);
      }
    } catch (error) {
      console.error("Error updating column:", error);
      toast.error("Error updating column");
    }
  }

  async function deleteColumnCheck(columnId: string) {
    try {
      setColumnIdToDelete(columnId);
      if (todos.filter((t) => t.columnId === columnId).length > 0) {
        setPopupType("deleteColumn");
        openPopUp();
      } else {
        await deleteColumn(columnId);
      }
    } catch (error) {
      console.error("Error checking column deletion:", error);
      toast.error("Error checking column deletion");
    }
  }

  async function deleteColumn(columnId?: string) {
    try {
      const deleteColumnId = columnId ?? columnIdToDelete;
      closePopUp();
      deleteTodoColumn(deleteColumnId!);
      deleteAllColumnTodos(deleteColumnId!);
      await axios.delete(
        `/api/kanban/boards/${boardId}/columns/${deleteColumnId}`,
      );
      toast.success("Column deleted successfully");
    } catch (error) {
      console.error("Error deleting column:", error);
      toast.error("Error deleting column");
    }
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }
    if (event.active.data.current?.type === "Todo") {
      setActiveTodo(event.active.data.current.todo);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTodo(null);

    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    updateTodoColumnOrder(String(activeColumnId), String(overColumnId));

    // Update server
    axios
      .put(`/api/kanban/boards/${boardId}/columns/reorder`, {
        columnOrders: [
          {
            columnId: String(activeColumnId),
            order: over.data.current?.sortable?.index,
          },
          {
            columnId: String(overColumnId),
            order: active.data.current?.sortable?.index,
          },
        ],
      })
      .catch((error) => {
        console.error("Error updating column order:", error);
        toast.error("Error updating column order");
      });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActivatingTodo = active.data.current?.type === "Todo";
    const isOverTodo = over.data.current?.type === "Todo";

    if (!isActivatingTodo) return;

    if (isActivatingTodo && isOverTodo) {
      updateTodosOrderOverTodo(String(activeId), String(overId));
      // Update server
      axios
        .put(`/api/kanban/boards/${boardId}/todos/reorder`, {
          todoOrders: [
            {
              todoId: String(activeId),
              order: over.data.current?.sortable?.index,
            },
            {
              todoId: String(overId),
              order: active.data.current?.sortable?.index,
            },
          ],
        })
        .catch((error) => {
          console.error("Error updating todo order:", error);
          toast.error("Error updating todo order");
        });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActivatingTodo && isOverAColumn) {
      updateTodosOrderOverColumn(String(activeId), String(overId));
      // Update server
      axios
        .put(`/api/kanban/boards/${boardId}/todos/${activeId}`, {
          columnId: String(overId),
        })
        .catch((error) => {
          console.error("Error moving todo to column:", error);
          toast.error("Error moving todo to column");
        });
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="mb-6 h-8 w-[200px]" />
        <div className="mt-10 flex gap-4 overflow-auto">
          <Skeleton className="h-[500px] w-[350px] rounded-lg" />
          <Skeleton className="h-[500px] w-[350px] rounded-lg" />
          <Skeleton className="h-[500px] w-[350px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[65dvh] items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-2xl font-bold text-destructive">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/kanban">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Boards
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/kanban">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{board?.title}</h1>
        </div>
        <Button onClick={createNewColumn}>
          <GoPlusCircle className="mr-2 h-4 w-4" /> Add Column
        </Button>
      </div>

      {columns.length === 0 ? (
        <div className="flex h-[65dvh] items-center justify-center">
          <div className="flex flex-col items-center">
            <PiKanbanLight className="h-36 w-36 text-primary" />
            <p className="text-2xl font-bold text-primary">
              This board is empty
            </p>
            <p className="mt-1 text-center text-lg text-primary">
              Get started by adding a new column
            </p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="mt-10 flex gap-4 overflow-auto">
            <SortableContext items={columns.map((col) => col.uniqueId)}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.uniqueId}
                  column={col}
                  deleteColumn={deleteColumnCheck}
                  updateColumn={updateColumn}
                  setPopUpVisible={(value: boolean) => {
                    value ? openPopUp() : closePopUp();
                    setPopupType("createTodo");
                    setActiveColumnId(col.uniqueId);
                  }}
                  todos={todos.filter((t) => t.columnId === col.uniqueId)}
                  boardId={boardId}
                />
              ))}
            </SortableContext>
          </div>

          {isClient &&
            createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer
                    column={activeColumn}
                    deleteColumn={deleteColumnCheck}
                    updateColumn={updateColumn}
                    setPopUpVisible={(value: boolean) =>
                      value ? openPopUp() : closePopUp()
                    }
                    todos={todos.filter(
                      (t) => t.columnId === activeColumn.uniqueId,
                    )}
                    boardId={boardId}
                  />
                )}
                {activeTodo && <Todo todo={activeTodo} boardId={boardId} />}
              </DragOverlay>,
              document.body,
            )}
        </DndContext>
      )}

      <CreateTodoForm
        isOpen={popUpVisible && popupType === "createTodo"}
        onClose={closePopUp}
        activeColumnId={activeColumnId}
        boardId={boardId}
      />

      <TodoColumnDeleteConfirmation
        isOpen={popUpVisible && popupType === "deleteColumn"}
        onClose={closePopUp}
        deleteColumn={deleteColumn}
      />
    </div>
  );
};

export default BoardPage;
