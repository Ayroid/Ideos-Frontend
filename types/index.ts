import { ReactNode } from "react";

export type Id = string | number;

export type ColumnTypes = {
  _id: Id;
  title: string;
  todoIds?: string[];
};

export type TodoProps = {
  id: Id;
  title: string;
  columnId: Id;
  description: string;
  tags: {
    title: string;
    color: string;
  }[];
  dueDate: string | null;
};

export type PopupProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  container?: boolean;
};
