"use client";

import ColumnContainer from "@/components/ColumnContainer";
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
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { GoPlusCircle } from "react-icons/go";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ColumnTypes, Id, TodoProps } from "../types";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnTypes[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnTypes | null>(null);
  const [activeTodo, setActiveTodo] = useState<TodoProps | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [todos, setTodos] = useState<TodoProps[]>([]);

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

  function createTodo(columnId: Id) {
    const todoToAdd: TodoProps = {
      id: generateId(),
      title: `Add Title`,
      columnId,
      description: "Add Description",
      tags: [
        { title: "UI Design", color: "#b1d1f5" },
        { title: "Research", color: "#d5ff81" },
      ],
      dueDate: null,
    };

    setTodos([...todos, todoToAdd]);
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
    <div className="m-auto flex min-h-screen w-full items-center">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columns.map((col) => col.id)}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTodo={createTodo}
                  updateTodoTitle={updateTodoTitle}
                  updateTodoDescription={updateTodoDescription}
                  updateTodoDueDate={updateTodoDueDate}
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
                  createTodo={createTodo}
                  updateTodoTitle={updateTodoTitle}
                  updateTodoDescription={updateTodoDescription}
                  updateTodoDueDate={updateTodoDueDate}
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
    </div>
  );
};

export default KanbanBoard;
