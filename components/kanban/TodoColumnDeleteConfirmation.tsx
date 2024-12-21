"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface TodoColumnDeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  deleteColumn: () => Promise<void>;
  columnTitle?: string;
}

const TodoColumnDeleteConfirmation = ({
  isOpen,
  onClose,
  deleteColumn,
  columnTitle = "this column",
}: TodoColumnDeleteConfirmationProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteColumn();
    } catch (error) {
      console.error("Error in delete handler:", error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Column</DialogTitle>
          <DialogDescription className="flex items-start gap-4 pt-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                Are you sure you want to delete {columnTitle}?
              </p>
              <p className="text-sm text-muted-foreground">
                This will permanently delete the column and all its tasks. This action cannot be undone.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="min-w-24"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="min-w-24"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TodoColumnDeleteConfirmation;
