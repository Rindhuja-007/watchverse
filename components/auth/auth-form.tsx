"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (mode === "signup") {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { setError((await response.json()).error); setPending(false); return; }
    }
    const result = await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    if (result?.error) setError("That email or password is not correct.");
    else router.push("/dashboard");
    setPending(false);
  }

  return <form onSubmit={submit} className="space-y-4">
    {mode === "signup" && <label className="block text-sm text-white/70">Name<input required name="name" minLength={2} className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#d9f06a]" /></label>}
    <label className="block text-sm text-white/70">Email<input required name="email" type="email" className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#d9f06a]" /></label>
    <label className="block text-sm text-white/70">Password<input required name="password" type="password" minLength={8} className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#d9f06a]" /></label>
    {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    <button disabled={pending} className="w-full rounded-xl bg-[#d9f06a] px-4 py-3 font-semibold text-[#101214] disabled:opacity-50">{pending ? "Opening your universe..." : mode === "login" ? "Enter WatchVerse" : "Create my universe"}</button>
  </form>;
}