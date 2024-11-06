"use client";

import NoteTakingApp from "@/components/notetaking/editor/page";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface WorkspaceProps {
  params: { workspaceId: string };
}

const Workspace = ({ params }: WorkspaceProps) => {
  const { workspaceId } = params;
  const router = useRouter();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await fetch(
          `/api/notetaking?workspaceId=${workspaceId}`
        );
        if (!response.ok) {
          setError(true);
        } else {
          const data = await response.json();
          setWorkspace(data);
        }
      } catch (err) {
        console.error("Error fetching workspace:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    

    fetchWorkspace();
  }, [workspaceId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-primary">Workspace not found</h2>
        <p className="mt-4 text-gray-600">
          The workspace with ID "{workspaceId}" does not exist.
        </p>
        <button
          onClick={() => router.push("/tools/notes")}
          className="hover:bg-background-secondary mt-6 rounded-md bg-foreground px-4 py-2 text-background"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <NoteTakingApp />
    </div>
  );
};

export default Workspace;
