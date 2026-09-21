"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  Clapperboard,
  LayoutDashboard,
  Film,
  PlusCircle,
  LogOut,
  ChevronDown,
  User,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/library", label: "Library", icon: Film },
    { href: "/add", label: "Add Title", icon: PlusCircle },
  ];

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "W";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#101214]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-14">
        {/* Brand Logo */}
        <Link
          href={session ? "/dashboard" : "/"}
          className="group flex items-center gap-3 text-sm font-bold tracking-[0.2em] text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d9f06a] text-[#101214] shadow-md shadow-[#d9f06a]/20 transition-transform group-hover:scale-105">
            <Clapperboard size={18} />
          </span>
          <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            WATCHVERSE
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#d9f06a] text-[#101214] shadow-sm shadow-[#d9f06a]/30"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User Account / Auth Actions */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-3 transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#d9f06a] to-[#71c356] text-xs font-bold text-[#101214]">
                  {userInitial}
                </div>
                <span className="hidden max-w-[120px] truncate text-xs font-medium text-white/90 md:block">
                  {session.user.name || "My Account"}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-white/50 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-white/10 bg-[#16191d] p-1.5 shadow-2xl backdrop-blur-xl">
                  <div className="border-b border-white/10 px-3 py-2.5">
                    <p className="truncate text-xs font-semibold text-white">
                      {session.user.name || "Explorer"}
                    </p>
                    <p className="truncate text-[11px] text-white/40">
                      {session.user.email}
                    </p>
                  </div>

                  <div className="my-1 sm:hidden">
                    {navLinks.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white"
                      >
                        <Icon size={14} />
                        {label}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-white/10" />
                  </div>

                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-xs font-medium text-white/70 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 rounded-full bg-[#d9f06a] px-4 py-2 text-xs font-semibold text-[#101214] shadow-sm hover:bg-[#cbe25a]"
              >
                <Sparkles size={13} />
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
