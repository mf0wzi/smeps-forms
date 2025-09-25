// app/components/layout/auth-layout.tsx
import React, { ReactNode } from "react";

export interface AuthLayoutProps {
  children: ReactNode;
  claims?: any; // Add this line to accept claims
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, claims }) => {
  // Example: Conditional rendering based on claims
  return (
    <div>
      <h1>Authenticated Layout</h1>
      {claims?.role && <p>Your role: {claims.role}</p>}
      {children}
    </div>
  );
};

export default AuthLayout;
