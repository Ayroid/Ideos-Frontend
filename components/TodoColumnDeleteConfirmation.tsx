import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "@/components/ui/button";

const TodoColumnDeleteConfirmation = ({
  closePopUp,
  deleteColumn,
}: {
  closePopUp: () => void;
  deleteColumn: () => void;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="w-fit text-xl">Delete Column</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Are you sure you want to delete this column?</p>
        <div className="mt-4 flex justify-end gap-4">
          <Button onClick={closePopUp}>Cancel</Button>
          <Button
            onClick={() => {
              deleteColumn();
            }}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoColumnDeleteConfirmation;
