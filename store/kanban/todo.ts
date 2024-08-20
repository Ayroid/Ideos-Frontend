import { TodoTypes } from "@/types/kanban";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";

type State = {
  todos: TodoTypes[];
};

type Actions = {
  addTodos: (todo: TodoTypes) => void;
  addAllTodos: (todos: TodoTypes[]) => void;
  updateTodos: (updatedTodo: TodoTypes) => void;
  updateTodosOrderOverTodo: (activeTodoId: string, overTodoId: string) => void;
  updateTodosOrderOverColumn: (
    activeTodoId: string,
    overColumnId: string,
  ) => void;
  deleteTodos: (todoId: string) => void;
  deleteAllColumnTodos: (columnId: string) => void;
};

type TodoStore = State & Actions;

const useTodoStore = create<TodoStore>((set) => ({
  todos: [] as TodoTypes[],

  addTodos: (todo: TodoTypes) =>
    set((state: TodoStore) => ({
      todos: [...state.todos, todo],
    })),

  addAllTodos: (todos: TodoTypes[]) =>
    set((state: TodoStore) => ({
      todos: todos,
    })),

  updateTodos: (updatedTodo: TodoTypes) =>
    set((state: TodoStore) => ({
      todos: state.todos.map((todo) =>
        todo.uniqueId === updatedTodo.uniqueId ? updatedTodo : todo,
      ),
    })),

  updateTodosOrderOverTodo: (activeTodoId: string, overTodoId: string) =>
    set((state: TodoStore): TodoStore => {
      const activeTodoIndex = state.todos.findIndex(
        (todo) => todo.uniqueId === activeTodoId,
      );

      const overTodoIndex = state.todos.findIndex(
        (todo) => todo.uniqueId === overTodoId,
      );

      return {
        ...state,
        todos: arrayMove(state.todos, activeTodoIndex, overTodoIndex),
      };
    }),

  updateTodosOrderOverColumn: (activeTodoId: string, overColumnId: string) =>
    set((state: TodoStore): TodoStore => {
      const activeTodoIndex = state.todos.findIndex(
        (todo) => todo.uniqueId === activeTodoId,
      );

      state.todos[activeTodoIndex].columnId = String(overColumnId);

      state.updateTodos(state.todos[activeTodoIndex]);

      return {
        ...state,
        todos: arrayMove(state.todos, activeTodoIndex, activeTodoIndex),
      };
    }),

  deleteTodos: (todoId: string) =>
    set((state: TodoStore) => ({
      todos: state.todos.filter((t) => t.uniqueId !== todoId),
    })),

  deleteAllColumnTodos: (columnId: string) =>
    set((state: TodoStore) => ({
      todos: state.todos.filter((t) => t.columnId !== columnId),
    })),
}));

export { useTodoStore };
export type { TodoStore };
