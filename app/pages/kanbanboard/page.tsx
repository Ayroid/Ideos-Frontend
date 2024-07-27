"use client";

import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import React, { useEffect, useMemo, useState } from "react";
import { ColumnTypes, Id, TodoProps } from "../types";
import ColumnContainer from "@/components/ColumnContainer";
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
import { createPortal } from "react-dom";
import Todo from "@/components/Todo";
import { todo } from "node:test";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnTypes[]>([]);
  console.log(columns);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

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
    console.log("its true");
  }, []);

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden bg-slate-950 px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-2">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTodo={createTodo}
                  // TODO: Create a edit and delete todo function

                  todos={todos.filter((t) => t.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <Button
            className="min-w[350px] flex h-[60px] cursor-pointer gap-2 hover:ring-2"
            onClick={createNewColumn}
          >
            <PlusCircledIcon></PlusCircledIcon>
            Add Column
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
                  todos={todos.filter((t) => t.columnId === activeColumn.id)}
                />
              )}
              {activeTodo && <Todo todo={activeTodo} />}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </div>
  );

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
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTodos = todos.filter((todo) => todo.columnId !== id);
    setTodos(newTodos);
  }

  function updateColumn(id: Id, title: string) {
    setColumns((columns) =>
      columns.map((col) => {
        if (col.id === id) {
          return {
            ...col,
            title,
          };
        }
        return col;
      }),
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

    if(!isActivatingTodo) return; 

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
      title: `Todo ${todos.length + 1}`,
      columnId,
      description: "Add Description",
      tags: [
        { title: "UI Design", color: "#b1d1f5" },
        {
          title: "Research",
          color: "#d5ff81",
        },
      ],
      dueDate: "2022-01-01",
    };

    setTodos([...todos, todoToAdd]);
  }
};

export default KanbanBoard;
