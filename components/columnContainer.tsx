import { ColumnTypes, Id } from "@/app/pages/types";
import React from "react";
import { TrashIcon } from "@radix-ui/react-icons";

interface Props {
  column: ColumnTypes;
  deleteColumn: (id: Id) => void;
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn} = props;
  return (
    <div
      className="bg-slate-800 text-primary-foreground shadow hover:bg-primary/90 
  w-[350px]
  h-[500px]
  max-h-[500px]
  rounded-md
  flex
  flex-col"
    >
        
        <div className="bg-slate-900
            text-md
            h-[60px]
            cursor-grab
            rounded-md
            rounded-b-none
            p-3
            font-bold
            border-slate-800 
            border-4
            flex
            items-center
            justify-between
        ">
            <div className="flex gap-2">
            <div className="
            flex
            justify-center
            items-center bg-slate-800 px-2 p-1 text-sm rounded-full
            ">0</div>
             {column.title}</div>
             <button 
             onClick={() => deleteColumn(column.id)}
             className="hover-stroke-black hover:bg-slate-900 rounded px-1 py-2"><TrashIcon></TrashIcon></button></div>
             
     
      <div className="flex flex-grow">Content</div>
      
      <div>Footer</div>
    </div>
  );


}

export default ColumnContainer;
