// app/components/layout/MainLayout.tsx
import React, { ReactNode } from "react";
import  Navbar from "@/components/section/navbar";
import { Hero } from "@/components/features/hero";
import Footer from "@/components/section/footer";
import { hasEnvVars } from "@/lib/utils";  // Import the hasEnvVars boolean

interface GuestLayoutProps {
  children: ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  const envVarsExist = hasEnvVars();  // Call the function to get the boolean value

  return (
    <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <Navbar />
            <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
                <main className="flex-1 flex flex-col gap-6 px-4">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    </main>
  );
};

export default GuestLayout;
