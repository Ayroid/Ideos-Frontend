import { ColumnColor } from "@/types/kanban";

export const getRandomColor = () => {
  return ColumnColor[Math.floor(Math.random() * ColumnColor.length)];
};
