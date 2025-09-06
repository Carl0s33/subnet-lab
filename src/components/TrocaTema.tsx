"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function TrocaTema() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = theme === "system" ? systemTheme : theme;

  const toggle = () => {
    const next = current === "dark" ? "light" : "dark";
    setTheme(next || "dark");
  };

  if (!mounted) {
    return (
      <Button variant="secondary" size="icon" className="relative shadow-sm dark:shadow-none" aria-label="Alternar tema">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="relative shadow-sm dark:shadow-none"
      onClick={toggle}
      aria-label={current === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      <Sun className={`h-5 w-5 transition-all ${current === "dark" ? "opacity-0 -rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`} />
      <Moon className={`absolute h-5 w-5 transition-all ${current === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"}`} />
      <span className="sr-only">{current === "dark" ? "Tema escuro ativo" : "Tema claro ativo"}</span>
    </Button>
  );
}

export default TrocaTema;
