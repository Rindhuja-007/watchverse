import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#101214] px-6 text-[#f5f1e8]"><section className="w-full max-w-md"><Link href="/" className="text-sm font-semibold tracking-[0.2em] text-[#d9f06a]">WATCHVERSE</Link><h1 className="mt-10 text-4xl font-semibold tracking-tight">Welcome back.</h1><p className="mt-3 mb-8 text-white/55">Your watch universe is waiting.</p><AuthForm mode="login" /><p className="mt-6 text-center text-sm text-white/50">New here? <Link className="text-[#d9f06a]" href="/signup">Create an account</Link></p></section></main>;
}