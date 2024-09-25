export const dynamic = "force-dynamic";

import QuillEditor from "@/components/notetaking/quill-editor/quill-editor";
import React from "react";

const Workspace = ({ params }: { params: { workspaceId: string } }) => {
  return (
    <div className="relative">
      <QuillEditor />
    </div>
  );
};

export default Workspace;
