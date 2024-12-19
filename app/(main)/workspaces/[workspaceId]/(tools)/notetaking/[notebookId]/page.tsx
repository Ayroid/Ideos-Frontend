"use client";

import NoteTakingApp from "@/components/notetaking/editor/page";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NotebookProps {
  params: { notebookId: string };
}

const Notebook = ({ params }: NotebookProps) => {
  const router = useRouter();
  const { notebookId } = params;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const response = await fetch(`/api/notetaking/notebooks/${notebookId}`);
        if (!response.ok) {
          router.push("/notetaking");
          return;
        }
        const data = await response.json();
      } catch (err) {
        console.error("Error fetching notebook:", err);
        router.push("/notetaking");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotebook();
  }, [notebookId, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <NoteTakingApp notebookId={notebookId} />
    </div>
  );
};

export default Notebook;
