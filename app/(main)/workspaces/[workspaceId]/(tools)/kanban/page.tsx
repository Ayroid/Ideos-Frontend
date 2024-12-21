"use client";

import CreateBoardForm from "@/components/kanban/CreateBoardForm";
import Popup from "@/components/Popup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopup } from "@/store/popup";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { PiKanbanLight } from "react-icons/pi";
import { toast } from "sonner";

interface Board {
  _id: string;
  title: string;
  isDefault: boolean;
  description?: string;
  createdAt?: string;
}

const KanbanPage = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardsLoading, setBoardsLoading] = useState<boolean>(true);
  const { getAccessTokenRaw } = useKindeBrowserClient();
  const accessToken = getAccessTokenRaw();

  const [popUpVisible, openPopUp, closePopUp] = usePopup((state) => [
    state.isOpen,
    state.open,
    state.close,
  ]);

  // Fetch boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("/api/kanban/boards");
        const fetchedBoards = response.data;
        setBoards(fetchedBoards);
      } catch (error) {
        console.error("Error fetching boards:", error);
        toast.error("Error fetching boards");
      } finally {
        setBoardsLoading(false);
      }
    };

    if (accessToken) {
      fetchBoards();
    }
  }, [accessToken]);

  const setDefaultBoard = async (boardId: string) => {
    try {
      await axios.put(`/api/kanban/boards/${boardId}/default`);
      const updatedBoards = boards.map((board) => ({
        ...board,
        isDefault: board._id === boardId,
      }));
      setBoards(updatedBoards);
      toast.success("Default board updated");
    } catch (error) {
      console.error("Error setting default board:", error);
      toast.error("Error updating default board");
    }
  };

  const deleteBoard = async (boardId: string) => {
    try {
      await axios.delete(`/api/kanban/boards/${boardId}`);
      setBoards(boards.filter((board) => board._id !== boardId));
      toast.success("Board deleted successfully");
    } catch (error) {
      console.error("Error deleting board:", error);
      toast.error("Error deleting board");
    }
  };

  if (boardsLoading) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">My Boards</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="flex h-[65dvh] items-center justify-center">
        <div className="flex flex-col items-center">
          <PiKanbanLight className="h-36 w-36 text-primary" />
          <p className="text-2xl font-bold text-primary">Welcome to Kanban</p>
          <p className="mt-1 text-center text-lg text-primary">
            Create your first board to get started
          </p>
          <Button onClick={openPopUp} className="mt-4">
            <GoPlusCircle className="mr-2 h-4 w-4" /> Create Board
          </Button>
        </div>

        {popUpVisible && (
          <Popup isOpen={popUpVisible} onClose={closePopUp}>
            <CreateBoardForm onClose={closePopUp} />
          </Popup>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Boards</h1>
        {boards.length < 5 && (
          <Button onClick={openPopUp}>
            <GoPlusCircle className="mr-2 h-4 w-4" /> New Board
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {boards.map((board) => (
          <Card key={board._id} className="relative">
            <Link href={`/kanban/${board._id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{board.title}</CardTitle>
                    {board.description && (
                      <CardDescription>{board.description}</CardDescription>
                    )}
                  </div>
                  {board.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
              </CardHeader>
            </Link>
            <CardContent className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {new Date(board.createdAt || "").toLocaleDateString()}
              </span>
              {!board.isDefault && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!board.isDefault && (
                      <DropdownMenuItem
                        onClick={() => setDefaultBoard(board._id)}
                      >
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    {boards.length > 1 && !board.isDefault && (
                      <DropdownMenuItem
                        onClick={() => deleteBoard(board._id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {popUpVisible && (
        <Popup isOpen={popUpVisible} onClose={closePopUp}>
          <CreateBoardForm onClose={closePopUp} />
        </Popup>
      )}
    </div>
  );
};

export default KanbanPage;
