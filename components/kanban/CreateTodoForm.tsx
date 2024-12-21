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
import { useTodoColumn } from "@/store/kanban/todoColumn";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TodoFormProps {
  activeColumnId: string | null;
  boardId: string;
  onClose: () => void;
}

const CreateTodoForm = ({ activeColumnId, boardId, onClose }: TodoFormProps) => {
  const { addTodos } = useTodo((state) => state);
  const { addTodoToColumn } = useTodoColumn((state) => state);
  const { close: closePopUp } = usePopup((state) => state);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<Array<{ title: string; color: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    setDueDate(date);
  };

  const handleAddTag = () => {
    if (tags.length >= 5) {
      toast.warning("Maximum 5 tags allowed");
      return;
    }
    const newTag = { title: "", color: "#3B82F6" };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeColumnId) {
      toast.error("No column selected");
      return;
    }

    if (!title.trim() || !description.trim() || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate tags
    const validTags = tags.filter(tag => tag.title.trim() !== "");
    if (tags.length > 0 && validTags.length !== tags.length) {
      toast.error("Please fill in all tag titles or remove empty tags");
      return;
    }

    try {
      setIsSubmitting(true);
      const newTodo: TodoTypes = {
        uniqueId: "",
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate.toISOString(),
        tags: validTags,
        columnId: activeColumnId,
        assignedTo: "",
      };

      await createTodoService(boardId, newTodo, addTodos, addTodoToColumn, closePopUp);

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setTags([]);
    } catch (error) {
      console.error("Error creating todo:", error);
      // Error toast is handled in the service
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="min-h-[30rem] w-[450px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Add Task</CardTitle>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
        >
          <IoClose className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="todoFormTitle">Title</Label>
            <Input
              id="todoFormTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="todoFormDescription">Description</Label>
            <Textarea
              id="todoFormDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="min-h-[100px] w-full"
              maxLength={500}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="todoFormDate">Due Date</Label>
            <DatePicker
              selectedDate={dueDate}
              onDateChange={handleDateChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="todoFormTags">Tags</Label>
              <Button
                type="button"
                id="todoFormTags"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                className="h-8"
              >
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                Add Tag
              </Button>
            </div>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Tag name"
                    value={tag.title}
                    onChange={(e) =>
                      handleTagChange(index, "title", e.target.value)
                    }
                    className="w-full"
                    maxLength={20}
                  />
                  <Input
                    type="color"
                    value={tag.color}
                    onChange={(e) =>
                      handleTagChange(index, "color", e.target.value)
                    }
                    className="h-10 w-14 cursor-pointer"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <FiMinus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTodoForm;