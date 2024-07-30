"use client";

import ColumnContainer from "@/components/ColumnContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ColumnTypes, Id, TodoProps } from "../../../types";
import Popup from "@/components/Popup";
import TodoForm from "@/components/TodoForm";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnTypes[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnTypes | null>(null);
  const [activeTodo, setActiveTodo] = useState<TodoProps | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const [activeColumnId, setActiveColumnId] = useState<Id | null>(null);

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

  function createNewColumn() {
    const columnToAdd: ColumnTypes = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  function deleteColumn(id: Id) {
    setColumns(columns.filter((col) => col.id !== id));
    setTodos(todos.filter((todo) => todo.columnId !== id));
  }

  function updateColumn(id: Id, title: string) {
    setColumns((columns) =>
      columns.map((col) => (col.id === id ? { ...col, title } : col)),
    );
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
        (col) => col.id === activeColumnId,
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId,
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
        const activeIndex = todos.findIndex((todo) => todo.id === activeId);
        const overIndex = todos.findIndex((todo) => todo.id === overId);

        todos[activeIndex].columnId = todos[overIndex].columnId;

        return arrayMove(todos, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActivatingTodo && isOverAColumn) {
      setTodos((todos) => {
        const activeIndex = todos.findIndex((todo) => todo.id === activeId);

        todos[activeIndex].columnId = overId;

        return arrayMove(todos, activeIndex, activeIndex);
      });
    }
  }

  function createTodo(newTodo: TodoProps) {
    const todoToAdd: TodoProps = {
      id: generateId(),
      title: newTodo.title,
      columnId: newTodo.columnId,
      description: newTodo.description,
      tags: newTodo.tags,
      dueDate: newTodo.dueDate,
    };

    console.log(todoToAdd);

    setTodos([...todos, todoToAdd]);
    setPopUpVisible(false);
  }

  function updateTodoTitle(id: Id, title: string) {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, title };
        }
        return todo;
      }),
    );
  }

  function updateTodoDescription(id: Id, description: string) {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, description };
        }
        return todo;
      }),
    );
  }

  function updateTodoDueDate(id: Id, dueDate: string) {
    console.log(dueDate);
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, dueDate };
        }
        return todo;
      }),
    );
  }

  return (
    <div className="box-border h-screen p-10">
      <div className="m-auto flex h-full w-full flex-col items-start rounded-3xl bg-[#191A1C] px-10">
        <div className="mt-10 w-4/5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                
                <BreadcrumbLink href="/"><FiHome /></BreadcrumbLink>
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
              <SortableContext items={columns.map((col) => col.id)}>
                {columns.map((col) => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                      updateTodoTitle={updateTodoTitle}
                    updateTodoDescription={updateTodoDescription}
                    updateTodoDueDate={updateTodoDueDate}
                  setPopUpVisible={(value: boolean) => {
                    setPopUpVisible(value);
                    setActiveColumnId(col.id);
                  }}
                    todos={todos.filter((t) => t.columnId === col.id)}
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
                  setPopUpVisible={(value: boolean) => setPopUpVisible(value)}
                    todos={todos.filter((t) => t.columnId === activeColumn.id)}
                  />
                )}
                {activeTodo && (
                  <Todo
                    todo={activeTodo}
                    updateTodoDescription={updateTodoDescription}
                    updateTodoTitle={updateTodoTitle}
                    updateTodoDueDate={updateTodoDueDate}
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
