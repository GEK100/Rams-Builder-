"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function NewBuilderPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically create a new RAMS as subcontractor
    const newId = uuidv4();
    router.replace(`/builder/${newId}?type=subcontractor`);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="h-8 w-8 rounded-lg gradient-primary mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Creating new RAMS...</p>
      </div>
    </div>
  );
}
