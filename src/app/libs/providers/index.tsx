"use client";

import { ReactNode } from "react";
import MswProvider from "./msw-provider";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MswProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </MswProvider>
  );
}
