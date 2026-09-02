import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#101214] px-6 text-[#f5f1e8]"><section className="w-full max-w-md"><Link href="/" className="text-sm font-semibold tracking-[0.2em] text-[#d9f06a]">WATCHVERSE</Link><h1 className="mt-10 text-4xl font-semibold tracking-tight">Start your universe.</h1><p className="mt-3 mb-8 text-white/55">Keep every story worth remembering.</p><AuthForm mode="signup" /><p className="mt-6 text-center text-sm text-white/50">Already have an account? <Link className="text-[#d9f06a]" href="/login">Sign in</Link></p></section></main>;
}