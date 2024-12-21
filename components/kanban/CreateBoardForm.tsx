"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CreateBoardFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBoardForm = ({ isOpen, onClose }: CreateBoardFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/kanban/boards", formData);
      router.push(`/kanban/${response.data.id}`);
      toast.success("Board created successfully");
      onClose();
    } catch (error) {
      console.error("Error creating board:", error);
      toast.error("Error creating board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Board Title
            </Label>
            <Input
              id="title"
              placeholder="Enter board title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Board Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter board description (optional)"
              value={formData.description}
              className="min-h-[100px] w-full"
              maxLength={500}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="min-w-24"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="min-w-24" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardForm;