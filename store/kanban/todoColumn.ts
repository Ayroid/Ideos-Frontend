import { ColumnTypes, TodoTypes } from "@/types/kanban";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";

type State = {
  columns: ColumnTypes[];
};

type Actions = {
  addTodoColumn: (column: ColumnTypes) => void;
  addAllTodoColumns: (columns: ColumnTypes[]) => void;
  addTodoToColumn: (todo: TodoTypes, columnId: string) => void;
  updateTodoColumnName: (columnId: string, title: string) => void;
  updateTodoColumnOrder: (activeColumnId: string, overColumnId: string) => void;
  deleteTodoColumn: (columnId: string) => void;
  deleteTodoIdFromColumn: (todoId: string) => void;
};

type ColumnStore = State & Actions;

const useTodoColumnStore = create<ColumnStore>((set) => ({
  columns: [] as ColumnTypes[],

  addTodoColumn: (column: ColumnTypes) =>
    set((state: ColumnStore) => ({
      columns: [...state.columns, column],
    })),

  addAllTodoColumns: (columns: ColumnTypes[]) =>
    set((state: ColumnStore) => ({
      columns: columns,
    })),

  addTodoToColumn: (todo: TodoTypes, columnId: string) =>
    set((state: ColumnStore) => ({
      columns: state.columns.map((col) =>
        col.uniqueId === columnId
          ? { ...col, todoIds: [...col.todoIds, todo] }
          : col,
      ),
    })),

  updateTodoColumnName: (columnId: string, title: string) =>
    set((state: ColumnStore) => ({
      columns: state.columns.map((column: ColumnTypes) =>
        column.uniqueId === columnId ? { ...column, title } : column,
      ),
    })),

  updateTodoColumnOrder: (activeColumnId: string, overColumnId: string) =>
    set((state: ColumnStore): ColumnStore => {
      const activeColumnIndex = state.columns.findIndex(
        (col) => col.uniqueId === activeColumnId,
      );

      const overColumnIndex = state.columns.findIndex(
        (col) => col.uniqueId === overColumnId,
      );

      return {
        ...state,
        columns: arrayMove(state.columns, activeColumnIndex, overColumnIndex),
      };
    }),

  deleteTodoColumn: (id: string) =>
    set((state: ColumnStore) => ({
      columns: state.columns.filter(
        (column: ColumnTypes) => column.uniqueId !== id,
      ),
    })),

  deleteTodoIdFromColumn: (todoId: string) =>
    set((state: ColumnStore) => ({
      columns: state.columns.map((column: ColumnTypes) => ({
        ...column,
        todos: column.todoIds.filter((todo) => todo.uniqueId !== todoId),
      })),
    })),
}));

export { useTodoColumnStore as useTodoColumn };
export type { ColumnStore };
