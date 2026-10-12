import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { scrollToTarget } from "../lib/scroll";
import { useTheme } from "../lib/theme";
import GlobeLite from "./GlobeLite";
import { ArrowRight, ArrowUpRight } from "./ui/icons";
import {
  DESKTOP_MOTION,
  EASE_OUT,
  LiveClock,
  Magnetic,
  RevealWords,
  RollText,
  useMediaFlag,
} from "./ui/primitives";

const Globe = lazy(() => import("./Globe"));

const WEBGL_QUERY = "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Only capable desktops get the WebGL globe (three.js, ~240 KB gzip), and only once the
 * page has loaded and the main thread is idle. Everyone else keeps the CSS/SVG globe.
 */
function useWebglGlobe() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const capable =
      window.matchMedia(WEBGL_QUERY).matches &&
      (navigator.hardwareConcurrency ?? 8) > 4 &&
      (navigator.deviceMemory ?? 8) > 4;
    if (!capable) return;

    let timer;
    let idle;
    const ric = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1));
    const start = () => {
      timer = setTimeout(() => {
        idle = ric(() => setEnabled(true), { timeout: 3000 });
      }, 600);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      clearTimeout(timer);
      (window.cancelIdleCallback ?? clearTimeout)(idle);
    };
  }, []);
  return enabled;
}

const STATS = [
  { k: "US · CA · MX", v: "Coverage" },
  { k: "24/7/365", v: "Live dispatch" },
  { k: "10+ yrs", v: "Client partnerships" },
];

/** CSS entrance (runs from the prerendered HTML, no JS needed). */
const enter = (delay) => ({ animationDelay: `${delay}s` });

export default function Hero() {
  const ref = useRef(null);
  const { theme } = useTheme();
  const webgl = useWebglGlobe();
  const [webglReady, setWebglReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  // Scroll-linked parallax only on desktop. On phones JS-driven transforms trail the
  // compositor-driven touch scroll by a frame, which reads as stutter.
  const parallax = useMediaFlag(DESKTOP_MOTION);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 md:pt-36"
    >
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_20%,transparent_75%)]" />
        {/* static gradients instead of animated blur filters — near-zero paint cost */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_10%,rgb(0_87_255/0.22),transparent_70%)] dark:bg-[radial-gradient(60%_55%_at_85%_10%,rgb(0_87_255/0.3),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_5%_100%,rgb(0_87_255/0.1),transparent_70%)]" />
      </div>

      <motion.div
        style={parallax ? { y: globeY } : undefined}
        className="pointer-events-none absolute left-1/2 top-[58%] aspect-square lg:will-change-transform w-[150vw] -translate-x-1/2 opacity-50 sm:top-[52%] sm:w-[115vw] sm:opacity-60 md:opacity-80 lg:left-auto lg:right-[-14vw] lg:top-[-2vh] lg:w-[min(68vw,1100px)] lg:translate-x-0 lg:opacity-100"
      >
        {/* Fade lives on a wrapper: the entrance animation's fill would pin opacity. */}
        <div className={`size-full transition-opacity duration-1000 ${webglReady ? "opacity-0" : ""}`}>
          <GlobeLite className="size-full" />
        </div>
        {webgl && (
          <Suspense fallback={null}>
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={webglReady ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 1.4, ease: EASE_OUT }}
            >
              <Globe
                dark={theme === "dark"}
                className="size-full"
                onReady={() => setWebglReady(true)}
              />
            </motion.div>
          </Suspense>
        )}
      </motion.div>

      <motion.div
        style={parallax ? { y: contentY, opacity: contentOpacity } : undefined}
        className="container-x relative z-10 flex flex-1 flex-col lg:will-change-transform"
      >
        <div className="enter-up mb-8 md:mb-10" style={enter(0.03)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg/85 py-1.5 pl-2 pr-3 text-[11px] sm:gap-3 sm:pr-4 sm:text-xs">
            <span className="relative grid size-5 place-items-center">
              <span className="animate-ping-slow absolute size-2 rounded-full bg-emerald-500" />
              <span className="size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium">Dispatch online</span>
            <span className="h-3 w-px bg-line" />
            <span className="font-mono text-muted">
              Wheeling, IL · <LiveClock />
            </span>
          </span>
        </div>

        <h1 className="font-display text-[clamp(2.5rem,11.2vw,4.75rem)] font-semibold leading-[0.88] tracking-[-0.045em] md:max-w-[14ch] md:text-[clamp(3.1rem,9.6vw,10.5rem)]">
          <RevealWords instant text="A thousand miles" delay={0.03} stagger={0.04} duration={0.7} className="block" />
          <RevealWords instant text="of our success" delay={0.1} stagger={0.04} duration={0.7} className="block" />
          <span className="block">
            <RevealWords instant text="is" delay={0.17} duration={0.7} />{" "}
            <span className="relative inline-block">
              <RevealWords
                instant
                text="your success."
                delay={0.2}
                stagger={0.04}
                duration={0.7}
                wordClassName="text-brand"
              />
              <svg
                viewBox="0 0 600 40"
                preserveAspectRatio="none"
                aria-hidden
                className="absolute -bottom-[0.1em] left-0 h-[0.16em] w-full text-brand"
              >
                <path
                  d="M4 28C120 10 260 6 400 14s170 14 192 10"
                  pathLength="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  className="draw-in"
                  style={enter(0.5)}
                />
              </svg>
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-7 md:mt-14 md:flex-row md:items-end md:justify-between md:gap-8">
          <p
            className="enter-up max-w-md text-base leading-relaxed text-muted md:text-lg"
            style={enter(0.2)}
          >
            Your top-notch expedited service provider — with the right equipment, at
            the right place, at the right time. <span className="text-fg">Always.</span>
          </p>

          <div
            className="enter-up flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            style={enter(0.28)}
          >
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#contact"
                data-cursor="Quote"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact");
                }}
                className="group flex w-full items-center justify-between gap-3 rounded-full bg-brand py-3 pl-7 pr-3 text-base font-medium text-white sm:w-auto sm:justify-start shadow-[0_20px_50px_-15px_rgb(0_87_255/0.7)] transition-colors hover:bg-brand-600"
              >
                <RollText>Get a quote</RollText>
                <span className="grid size-9 place-items-center rounded-full bg-white text-brand transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight />
                </span>
              </a>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#solutions"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#solutions");
                }}
                className="group flex w-full items-center justify-center gap-3 rounded-full border border-line bg-bg/85 px-6 py-3.5 text-base font-medium transition-colors hover:border-fg sm:w-auto"
              >
                <RollText>Explore solutions</RollText>
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </Magnetic>
          </div>
        </div>

        <div
          // Phones: a card, so the globe behind it doesn't cut through the numbers.
          className="enter-up mb-5 mt-auto flex items-end justify-between gap-6 rounded-2xl border border-line bg-bg/85 p-4 md:mb-0 md:rounded-none md:border-x-0 md:border-b-0 md:bg-transparent md:px-0 md:pb-8 md:pt-6"
          style={enter(0.35)}
        >
          <dl className="grid w-full grid-cols-3 gap-3 sm:gap-6 md:w-auto md:gap-14">
            {STATS.map((s) => (
              <div key={s.v}>
                <dt className="sr-only">{s.v}</dt>
                <dd className="whitespace-nowrap font-display text-[15px] font-semibold tracking-tight sm:text-lg md:text-2xl">
                  {s.k}
                </dd>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted md:text-[11px]">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:flex">
            Scroll
            <span className="relative h-10 w-px overflow-hidden bg-line">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-brand" />
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
