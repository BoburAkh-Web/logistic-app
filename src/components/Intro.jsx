import { useEffect, useState } from "react";
import { animate, motion } from "motion/react";
import { lockScroll } from "../lib/scroll";
import { EASE_IN_OUT, EASE_OUT } from "./ui/primitives";

const WORD = "EZ TRANS".split("");

export const INTRO_KEY = "ez-intro-seen";

export function shouldPlayIntro() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return true;
  }
}

/**
 * Short branded preloader: counter + wordmark, then a two-layer curtain lifts.
 * `onReveal` fires as the curtain starts moving so the hero animates in underneath.
 */
export default function Intro({ onReveal, onDone }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    lockScroll(true);
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const controls = animate(0, 100, {
      duration: 2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setLeaving(true),
    });
    return () => controls.stop();
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onReveal, 350);
    return () => clearTimeout(t);
  }, [leaving, onReveal]);

  const finish = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* ignore */
    }
    lockScroll(false);
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[90]" aria-hidden>
      {/* trailing brand layer */}
      <motion.div
        className="absolute inset-0 bg-brand"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={leaving ? { clipPath: "inset(0% 0% 100% 0%)" } : undefined}
        transition={{ duration: 1.1, ease: EASE_IN_OUT, delay: 0.12 }}
        onAnimationComplete={() => leaving && finish()}
      />
      {/* main ink layer */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-between bg-ink p-5 text-paper md:p-10"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={leaving ? { clipPath: "inset(0% 0% 100% 0%)" } : undefined}
        transition={{ duration: 1, ease: EASE_IN_OUT }}
      >
        <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
          <span>EZ Trans Group</span>
          <span>42.14°N · 87.93°W</span>
        </div>

        <div className="flex items-end justify-center overflow-hidden">
          {WORD.map((ch, i) => (
            <motion.span
              key={i}
              className="font-display text-[clamp(4rem,17vw,16rem)] font-bold leading-[0.85] tracking-[-0.05em]"
              initial={{ y: "105%" }}
              animate={{ y: leaving ? "-105%" : "0%" }}
              transition={{
                duration: leaving ? 0.7 : 1.1,
                ease: leaving ? EASE_IN_OUT : EASE_OUT,
                delay: leaving ? i * 0.03 : 0.15 + i * 0.06,
              }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </div>

        <div>
          <div className="mb-4 h-px w-full bg-paper/15">
            <div
              className="h-full origin-left bg-brand"
              style={{ transform: `scaleX(${count / 100})` }}
            />
          </div>
          <div className="flex items-end justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
              Plotting routes across North America
            </span>
            <span className="font-display text-6xl font-semibold tabular-nums leading-none md:text-8xl">
              {String(count).padStart(3, "0")}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
