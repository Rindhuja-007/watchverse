"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  Film,
  Compass,
  FileCode,
  LogOut,
  Sparkles,
  Search,
  Bell,
} from "lucide-react";
import { ImportExportModal } from "@/components/library/import-export-modal";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  onOpenImportModal?: () => void;
}

export function Navbar({ onSearchChange, searchQuery, onOpenImportModal }: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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

  async function handleLogout() {
    try {
      await signOut({ redirect: false });
    } catch (e) {
      console.error("SignOut error:", e);
    }
    window.location.href = "/";
  }

  function handleImportClick(e: React.MouseEvent) {
    e.preventDefault();
    if (onOpenImportModal) {
      onOpenImportModal();
    } else {
      setIsImportModalOpen(true);
    }
  }

  const isLibrary = pathname === "/library" || pathname === "/dashboard";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0c0d0f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Left section: REEL Logo + Primary Nav */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link
              href={session ? "/library" : "/"}
              className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            >
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#ef4444]">
                REEL
              </span>
            </Link>

            {session && (
              <nav className="flex items-center gap-1 sm:gap-2">
                <Link
                  href="/library"
                  className={`relative px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
                    isLibrary
                      ? "text-white after:absolute after:bottom-[-12px] after:left-0 after:right-0 after:h-[2px] after:bg-[#ef4444]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Library
                </Link>

                <Link
                  href="/add"
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
                    pathname === "/add" ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  Discover
                </Link>

                <Link
                  href="/library"
                  className="hidden sm:inline-block px-3 py-1.5 text-xs sm:text-sm font-semibold text-white/60 hover:text-white transition"
                >
                  Stats
                </Link>

                <button
                  type="button"
                  onClick={handleImportClick}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-white/60 hover:text-[#ef4444] transition flex items-center gap-1"
                >
                  Import
                </button>
              </nav>
            )}
          </div>

          {/* Center search input (if authenticated or on search page) */}
          {session && (
            <div className="hidden sm:flex flex-1 max-w-md mx-4 items-center">
              <div className="relative w-full">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={searchQuery ?? ""}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Filter your library by title or tags..."
                  className="w-full rounded-full border border-white/10 bg-[#17181c] py-2 pl-9 pr-4 text-xs text-white placeholder-white/40 focus:border-[#ef4444]/60 focus:bg-[#1a1c22] focus:outline-none transition shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Right section: Notifications + User Avatar */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <button
                  type="button"
                  title="Notifications"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition"
                >
                  <Bell size={15} />
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-full p-0.5 transition ring-2 ring-[#ef4444]/30 hover:ring-[#ef4444]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-rose-600 to-red-600 text-xs font-black text-white shadow-md">
                      {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "R"}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-white/10 bg-[#16171b] p-2 shadow-2xl backdrop-blur-xl z-50">
                      <div className="border-b border-white/10 px-3 py-2.5">
                        <p className="truncate text-xs font-bold text-white">
                          {session.user?.name || "Collector"}
                        </p>
                        <p className="truncate text-[11px] text-white/40">
                          {session.user?.email}
                        </p>
                      </div>

                      <div className="my-1.5 space-y-0.5">
                        <Link
                          href="/library"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white"
                        >
                          <Film size={14} />
                          Wall of Watching
                        </Link>
                        <Link
                          href="/add"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white"
                        >
                          <Compass size={14} />
                          Discover Titles
                        </Link>
                        <button
                          onClick={(e) => {
                            setDropdownOpen(false);
                            handleImportClick(e);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white"
                        >
                          <FileCode size={14} />
                          Import / Export XML
                        </button>
                      </div>

                      <div className="border-t border-white/10 pt-1.5">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 cursor-pointer transition"
                        >
                          <LogOut size={14} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-xs font-medium text-white/70 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 rounded-full bg-[#ef4444] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#ef4444]/25 hover:bg-[#dc2626] transition"
                >
                  <Sparkles size={13} />
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Standalone Import/Export Modal if triggered from Navbar */}
      <ImportExportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          setIsImportModalOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}
