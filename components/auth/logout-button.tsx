"use client";

import { logout } from "@/app/actions/logout";
import { Button } from "@/components/ui/button";

export function LogoutForm() {
  return (
    <form action={logout}>
      <Button type="submit">Logout</Button>
    </form>
  );
}
