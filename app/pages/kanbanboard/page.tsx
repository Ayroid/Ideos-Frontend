"use client";

import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { ColumnTypes, Id } from "../types";
import ColumnContainer from "@/components/columnContainer";
import { DndContext } from "@dnd-kit/core";


const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnTypes[]>([]);
  console.log(columns);

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] bg-slate-950">
      <DndContext>
      <div className="m-auto flex gap-4">
        <div className="flex gap-2">
          {columns.map((col) => (
            <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn} />
          ))}
        </div>
        <Button
          className="h-[60px] min-w[350px] cursor-pointer hover:ring-2 flex gap-2"
          onClick={createNewColumn}
        >
          <PlusCircledIcon></PlusCircledIcon>
          Add Column
        </Button>
      </div>
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
  }
};

export default KanbanBoard;
