// app/components/features/Navbar.tsx
import React from "react";
import { ThemeSwitcher } from "@/components/features/theme-switcher";

const Footer: React.FC = () => {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <div className="container mx-auto text-center">
       <ThemeSwitcher /> © {new Date().getFullYear()} SMEPS Forms — built with ❤️ 
      </div>
    </footer>
  );
};

export default Footer;

