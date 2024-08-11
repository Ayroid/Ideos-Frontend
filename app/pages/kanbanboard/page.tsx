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
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GoPlusCircle } from "react-icons/go";
import { ColumnTypes, TodoProps } from "../../../types";

const KanbanBoard = () => {
  const { getAccessTokenRaw } = useKindeBrowserClient();
  const accessToken = getAccessTokenRaw();
  const [columns, setColumns] = useState<ColumnTypes[]>([]);
  const [columnsLoading, setColumnsLoading] = useState<boolean>(true);
  const [activeColumn, setActiveColumn] = useState<ColumnTypes | null>(null);
  const [activeTodo, setActiveTodo] = useState<TodoProps | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>("board");

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        console.log("Sending Request");
        const response = await axios.get(
          `http://localhost:5000/api/todoColumns`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const fetchedColumns = response.data;

        const fetchedTodos = fetchedColumns.reduce(
          (acc: TodoProps[], col: ColumnTypes) => {
            if (col.todoIds && col.todoIds.length > 0) {
              acc.push(...col.todoIds);
            }
            return acc;
          },
          [],
        );

        setColumns(fetchedColumns);
        setTodos(fetchedTodos);
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
      const uniqueId = generateUniqueId({ obj: "Col" });
      const title = "New Column";

      const data: ColumnTypes = {
        uniqueId,
        title,
        todoIds: [],
      };

      setColumns([...columns, data]);
      await axios.post(`http://localhost:5000/api/todoColumns`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error creating new column:", error);
    }
  }

  async function updateColumn(id: string, title: string, server: boolean) {
    try {
      if (!server) {
        setColumns((columns) =>
          columns.map((col) => (col.uniqueId === id ? { ...col, title } : col)),
        );
      } else {
        await axios.put(
          `http://localhost:5000/api/todoColumns/${id}`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      }
    } catch (error) {
      console.error("Error updating column:", error);
    }
  }

  async function deleteColumn(id: string) {
    try {
      setColumns(columns.filter((col) => col.uniqueId !== id));
      setTodos(todos.filter((todo) => todo.columnId !== id));
      await axios.delete(`http://localhost:5000/api/todoColumns/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.uniqueId === activeColumnId,
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.uniqueId === overColumnId,
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
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
      setTodos((todos) => {
        const activeIndex = todos.findIndex(
          (todo) => todo.uniqueId === activeId,
        );
        const overIndex = todos.findIndex((todo) => todo.uniqueId === overId);

        todos[activeIndex].columnId = todos[overIndex].columnId;

        return arrayMove(todos, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActivatingTodo && isOverAColumn) {
      setTodos((todos) => {
        const activeIndex = todos.findIndex(
          (todo) => todo.uniqueId === activeId,
        );
        todos[activeIndex].columnId = String(overId);

        updateTodo(todos[activeIndex]);

        return arrayMove(todos, activeIndex, activeIndex);
      });
    }
  }

  async function createTodo(newTodo: TodoProps) {
    try {
      const uniqueId = generateUniqueId({ obj: "Todo" });

      const data: TodoProps = {
        uniqueId,
        title: newTodo.title,
        columnId: newTodo.columnId,
        description: newTodo.description,
        tags: newTodo.tags,
        dueDate: newTodo.dueDate,
      };

      setTodos([...todos, data]);
      setPopUpVisible(false);
      await axios.post(`http://localhost:5000/api/todos`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error creating new todo:", error);
    }
  }

  async function updateTodo(todoData: TodoProps) {
    try {
      setTodos((todos) =>
        todos.map((todo) => {
          if (todo.uniqueId === todoData.uniqueId) {
            return { ...todoData };
          }
          return todo;
        }),
      );
      setPopUpVisible(false);
      await axios.put(
        `http://localhost:5000/api/todos/${todoData.uniqueId}`,
        todoData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  async function deleteTodo(id: string) {
    try {
      setTodos((todos) => todos.filter((todo) => todo.uniqueId !== id));

      setColumns((columns) =>
        columns.map((col) => ({
          ...col,
          todoIds: col.todoIds.filter((todoId) => todoId.uniqueId !== id),
        })),
      );

      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
