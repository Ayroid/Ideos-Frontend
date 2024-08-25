"use client";

import ColumnContainer from "@/components/ColumnContainer";
import Todo from "@/components/Todo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import TodoForm from "@/components/CreateTodoForm";
import Popup from "@/components/Popup";
import { generateUniqueId } from "@/utils/generateId";
import { SortableContext } from "@dnd-kit/sortable";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GoPlusCircle } from "react-icons/go";
import { ColumnTypes, TodoTypes } from "../../../types/kanban";

// STATE MANAGEMENT IMPORTS
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoStore, useTodo } from "@/store/kanban/todo";
import { ColumnStore, useTodoColumn } from "@/store/kanban/todoColumn";
import { usePopup } from "@/store/popup";
import { toast } from "sonner";

const KanbanBoard = () => {
  const { getAccessTokenRaw } = useKindeBrowserClient();
  const accessToken = getAccessTokenRaw();

  // STATE MANAGEMENT
  const [
    columns,
    addTodoColumn,
    addAllTodoColumns,
    updateTodoColumnName,
    updateTodoColumnOrder,
    deleteTodoColumn,
  ] = useTodoColumn((state: ColumnStore) => [
    state.columns,
    state.addTodoColumn,
    state.addAllTodoColumns,
    state.updateTodoColumnName,
    state.updateTodoColumnOrder,
    state.deleteTodoColumn,
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

  // LOADING STATES
  const [columnsLoading, setColumnsLoading] = useState<boolean>(true);

  // ACTIVE STATES
  const [activeTodo, setActiveTodo] = useState<TodoTypes | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnTypes | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>("board");
  const [popupType, setPopupType] = useState<"deleteColumn" | "createTodo">();
  const [columnIdToDelete, setColumnIdToDelete] = useState<string | null>(null);

  // OTHER STATES
  const [isClient, setIsClient] = useState(false);

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

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axios.get("/api/kanban/todoColumns");
        const fetchedColumns = response.data;
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
      } catch (error) {
        console.error("Error fetching columns:", error);
        toast.error("Error fetching columns");
      } finally {
        setColumnsLoading(false);
      }
    };

    if (accessToken) {
      fetchColumns();
    }
  }, [accessToken]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  async function createNewColumn() {
    try {
      const data: ColumnTypes = {
        uniqueId: generateUniqueId({ obj: "Col" }),
        color: getRandomColor(),
        title: "New Column",
        todoIds: [],
      };

      addTodoColumn(data);
      await axios.post("/api/kanban/todoColumns", data);
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
        await axios.put(`/api/kanban/todoColumns/${columnId}`, { title });
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
      await axios.delete(`/api/kanban/todoColumns/${deleteColumnId}`);
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

    if (!over) {
      return;
    }
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) {
      return;
    }
    updateTodoColumnOrder(String(activeColumnId), String(overColumnId));
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    const isActivatingTodo = active.data.current?.type === "Todo";
    const isOverTodo = over.data.current?.type === "Todo";

    if (!isActivatingTodo) return;

    if (isActivatingTodo && isOverTodo) {
      updateTodosOrderOverTodo(String(activeId), String(overId));
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActivatingTodo && isOverAColumn) {
      updateTodosOrderOverColumn(String(activeId), String(overId));
    }
  }
  return (
    <Tabs
      defaultValue="board"
      onValueChange={(value) => {
        setActivePage(value);
      }}
    >
      <div className="mt-10 flex w-full justify-between">
        <TabsList className="px-2 py-6">
          <TabsTrigger value="board" className="text-md">
            Board
          </TabsTrigger>
          <TabsTrigger value="list" className="text-md">
            List
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-md">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="dueTasks" className="text-md">
            Due Tasks
          </TabsTrigger>
        </TabsList>
        {activePage === "board" && (
          <Button onClick={createNewColumn}>
            <GoPlusCircle className="mr-2 h-4 w-4" /> Add Column
          </Button>
        )}
      </div>
      <TabsContent value="board">
        <div>
          {columnsLoading ? (
            <div className="mt-10 flex gap-4 overflow-auto">
              <Skeleton className="h-[500px] w-[350px] rounded-lg" />
              <Skeleton className="h-[500px] w-[350px] rounded-lg" />
              <Skeleton className="h-[500px] w-[350px] rounded-lg" />
              <Skeleton className="h-[500px] w-[350px] rounded-lg" />
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <div className="mt-10 flex gap-4 overflow-auto">
                <SortableContext
                  items={columns.map((col: ColumnTypes) => col.uniqueId)}
                >
                  {columns.map((col: ColumnTypes) => (
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
                      />
                    )}
                    {activeTodo && <Todo todo={activeTodo} />}
                  </DragOverlay>,
                  document.body,
                )}
            </DndContext>
          )}
          {popUpVisible && popupType === "createTodo" && (
            <Popup isOpen={popUpVisible} onClose={() => closePopUp()}>
              <TodoForm
                activeColumnId={activeColumnId}
                onClose={() => closePopUp()}
              />
            </Popup>
          )}
          {popUpVisible && popupType === "deleteColumn" && (
            <Popup isOpen={popUpVisible} onClose={() => closePopUp()}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="w-fit text-xl">Delete Column</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Are you sure you want to delete this column?</p>
                  <div className="mt-4 flex justify-end gap-4">
                    <Button onClick={closePopUp}>Cancel</Button>
                    <Button
                      onClick={() => {
                        deleteColumn();
                      }}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Popup>
          )}
        </div>
      </TabsContent>
      <TabsContent value="list" className="mt-10">
        List
      </TabsContent>
      <TabsContent value="timeline" className="mt-10">
        Timeline
      </TabsContent>
      <TabsContent value="dueTasks" className="mt-10">
        Due Tasks
      </TabsContent>
    </Tabs>
  );
}
export default KanbanBoard;
