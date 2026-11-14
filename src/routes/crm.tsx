import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/crm")({
  component: CrmRedirectPage,
});

function CrmRedirectPage() {
  useEffect(() => {
    window.location.href = "/crm/";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink text-white">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mx-auto mb-4" />
        <p className="text-sm text-white/70">Connecting to AvomaxCRM...</p>
      </div>
    </div>
  );
}

