"use client";

import NoteTakingApp from "@/components/notetaking/editor/page";
import { useRouter } from "next/navigation";

const NoteTaking = () => {
  return (
    <div className="relative">
      <NoteTakingApp />
    </div>
  );
};

export default NoteTaking;