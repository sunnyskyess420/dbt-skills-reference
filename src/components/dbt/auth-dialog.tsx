"use client";

// AuthDialog — sign-in / sign-up / continue-as-guest modal.
//
// Uses NextAuth's `signIn` client with the credentials provider. The
// dialog is fully controlled by the parent (open/onClose props) so it
// can be triggered from anywhere — sidebar footer, first-visit welcome
// prompt, or anywhere else.
//
// On a successful sign-in we close the dialog. The useSync hook (mounted
// at the page level) handles pulling data from the server.

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogIn, UserPlus, UserRound } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Called when the user picks "Continue as Guest". Closes the dialog
  // and (optionally) dismisses any first-visit prompt.
  onGuest?: () => void;
}

export function AuthDialog({ open, onOpenChange, onGuest }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome to DBT Skills</DialogTitle>
          <DialogDescription>
            Sign in to sync your worksheets, bookmarks, and progress across
            all your devices. Or continue as a guest — your data stays on
            this device only.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" className="gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              Create Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-4">
            <SignInForm onSuccess={() => { onOpenChange(false); window.location.reload(); }} />
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <SignUpForm onSuccess={() => { onOpenChange(false); window.location.reload(); }} />
          </TabsContent>
        </Tabs>

        <div className="mt-2 pt-3 border-t">
          <Button
            variant="ghost"
            className="w-full gap-2 text-muted-foreground"
            onClick={() => {
              onGuest?.();
              onOpenChange(false);
            }}
          >
            <UserRound className="h-4 w-4" />
            Continue as guest
          </Button>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            Your data stays on this device. You can sign in later from the
            sidebar to enable sync.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      mode: "signin",
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      setError(
        res?.error || "Sign-in failed. Check your email and password."
      );
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="signin-email" className="text-xs">
          Email
        </Label>
        <Input
          id="signin-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signin-password" className="text-xs">
          Password
        </Label>
        <Input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      {error && (
        <p className="text-xs text-destructive bg-destructive/10 px-2 py-1.5 rounded">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}

function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      name: name || undefined,
      mode: "signup",
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      setError(res?.error || "Could not create account. Try again.");
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="signup-name" className="text-xs">
          Name <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="signup-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-email" className="text-xs">
          Email
        </Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-password" className="text-xs">
          Password <span className="text-muted-foreground">(min 6 chars)</span>
        </Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-confirm" className="text-xs">
          Confirm password
        </Label>
        <Input
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      {error && (
        <p className="text-xs text-destructive bg-destructive/10 px-2 py-1.5 rounded">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </form>
  );
}
