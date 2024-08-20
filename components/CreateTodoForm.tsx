"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FiMinus } from "react-icons/fi";

import { TodoTypes } from "@/types/kanban";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { IoClose } from "react-icons/io5";
import { useState } from "react";

import { createTodo as createTodoService } from "@/services/kanban/todo";
import { useTodo } from "@/store/kanban/todo";
import { usePopup } from "@/store/popup";

interface TodoFormProps {
  activeColumnId: string | null;
  onClose: () => void;
}

const CreateTodoForm = ({ activeColumnId, onClose }: TodoFormProps) => {
  const { addTodos } = useTodo((state) => state);
  const { close: closePopUp } = usePopup((state) => state);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<Array<{ title: string; color: string }>>([]);

  const handleDateChange = (date: Date | undefined) => {
    setDueDate(date);
  };

  const handleAddTag = () => {
    const newTag = { title: "", color: "#000000" };
    setTags([...tags, newTag]);
  };

  const handleTagChange = (index: number, field: string, value: string) => {
    const newTags = tags.slice();
    newTags[index] = { ...newTags[index], [field]: value };
    setTags(newTags);
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.slice();
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && dueDate) {
      const newTodo: TodoTypes = {
        uniqueId: "",
        title,
        description,
        dueDate: dueDate.toISOString(),
        tags,
        columnId: activeColumnId!,
      };
      createTodoService(newTodo, addTodos, closePopUp);
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setTags([]);
    }
  };

  return (
    <Card className="min-h-[30rem] w-96">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="w-fit text-xl">Add Todo</CardTitle>
        <Button
          onClick={onClose}
          variant="ghost"
          className="px-2 text-red-500 hover:text-red-500"
        >
          <IoClose className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="rounded-md">
          <div className="mb-4">
            <label htmlFor="todoFormTitle">Title</label>
            <Input
              id="todoFormTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-md p-2 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="todoFormDescription">Description</label>
            <Textarea
              id="todoFormDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-md p-2 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="todoFormDate" className="block text-white">
              Due Date
            </label>
            <DatePicker
              selectedDate={dueDate}
              onDateChange={handleDateChange}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label htmlFor="todoFormTags">Tags</label>
              <Button
                type="button"
                id="todoFormTags"
                variant="ghost"
                onClick={handleAddTag}
              >
                <PlusCircledIcon className="mr-2" /> Add Tag
              </Button>
            </div>
            {tags.map((tag, index) => (
              <div key={index} className="mt-2 flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Title"
                  value={tag.title}
                  onChange={(e) =>
                    handleTagChange(index, "title", e.target.value)
                  }
                  style={{ backgroundColor: tag.color }}
                  className="rounded-md p-2 font-bold text-white"
                />
                <Input
                  type="color"
                  value={tag.color}
                  onChange={(e) =>
                    handleTagChange(index, "color", e.target.value)
                  }
                  className="m-0 w-12 rounded-md border-none p-0 outline-none"
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  variant="ghost"
                  className="px-1 text-red-500"
                >
                  <FiMinus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full">
            Add Todo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTodoForm;
