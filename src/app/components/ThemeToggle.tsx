"use client";

import { useTheme } from "next-themes";
import React from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2"
    >
      toggle: {theme}
    </button>
  );
};
