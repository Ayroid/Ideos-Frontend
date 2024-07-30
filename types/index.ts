import { ReactNode } from "react";

export type Id = string | number;

export type ColumnTypes = {
  id: Id;
  title: string;
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
