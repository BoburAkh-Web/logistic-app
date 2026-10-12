import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { CONTACT, NAV_LINKS } from "../lib/data";
import { lockScroll, scrollToTarget } from "../lib/scroll";
import { useTheme } from "../lib/theme";
import { ArrowUpRight, Moon, Sun } from "./ui/icons";
import { EASE_IN_OUT, EASE_OUT, Magnetic, MaskIcon, RollText } from "./ui/primitives";

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return active;
}

// Icons are switched by the `dark:` variant rather than React state, so the prerendered
// HTML is right for every visitor before hydration (the theme lives in localStorage).
export function ThemeToggle({ className = "size-10" }) {
  const { toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`relative grid place-items-center overflow-hidden rounded-full border border-line text-fg transition-colors hover:border-brand hover:text-brand ${className}`}
    >
      <span className="absolute transition-all duration-500 ease-out-expo dark:translate-y-[-150%] dark:rotate-90 dark:opacity-0">
        <Moon />
      </span>
      <span className="absolute translate-y-[150%] -rotate-90 opacity-0 transition-all duration-500 ease-out-expo dark:translate-y-0 dark:rotate-0 dark:opacity-100">
        <Sun />
      </span>
    </button>
  );
}

export function Logo({ className = "" }) {
  return (
    <MaskIcon
      src="/images/ez-logo.svg"
      className={`aspect-[503/302] h-8 text-fg ${className}`}
    />
  );
}

export default function Nav() {
  const active = useActiveSection();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const last = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setHidden(y > last.current && y > 400 && !open);
    setScrolled(y > 40);
    last.current = y;
  });

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    // Let the menu start closing before scrolling.
    setTimeout(() => scrollToTarget(href), open ? 350 : 0);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5"
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border py-1.5 pl-4 pr-1.5 transition-all duration-500 sm:py-2 sm:pl-5 sm:pr-2 ${
            scrolled || open
              ? "border-line bg-bg/85 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.18)] backdrop-blur-md"
              : "border-transparent bg-transparent"
          }`}
        >
          <a href="#top" onClick={(e) => go(e, "#top")} aria-label="EZ Trans Group — home">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="relative">
                {active === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-elev"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <a
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  className="group relative block rounded-full px-4 py-2 text-sm font-medium"
                >
                  <RollText>{link.label}</RollText>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle className="size-11 lg:size-10" />
            {/* Magnetic always renders inline-block, so the breakpoint lives on a wrapper. */}
            <div className="hidden sm:block">
              <Magnetic>
                <a
                  href="#contact"
                  onClick={(e) => go(e, "#contact")}
                  className="group flex items-center gap-2 rounded-full bg-brand py-2.5 pl-5 pr-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                >
                  <RollText>Get a quote</RollText>
                  <span className="grid size-6 place-items-center rounded-full bg-white text-brand transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </a>
              </Magnetic>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid size-11 place-items-center rounded-full bg-fg text-bg lg:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ${
                  open ? "rotate-45" : "-translate-y-[3px]"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ${
                  open ? "-rotate-45" : "translate-y-[3px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-bg px-6 pb-8 pt-24 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 42px) 38px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 42px) 38px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 42px) 38px)" }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          >
            <ul className="space-y-1">
              {NAV_LINKS.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    aria-current={active === link.href ? "true" : undefined}
                    className={`flex items-baseline gap-4 py-0.5 font-display text-[clamp(2.5rem,11.5vw,5rem)] font-semibold leading-[1.05] tracking-tight ${
                      active === link.href ? "text-brand" : ""
                    }`}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 + i * 0.06 }}
                  >
                    <span className="font-mono text-xs text-brand">0{i + 1}</span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="mt-10 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <a
                href="#contact"
                onClick={(e) => go(e, "#contact")}
                className="flex h-14 items-center justify-between rounded-full bg-brand pl-6 pr-2 font-medium text-white"
              >
                Get a quote
                <span className="grid size-10 place-items-center rounded-full bg-white text-brand">
                  <ArrowUpRight />
                </span>
              </a>
              <div className="flex flex-col gap-1 border-t border-line pt-5 text-sm text-muted">
                <a href={CONTACT.phoneHref} className="text-lg font-medium text-fg">
                  {CONTACT.phone}
                </a>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                  Dispatch open 24/7/365
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
