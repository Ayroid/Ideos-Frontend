"use client";

import ColumnContainer from "@/components/ColumnContainer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Todo from "@/components/Todo";
import { Button } from "@/components/ui/button";
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

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { GoPlusCircle } from "react-icons/go";
import { FiHome } from "react-icons/fi";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ColumnTypes, TodoProps } from "../../../types";
import Popup from "@/components/Popup";
import TodoForm from "@/components/TodoForm";
import axios from "axios";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { generateUniqueId } from "@/utils/generateId";

const KanbanBoard = () => {
  const { getAccessTokenRaw } = useKindeBrowserClient();
  const accessToken = getAccessTokenRaw();
  const [columns, setColumns] = useState<ColumnTypes[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnTypes | null>(null);
  const [activeTodo, setActiveTodo] = useState<TodoProps | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

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

  function generateId() {
    return Math.floor(Math.random() * 10001).toString();
  }

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
      console.error("Error creating new column:", error);
    }
  }

  function updateTodoTitle(id: string, title: string) {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.uniqueId === id) {
          return { ...todo, title };
        }
        return todo;
      }),
    );
  }

  function updateTodoDescription(id: string, description: string) {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.uniqueId === id) {
          return { ...todo, description };
        }
        return todo;
      }),
    );
  }

  function updateTodoDueDate(id: string, dueDate: string) {
    console.log(dueDate);
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.uniqueId === id) {
          return { ...todo, dueDate };
        }
        return todo;
      }),
    );
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
    <div className="box-border h-screen p-10">
      <div className="m-auto flex h-full w-fit min-w-full flex-col items-start rounded-3xl bg-primary-foreground px-10">
        <div className="mt-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <FiHome />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
              </BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mt-10">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="Board">Board</TabsTrigger>
              <TabsTrigger value="List">List</TabsTrigger>
              <TabsTrigger value="Timeline">Timeline</TabsTrigger>
              <TabsTrigger value="DueTasks">Due Tasks</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="m-auto mt-10 flex w-full gap-4">
            <div className="flex gap-4">
              <SortableContext items={columns.map((col) => col.uniqueId)}>
                {columns.map((col) => (
                  <ColumnContainer
                    key={col.uniqueId}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    updateTodoTitle={updateTodoTitle}
                    updateTodoDescription={updateTodoDescription}
                    updateTodoDueDate={updateTodoDueDate}
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
            <Button onClick={createNewColumn}>
              <GoPlusCircle className="mr-2 h-4 w-4" /> Add Column
            </Button>
          </div>
          {isClient &&
            createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer
                    column={activeColumn}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    updateTodoTitle={updateTodoTitle}
                    updateTodoDescription={updateTodoDescription}
                    updateTodoDueDate={updateTodoDueDate}
                    deleteTodo={deleteTodo}
                    setPopUpVisible={(value: boolean) => setPopUpVisible(value)}
                    todos={todos.filter(
                      (t) => t.columnId === activeColumn.uniqueId,
                    )}
                  />
                )}
                {activeTodo && (
                  <Todo
                    todo={activeTodo}
                    updateTodoDescription={updateTodoDescription}
                    updateTodoTitle={updateTodoTitle}
                    updateTodoDueDate={updateTodoDueDate}
                    deleteTodo={deleteTodo}
                  />
                )}
              </DragOverlay>,
              document.body,
            )}
        </DndContext>
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
    </div>
  );
};

export default KanbanBoard;
