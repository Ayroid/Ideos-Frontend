import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";

const TodoColumnDeleteConfirmation = ({
  closePopUp,
  deleteColumn,
}: {
  closePopUp: () => void;
  deleteColumn: () => void;
}) => {
  return (
    <Card className="w-[26rem]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="w-fit text-lg mb-0">Delete Column</CardTitle>
      </CardHeader>
      <CardContent className="-mt-6">
        <p className="text-primary/60 text-sm">Are you sure you want to delete this column?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={closePopUp} variant="outline" className="w-24">
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteColumn();
            }}
            className="w-24"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoColumnDeleteConfirmation;
