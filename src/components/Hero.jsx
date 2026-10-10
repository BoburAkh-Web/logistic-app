import { lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { scrollToTarget } from "../lib/scroll";
import { useTheme } from "../lib/theme";
import { ArrowRight, ArrowUpRight } from "./ui/icons";
import {
  EASE_OUT,
  Magnetic,
  RevealWords,
  RollText,
  useChicagoTime,
} from "./ui/primitives";

const Globe = lazy(() => import("./Globe"));

const STATS = [
  { k: "US · CA · MX", v: "Coverage" },
  { k: "24/7/365", v: "Live dispatch" },
  { k: "10+ yrs", v: "Client partnerships" },
];

export default function Hero({ ready }) {
  const ref = useRef(null);
  const { theme } = useTheme();
  const time = useChicagoTime();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const appear = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.1, ease: EASE_OUT, delay },
  });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-36"
    >
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_20%,transparent_75%)]" />
        <div className="animate-float absolute -right-[10%] -top-[20%] size-[70vmax] rounded-full bg-brand/25 blur-[140px] dark:bg-brand/30" />
        <div className="animate-float absolute -bottom-[30%] -left-[15%] size-[50vmax] rounded-full bg-brand/10 blur-[120px] [animation-delay:-6s]" />
      </div>

      <motion.div
        style={{ y: globeY, scale: globeScale }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 2, ease: EASE_OUT, delay: 0.2 }}
        className="pointer-events-none absolute left-1/2 top-[52%] aspect-square w-[150vw] -translate-x-1/2 opacity-60 sm:w-[115vw] md:opacity-80 lg:left-auto lg:right-[-18vw] lg:top-[-4vh] lg:w-[min(78vw,1250px)] lg:translate-x-0 lg:opacity-100"
      >
        <Suspense fallback={null}>
          <Globe dark={theme === "dark"} className="size-full" />
        </Suspense>
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x relative z-10 flex flex-1 flex-col"
      >
        <motion.div {...appear(0.1)} className="mb-8 md:mb-10">
          <span className="inline-flex items-center gap-3 rounded-full border border-line bg-bg/60 py-1.5 pl-2 pr-4 text-xs backdrop-blur-md">
            <span className="relative grid size-5 place-items-center">
              <span className="animate-ping-slow absolute size-2 rounded-full bg-emerald-500" />
              <span className="size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium">Dispatch online</span>
            <span className="h-3 w-px bg-line" />
            <span className="font-mono tabular-nums text-muted">Wheeling, IL · {time}</span>
          </span>
        </motion.div>

        <h1 className="max-w-[14ch] font-display text-[clamp(3.1rem,9.6vw,10.5rem)] font-semibold leading-[0.88] tracking-[-0.045em]">
          <RevealWords text="A thousand miles" play={ready} delay={0.15} className="block" />
          <RevealWords text="of our success" play={ready} delay={0.3} className="block" />
          <span className="block">
            <RevealWords text="is" play={ready} delay={0.45} />{" "}
            <span className="relative inline-block">
              <RevealWords
                text="your success."
                play={ready}
                delay={0.51}
                wordClassName="text-brand"
              />
              <motion.svg
                viewBox="0 0 600 40"
                preserveAspectRatio="none"
                aria-hidden
                className="absolute -bottom-[0.1em] left-0 h-[0.16em] w-full text-brand"
              >
              <motion.path
                d="M4 28C120 10 260 6 400 14s170 14 192 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={ready ? { pathLength: 1 } : undefined}
                transition={{ duration: 1.4, ease: EASE_OUT, delay: 1.2 }}
              />
              </motion.svg>
            </span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <motion.p
            {...appear(0.9)}
            className="max-w-md text-base leading-relaxed text-muted md:text-lg"
          >
            Your top-notch expedited service provider — with the right equipment, at
            the right place, at the right time. <span className="text-fg">Always.</span>
          </motion.p>

          <motion.div {...appear(1.05)} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#contact"
                data-cursor="Quote"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact");
                }}
                className="group flex items-center gap-3 rounded-full bg-brand py-3 pl-7 pr-3 text-base font-medium text-white shadow-[0_20px_50px_-15px_rgb(0_87_255/0.7)] transition-colors hover:bg-brand-600"
              >
                <RollText>Get a quote</RollText>
                <span className="grid size-9 place-items-center rounded-full bg-white text-brand transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#solutions"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#solutions");
                }}
                className="group flex items-center gap-3 rounded-full border border-line bg-bg/50 px-6 py-3.5 text-base font-medium backdrop-blur-md transition-colors hover:border-fg"
              >
                <RollText>Explore solutions</RollText>
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          {...appear(1.25)}
          className="mt-auto flex items-end justify-between gap-6 border-t border-line pb-6 pt-6 md:pb-8"
        >
          <dl className="grid grid-cols-3 gap-6 md:gap-14">
            {STATS.map((s) => (
              <div key={s.v}>
                <dt className="sr-only">{s.v}</dt>
                <dd className="font-display text-lg font-semibold tracking-tight md:text-2xl">
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
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-brand"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
