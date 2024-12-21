import { ReactNode } from "react";

export const ColumnColor = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#7C3AED",
  "#9333EA",
  "#EC4899",
  "#6B7280",
  "#F43F5E",
  "#06B6D4",
  "#F472B6",
  "#10B981",
  "#F97316",
  "#84CC16",
] as const;

export type ColumnColorType = (typeof ColumnColor)[number];

export type ColumnTypes = {
  uniqueId: string;
  color: ColumnColorType;
  title: string;
  todoIds: TodoTypes[];
};

export type TodoTypes = {
  assignedTo: string;
  uniqueId: string;
  title: string;
  columnId: string;
  description: string;
  tags: {
    title: string;
    color: string;
  }[];
  dueDate: string | null;
  originalColumnId?: string;
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
