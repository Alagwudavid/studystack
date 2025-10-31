"use client";

import { Loader2 } from "lucide-react";

interface PostLoginLoadingProps {
  message?: string;
}

export function PostLoginLoading({
  message = "Loading your dashboard...",
}: PostLoginLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Bitroot</h1>
          <p className="text-muted-foreground">Where learning takes root</p>
        </div>
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
