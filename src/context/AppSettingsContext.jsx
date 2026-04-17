"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "quran:settings";

const defaultSettings = {
  theme: "dark",
  arabicFont: "amiri",
  arabicSize: 40,
  translationSize: 18,
};

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      let nextSettings = defaultSettings;
      const cached = window.localStorage.getItem(STORAGE_KEY);

      if (cached) {
        try {
          nextSettings = { ...defaultSettings, ...JSON.parse(cached) };
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      setSettings(nextSettings);
      setIsHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    document.documentElement.classList.toggle("light", settings.theme === "light");
  }, [settings.theme]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, isHydrated]);

  const value = useMemo(
    () => ({
      settings,
      setTheme: (theme) => setSettings((prev) => ({ ...prev, theme })),
      toggleTheme: () =>
        setSettings((prev) => ({
          ...prev,
          theme: prev.theme === "dark" ? "light" : "dark",
        })),
      setArabicFont: (arabicFont) => setSettings((prev) => ({ ...prev, arabicFont })),
      setArabicSize: (arabicSize) => setSettings((prev) => ({ ...prev, arabicSize })),
      setTranslationSize: (translationSize) =>
        setSettings((prev) => ({ ...prev, translationSize })),
      isSettingsOpen,
      openSettings: () => setIsSettingsOpen(true),
      closeSettings: () => setIsSettingsOpen(false),
    }),
    [settings, isSettingsOpen],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider.");
  }
  return context;
}
