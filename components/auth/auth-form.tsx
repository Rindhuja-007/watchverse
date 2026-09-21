"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [demoPending, setDemoPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string).trim().toLowerCase();
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (mode === "signup") {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Failed to create account.");
          setPending(false);
          return;
        }
      } catch {
        setError("Network error while creating account.");
        setPending(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Incorrect email or password. Please try again.");
      setPending(false);
    } else {
      router.refresh();
      router.push("/dashboard");
    }
  }

  async function handleDemoLogin() {
    setDemoPending(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: "demo@watchverse.com",
        password: "password123",
        redirect: false,
      });

      if (result?.error) {
        setError("Demo account is not seeded yet. Running setup...");
      } else {
        router.refresh();
        router.push("/dashboard");
      }
    } catch {
      setError("Failed to sign in with demo account.");
    } finally {
      setDemoPending(false);
    }
  }

  return (
    <div className="space-y-4">
      {mode === "login" && (
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={pending || demoPending}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#d9f06a]/40 bg-[#d9f06a]/10 px-4 py-3.5 text-sm font-semibold text-[#d9f06a] transition-all hover:bg-[#d9f06a]/20 hover:border-[#d9f06a] disabled:opacity-50"
        >
          {demoPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Entering with Demo Account...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Quick Demo Access (1-Click Sign In)</span>
              <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      )}

      {mode === "login" && (
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-white/10" />
          <span className="absolute bg-[#101214] px-3 text-xs uppercase tracking-wider text-white/40">
            or sign in with email
          </span>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
              Your Name
            </label>
            <input
              required
              name="name"
              type="text"
              minLength={2}
              placeholder="e.g. Alex Rivera"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d9f06a] focus:bg-white/[0.08]"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
            Email Address
          </label>
          <input
            required
            name="email"
            type="email"
            placeholder="alex@example.com"
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d9f06a] focus:bg-white/[0.08]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
            Password
          </label>
          <input
            required
            name="password"
            type="password"
            minLength={8}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d9f06a] focus:bg-white/[0.08]"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={pending || demoPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d9f06a] px-4 py-3.5 text-sm font-semibold text-[#101214] shadow-lg shadow-[#d9f06a]/20 transition-all hover:bg-[#cbe25a] hover:shadow-[#d9f06a]/30 active:scale-[0.99] disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Opening your universe...</span>
            </>
          ) : mode === "login" ? (
            "Enter WatchVerse"
          ) : (
            "Create My Universe"
          )}
        </button>
      </form>
    </div>
  );
}