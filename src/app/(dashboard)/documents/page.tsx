"use client";

import { FolderOpen } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl bg-primary/20 mx-auto mb-6 flex items-center justify-center">
          <FolderOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Documents</h1>
        <p className="text-muted-foreground mb-6">
          Your saved RAMS documents will appear here. Create and generate a RAMS to see it in your documents list.
        </p>
        <p className="text-sm text-muted-foreground/70">
          Coming Soon
        </p>
      </div>
    </div>
  );
}
