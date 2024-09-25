export const dynamic = 'force-dynamic';

import QuillEditor from '@/components/notetaking/quill-editor/quill-editor';
import React from 'react';

const Workspace = ({ params }: { params: { workspaceId: string } }) => {
  // You can replace these with actual folderId and fileId as needed
  const folderId = 'static-folder-id';  // Placeholder value for folderId
  const fileId = 'static-file-id';      // Placeholder value for fileId

  return (
    <div className="relative">
      <QuillEditor
        workspaceId={params.workspaceId}
        folderId={folderId}
        fileId={fileId}
      />
    </div>
  );
};

export default Workspace;
