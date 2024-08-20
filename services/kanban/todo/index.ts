import { TodoTypes } from "@/types/kanban";
import { generateUniqueId } from "@/utils/generateId";
import axios from "axios";

async function createTodo(
  newTodo: TodoTypes,
  addTodos: (todo: TodoTypes) => void,
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
    };

    addTodos(data);
    closePopUp();
    await axios.post("/api/kanban/todos", data);
  } catch (error) {
    console.error("Error creating new todo:", error);
  }
}

async function updateTodo(
  todoData: TodoTypes,
  updateTodos: (todo: TodoTypes) => void,
  closePopUp: () => void,
) {
  try {
    updateTodos(todoData);
    closePopUp();
    await axios.put(`/api/kanban/todos/${todoData.uniqueId}`, todoData);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

async function deleteTodo(
  todoId: string,
  deleteTodos: (todoId: string) => void,
  deleteTodoIdFromColumn: (todoId: string) => void,
) {
  try {
    deleteTodos(todoId);
    deleteTodoIdFromColumn(todoId);
    await axios.delete(`/api/kanban/todos/${todoId}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

export { createTodo, updateTodo, deleteTodo };
