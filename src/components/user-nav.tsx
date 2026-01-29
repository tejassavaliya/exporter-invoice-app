"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function UserNav() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        {session.user?.name || session.user?.email}
      </span>
      {session.user.role === "ADMIN" && (
         <Button variant="ghost" asChild>
           <a href="/admin/users">Manage Users</a>
         </Button>
      )}
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        Log out
      </Button>
    </div>
  );
}
