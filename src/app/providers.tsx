/* eslint-disable */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* @ts-ignore */
"use client";
import { Dispatch, ReactNode, SetStateAction, createContext } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import useLocalStorage from "../components/lib/hooks/use-local-storage";

export const AppContext = createContext<{
  font: string;
  setFont: (value: string) => void;
}>({
  font: "Default",
  setFont: () => {},
});

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };
  return <Toaster theme={theme} />;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");
  const { theme: currentTheme, setTheme } = useTheme();

  return (
    <ThemeProvider
      attribute="class"
      value={{
        light: "light-theme",
        dark: "dark-theme",
      }}
      >
      <AppContext.Provider
        value={{
          font,
          setFont,// eslint-disable-line
        }}
      >
        <ToasterProvider />
        {children}
        <Analytics />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
/* eslint-enable */