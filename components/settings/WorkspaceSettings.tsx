import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

export const WorkspaceSkeleton = () => {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex w-full items-end gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

const WorkspaceSettings = () => {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Workspace</h2>
      </div>
      <div className="flex w-full items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="teamName" className="text-sm">
            Workspace Name
          </Label>
          <Input id="teamName" placeholder="Enter workspace name" />
        </div>
        <Button>Save</Button>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
