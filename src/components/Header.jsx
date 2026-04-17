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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface/85 shadow-[0_12px_30px_-24px_rgba(2,6,23,1)] backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              Q
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Quran</p>
              <p className="hidden text-xs text-muted sm:block">Calm Reader</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    active
                      ? "font-semibold text-primary"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="glass inline-flex h-10 w-10 items-center justify-center rounded-xl text-primary transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
              <ThemeIcon isDark={settings.theme === "dark"} />
            </button>
            <button
              type="button"
              onClick={openSettings}
              className="glass inline-flex h-10 items-center justify-center rounded-xl px-3 text-sm font-medium text-primary transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] sm:px-4"
            >
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Set</span>
            </button>
          </div>
        </div>

        <nav className="pb-3 md:hidden">
          <div className="glass grid grid-cols-2 gap-2 rounded-2xl p-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-center text-sm transition-colors ${
                    active
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      : "text-muted hover:bg-white/5 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
