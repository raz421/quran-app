"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ThemeIcon({ isDark }) {
  if (isDark) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 3v2m0 14v2m6.36-15.36-1.41 1.41M7.05 16.95l-1.41 1.41M21 12h-2M5 12H3m15.36 6.36-1.41-1.41M7.05 7.05 5.64 5.64" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { settings, toggleTheme, openSettings } = useAppSettings();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/surahs", label: "Surahs" },
  ];

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-white/10 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-3 text-foreground transition-opacity hover:opacity-90"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-primary to-primary/85 text-sm font-bold text-white shadow-[0_10px_24px_-16px_rgba(99,102,241,0.9)] transition duration-300 group-hover:scale-[1.02]">
                Q
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight tracking-[0.02em]">
                  Quran Reader
                </p>
                <p className="hidden text-xs text-muted sm:block">
                  Focused recitation experience
                </p>
              </div>
            </Link>

            <nav className="hidden md:block">
              <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-elevated/75 p-1 shadow-[0_14px_30px_-24px_rgba(2,6,23,1)]">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-xl px-4 py-2 text-sm transition-all duration-300 ${
                        active
                          ? "bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.16)]"
                          : "text-muted hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-elevated/70 text-muted transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
              >
                <ThemeIcon isDark={settings.theme === "dark"} />
              </button>
              <button
                type="button"
                onClick={openSettings}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-elevated/70 px-3 text-sm font-medium text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary sm:px-4"
              >
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Set</span>
              </button>
            </div>
          </div>

          <nav className="pb-3 md:hidden">
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-elevated/75 p-2 shadow-[0_14px_30px_-24px_rgba(2,6,23,1)]">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-xl px-3 py-2 text-center text-sm transition-all duration-300 ${
                      active
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.16)]"
                        : "text-muted hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
