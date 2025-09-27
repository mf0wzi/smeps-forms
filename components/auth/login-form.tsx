// app/(auth)/login/LoginForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { signInWithPassword, signInWithMagicLink } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isLoading = isPending;

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    startTransition(async () => {
      try {
        const res = await signInWithPassword(email, password);
        // supabase v2 shape: res.error || res.data
        if ((res as any)?.error) {
          setError((res as any).error.message ?? "Login failed");
          return;
        }

        // success — redirect to protected area
        router.replace("/app"); // replace so back doesn't go back to login
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    });
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    startTransition(async () => {
      try {
        const res = await signInWithMagicLink(email);
        if ((res as any)?.error) {
          setError((res as any).error.message ?? "Failed to send magic link");
          return;
        }
        setInfo("Magic link sent — check your inbox.");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex gap-2 mb-4" role="tablist" aria-label="Login method">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "password"}
              onClick={() => setTab("password")}
              className={cn(
                "px-3 py-1 rounded",
                tab === "password" ? "bg-slate-100 dark:bg-slate-700" : "hover:bg-slate-50"
              )}
            >
              Password
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={tab === "magic"}
              onClick={() => setTab("magic")}
              className={cn(
                "px-3 py-1 rounded",
                tab === "magic" ? "bg-slate-100 dark:bg-slate-700" : "hover:bg-slate-50"
              )}
            >
              Magic link
            </button>
          </div>

          {tab === "password" ? (
            <form onSubmit={handlePasswordLogin} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {info && <p className="text-sm text-slate-600">{info}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email_magic">Email</Label>
                <Input
                  id="email_magic"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {info && <p className="text-sm text-slate-600">{info}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send magic link"}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
