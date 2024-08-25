import { TodoTypes } from "@/types/kanban";
import { generateUniqueId } from "@/utils/generateId";
import axios from "axios";
import { toast } from "sonner"; // Make sure you have `sonner` installed

async function createTodo(
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
    };

    addTodos(data);
    addTodoToColumn(data, data.columnId);
    closePopUp();
    await axios.post("/api/kanban/todos", data);
    toast.success("Todo created successfully");
  } catch (error) {
    console.error("Error creating new todo:", error);
    toast.error("Error creating new todo");
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
    toast.success("Todo updated successfully");
  } catch (error) {
    console.error("Error updating todo:", error);
    toast.error("Error updating todo");
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
    toast.success("Todo deleted successfully");
  } catch (error) {
    console.error("Error deleting todo:", error);
    toast.error("Error deleting todo");
  }
}

export { createTodo, updateTodo, deleteTodo };
