"use client";
import { Editor } from "novel";
import type { Editor as TipTapEditor } from '@tiptap/core';
import { useState } from "react";

export default function EditorPage() {

  const [content, setContent] = useState<string>();

  return (
  
       <Editor
       className="relative w-full bg-background text"
          disableLocalStorage={true}
          defaultValue={{
            "type": "doc",
            "content": []
          }}
          onDebouncedUpdate={(editor?: TipTapEditor) => {
            const htmlContent = editor?.getHTML();
            setContent(htmlContent);
            console.log(htmlContent);
             // Log HTML content on each update
          }}
        />
  
  );
}
