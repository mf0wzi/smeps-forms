// app/components/features/Navbar.tsx
import React from "react";
import Link from "next/link";
import { AuthButton } from "@/components/features/auth-button";


const Navbar = () => {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        {/* Left section */}
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/">Next.js Supabase Starter</Link>
        </div>

        {/* Right section */}
        <AuthButton />
        {/* {!hasEnvVars ? <EnvVarWarning /> : } */}
      </div>
    </nav>
  );
};

export default Navbar;
