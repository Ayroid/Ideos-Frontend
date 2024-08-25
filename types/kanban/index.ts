import { ReactNode } from "react";

export type ColumnTypes = {
  uniqueId: string;
  color: string;
  title: string;
  todoIds: TodoTypes[];
};

export type TodoTypes = {
  uniqueId: string;
  title: string;
  columnId: string;
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

export type uniqueIdProps = {
  obj: "Todo" | "Col";
};
