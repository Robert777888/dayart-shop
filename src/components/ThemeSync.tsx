"use client";

import { useEffect } from "react";

function getThemeByHour(hour: number) {
  return hour >= 7 && hour < 19 ? "light" : "dark";
}

export function ThemeSync() {
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const theme = getThemeByHour(new Date().getHours());
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
    };

    applyTheme();

    const intervalId = window.setInterval(applyTheme, 60_000);
    window.addEventListener("focus", applyTheme);
    document.addEventListener("visibilitychange", applyTheme);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", applyTheme);
      document.removeEventListener("visibilitychange", applyTheme);
    };
  }, []);

  return null;
}
