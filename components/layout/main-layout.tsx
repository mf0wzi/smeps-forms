import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { GetServerSideProps } from "next";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/lib/supabase/server";
import GuestLayout from "@/components/layout/guest-layout";
import AuthLayout from "@/components/layout/auth-layout";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NODE_ENV === 'production'
  ? 'https://your-production-url.com'
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SMEPS Forms",
  description: "SMEPS Forms Application Platform",
};

interface MainLayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  claims?: any;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, isLoggedIn = false, claims }) => {
  const Layout = isLoggedIn 
    ? <AuthLayout claims={claims}>{children}</AuthLayout> 
    : <GuestLayout>{children}</GuestLayout>;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {Layout}
    </ThemeProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const supabase = await createClient();

  try {
    const { data: claims, error } = await supabase.auth.getClaims();

    if (error) {
      console.error("Error fetching claims:", error);
      return { props: { isLoggedIn: false, claims: null } };
    }

    return { props: { isLoggedIn: !!claims, claims } };
  } catch (err) {
    console.error("Error fetching claims:", err);
    return { props: { isLoggedIn: false, claims: null } };
  }
};

export default MainLayout;