import { uniqueIdProps } from "@/types/kanban";
import { v4 as uuidv4 } from "uuid";

export const generateUniqueId = ({ obj }: uniqueIdProps) => {
  return obj + "-" + String(uuidv4() + String(Date.now()));
};
