export const dynamic = "force-dynamic";

import NoteTakingApp from "@/components/notetaking/editor/page";
import React from "react";

const Workspace = ({ params }: { params: { workspaceId: string } }) => {
  return (
    <div className="relative">
    <NoteTakingApp />
    </div>
  );
};

export default Workspace;
