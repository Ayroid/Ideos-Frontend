import { TodoTypes, ColumnTypes } from "@/types/kanban";
import { generateUniqueId } from "@/utils/generateId";
import axios from "axios";
import { toast } from "sonner";

async function createTodo(
  boardId: string,
  newTodo: TodoTypes,
  addTodos: (todo: TodoTypes) => void,
  addTodoToColumn: (todo: TodoTypes, columnId: string) => void,
  closePopUp: () => void,
) {
  try {
    const data: TodoTypes = {
      uniqueId: generateUniqueId({ obj: "Todo" }),
      title: newTodo.title,
      columnId: newTodo.columnId,
      description: newTodo.description,
      tags: newTodo.tags,
      dueDate: newTodo.dueDate,
      assignedTo: ""
    };

    addTodos(data);
    addTodoToColumn(data, data.columnId);
    closePopUp();

    await axios.post(`/api/kanban/boards/${boardId}/todos`, data);
    toast.success("Todo created successfully");
  } catch (error) {
    console.error("Error creating new todo:", error);
    toast.error("Error creating new todo");
  }
}

async function updateTodo(
  boardId: string,
  todoData: TodoTypes,
  updateTodos: (todo: TodoTypes) => void,
  updateTodoInColumn?: (
    prevColumnId: string,
    newColumnId: string,
    todo: TodoTypes,
  ) => void,
  closePopUp?: () => void,
) {
  try {
    const prevColumnId = todoData.columnId;

    updateTodos(todoData);
    if (updateTodoInColumn && prevColumnId !== todoData.columnId) {
      updateTodoInColumn(prevColumnId, todoData.columnId, todoData);
    }
    if (closePopUp) closePopUp();

    await axios.put(
      `/api/kanban/boards/${boardId}/todos/${todoData.uniqueId}`,
      todoData,
    );
    toast.success("Todo updated successfully");
  } catch (error) {
    console.error("Error updating todo:", error);
    toast.error("Error updating todo");
  }
}

async function deleteTodo(
  boardId: string,
  todoId: string,
  columnId: string,
  deleteTodos: (todoId: string) => void,
  removeTodoFromColumn: (todoId: string, columnId: string) => void,
) {
  try {
    deleteTodos(todoId);
    removeTodoFromColumn(todoId, columnId);

    await axios.delete(`/api/kanban/boards/${boardId}/todos/${todoId}`);
    toast.success("Todo deleted successfully");
  } catch (error) {
    console.error("Error deleting todo:", error);
    toast.error("Error deleting todo");
  }
}

async function moveTodoToColumn(
  boardId: string,
  todoId: string,
  todo: TodoTypes,
  sourceColumnId: string,
  targetColumnId: string,
  updateTodoColumn: (
    todo: TodoTypes,
    sourceColId: string,
    targetColId: string,
  ) => void,
) {
  try {
    updateTodoColumn(todo, sourceColumnId, targetColumnId);

    const updatedTodo = { ...todo, columnId: targetColumnId };
    await axios.put(
      `/api/kanban/boards/${boardId}/todos/${todoId}`,
      updatedTodo,
    );
  } catch (error) {
    console.error("Error moving todo:", error);
    toast.error("Error moving todo");
  }
}

async function reorderColumnTodos(
  boardId: string,
  columnId: string,
  todos: TodoTypes[],
  updateColumnTodos: (columnId: string, todos: TodoTypes[]) => void,
) {
  try {
    updateColumnTodos(columnId, todos);

    await axios.put(
      `/api/kanban/boards/${boardId}/columns/${columnId}/todos/reorder`,
      {
        todos: todos.map((todo) => todo.uniqueId),
      },
    );
  } catch (error) {
    console.error("Error reordering todos:", error);
    toast.error("Error reordering todos");
  }
}

export {
  createTodo,
  updateTodo,
  deleteTodo,
  moveTodoToColumn,
  reorderColumnTodos,
};
