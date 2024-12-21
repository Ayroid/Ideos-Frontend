import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { AlertTriangleIcon } from "lucide-react";

interface TodoColumnDeleteConfirmationProps {
  closePopUp: () => void;
  deleteColumn: () => Promise<void>;
  columnTitle?: string;
}

const TodoColumnDeleteConfirmation = ({
  closePopUp,
  deleteColumn,
  columnTitle = "this column",
}: TodoColumnDeleteConfirmationProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteColumn();
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Error in delete handler:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Delete Column</CardTitle>
        <Button
          onClick={closePopUp}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
        >
          <IoClose className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="my-4 flex items-start gap-4">
          <AlertTriangleIcon className="h-5 w-5 text-destructive" />
          <div className="space-y-2">
            <p className="font-medium text-foreground">
              Are you sure you want to delete {columnTitle}?
            </p>
            <p className="text-sm text-muted-foreground">
              This will permanently delete the column and all its tasks. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={closePopUp}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoColumnDeleteConfirmation;