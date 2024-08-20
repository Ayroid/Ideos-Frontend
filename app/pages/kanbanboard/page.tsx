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

import type { TodoStore } from "@/store/kanban/todo";
import { useTodoStore } from "@/store/kanban/todo";
import type { ColumnStore } from "@/store/kanban/todoColumn";
import { useTodoColumnStore } from "@/store/kanban/todoColumn";

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
    deleteTodoIdFromColumn,
  ] = useTodoColumnStore((state: ColumnStore) => [
    state.columns,
    state.addTodoColumn,
    state.addAllTodoColumns,
    state.updateTodoColumnName,
    state.updateTodoColumnOrder,
    state.deleteTodoColumn,
    state.deleteTodoIdFromColumn,
  ]);

  const [
    todos,
    addTodos,
    addAllTodos,
    updateTodos,
    updateTodosOrderOverTodo,
    updateTodosOrderOverColumn,
    deleteTodos,
    deleteAllColumnTodos,
  ] = useTodoStore((state: TodoStore) => [
    state.todos,
    state.addTodos,
    state.addAllTodos,
    state.updateTodos,
    state.updateTodosOrderOverTodo,
    state.updateTodosOrderOverColumn,
    state.deleteTodos,
    state.deleteAllColumnTodos,
  ]);

  // LOADING STATES
  const [columnsLoading, setColumnsLoading] = useState<boolean>(true);

  // ACTIVE STATES
  const [activeTodo, setActiveTodo] = useState<TodoTypes | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnTypes | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>("board");

  // OTHER STATES
  const [isClient, setIsClient] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);

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
        title: "New Column",
        todoIds: [],
      };

      addTodoColumn(data);
      await axios.post("/api/kanban/todoColumns", data);
    } catch (error) {
      console.error("Error creating new column:", error);
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
      } else {
        updateTodoColumnName(columnId, title);
      }
    } catch (error) {
      console.error("Error updating column:", error);
    }
  }

  async function deleteColumn(columnId: string) {
    try {
      deleteTodoColumn(columnId);
      deleteAllColumnTodos(columnId);
      await axios.delete(`/api/kanban/todoColumns/${columnId}`);
    } catch (error) {
      console.error("Error deleting column:", error);
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

  async function createTodo(newTodo: TodoTypes) {
    try {
      const data: TodoTypes = {
        uniqueId: generateUniqueId({ obj: "Todo" }),
        title: newTodo.title,
        columnId: newTodo.columnId,
        description: newTodo.description,
        tags: newTodo.tags,
        dueDate: newTodo.dueDate,
      };

      addTodos(data);
      setPopUpVisible(false);
      await axios.post("/api/kanban/todos", data);
    } catch (error) {
      console.error("Error creating new todo:", error);
    }
  }

  async function updateTodo(todoData: TodoTypes) {
    try {
      updateTodos(todoData);
      setPopUpVisible(false);
      await axios.put(`/api/kanban/todos/${todoData.uniqueId}`, todoData);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  async function deleteTodo(todoId: string) {
    try {
      deleteTodos(todoId);
      deleteTodoIdFromColumn(todoId);
      await axios.delete(`/api/kanban/todos/${todoId}`);
    } catch (error) {
      console.error("Error deleting todo:", error);
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
        {activePage == "board" && (
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
                <SortableContext items={columns.map((col) => col.uniqueId)}>
                  {columns.map((col) => (
                    <ColumnContainer
                      key={col.uniqueId}
                      column={col}
                      deleteColumn={deleteColumn}
                      updateColumn={updateColumn}
                      updateTodo={updateTodo}
                      deleteTodo={deleteTodo}
                      setPopUpVisible={(value: boolean) => {
                        setPopUpVisible(value);
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
                        deleteColumn={deleteColumn}
                        updateColumn={updateColumn}
                        updateTodo={updateTodo}
                        deleteTodo={deleteTodo}
                        setPopUpVisible={(value: boolean) =>
                          setPopUpVisible(value)
                        }
                        todos={todos.filter(
                          (t) => t.columnId === activeColumn.uniqueId,
                        )}
                      />
                    )}
                    {activeTodo && (
                      <Todo
                        todo={activeTodo}
                        updateTodo={updateTodo}
                        deleteTodo={deleteTodo}
                      />
                    )}
                  </DragOverlay>,
                  document.body,
                )}
            </DndContext>
          )}
          {popUpVisible && (
            <Popup isOpen={popUpVisible} onClose={() => setPopUpVisible(false)}>
              <TodoForm
                createTodo={createTodo}
                activeColumnId={activeColumnId}
                onClose={() => setPopUpVisible(false)}
              />
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
};

export default KanbanBoard;
