import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "./scroll";

const ThemeContext = createContext({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light"
  );

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#07080C" : "#F8F7F4");
  }, [theme]);

  const toggle = useCallback(
    (event) => {
      const next = theme === "dark" ? "light" : "dark";
      const apply = () => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {
          /* storage unavailable — theme still applies for this visit */
        }
        flushSync(() => setTheme(next));
      };

      if (!document.startViewTransition || prefersReducedMotion()) {
        apply();
        return;
      }

      // Expand the new theme as a circle from the toggle button.
      const x = event?.clientX ?? window.innerWidth - 40;
      const y = event?.clientY ?? 40;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      const transition = document.startViewTransition(apply);
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 750,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
