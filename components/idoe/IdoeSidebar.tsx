import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function IdoeSidebar() {
  return (
    <Sheet>
      {/* Sidebar Trigger Button */}
      <SheetTrigger asChild>
        <Button variant="outline">Menu</Button>
      </SheetTrigger>

      {/* Sidebar Content */}
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Access different features and settings here.
          </SheetDescription>
        </SheetHeader>

        {/* Sidebar Menu Items */}
        <div className="flex flex-col gap-4 py-4">
          <Button variant="ghost" className="justify-start">
            New Chat
          </Button>
          <Button variant="ghost" className="justify-start">
            Chat History
          </Button>
          <Button variant="ghost" className="justify-start">
            Settings
          </Button>
          <Button variant="ghost" className="justify-start">
            Report a Bug
          </Button>
          <Button variant="ghost" className="justify-start">
            Help
          </Button>
        </div>

        {/* Footer (optional) */}
        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button variant="outline">Close Sidebar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default IdoeSidebar;
