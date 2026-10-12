import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Spark } from "./ui/icons";
import { DESKTOP_MOTION, useMediaFlag } from "./ui/primitives";

const WORDS = [
  "Expedite",
  "Full Truckload",
  "LTL",
  "Cross Border",
  "Warehousing",
  "Live Tracking",
  "White Glove",
];

// Track = four identical copies, so one copy is 25% of its width and shifting by 25%
// loops seamlessly. `baseVelocity` is in % of the track per second.
const COPIES = 4;

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Words() {
  return Array.from({ length: COPIES }).map((_, copy) => (
    <span key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-6 font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold uppercase leading-none tracking-[-0.03em] md:px-10">
            {w}
          </span>
          <Spark className="size-[clamp(1.25rem,3vw,2.75rem)] shrink-0" />
        </span>
      ))}
    </span>
  ));
}

/**
 * Phones, tablets and the prerendered HTML: constant speed via a CSS animation, which
 * the compositor runs — zero main-thread work per frame, so touch scrolling stays smooth.
 */
function CssTrack({ baseVelocity }) {
  return (
    <div
      className="marquee-track flex shrink-0"
      style={{
        animationDuration: `${100 / COPIES / Math.abs(baseVelocity)}s`,
        animationDirection: baseVelocity < 0 ? "normal" : "reverse",
      }}
    >
      <Words />
    </div>
  );
}

/** Desktop: speed and direction follow scroll velocity (per-frame JS, mouse/trackpad only). */
function VelocityTrack({ baseVelocity }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "100px 0px" });
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  // Scroll boost: capped so a fast flick can't blur the words into a streak.
  const factor = useTransform(smooth, [-1000, 0, 1000], [-1, 0, 1]);
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * Math.abs(baseVelocity) * (delta / 1000) * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  return (
    <motion.div ref={ref} className="flex shrink-0 will-change-transform" style={{ x }}>
      <Words />
    </motion.div>
  );
}

function Band({ baseVelocity, className, scrollLinked }) {
  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className}`}>
      {scrollLinked ? <VelocityTrack baseVelocity={baseVelocity} /> : <CssTrack baseVelocity={baseVelocity} />}
    </div>
  );
}

export default function Marquee() {
  const scrollLinked = useMediaFlag(DESKTOP_MOTION);
  return (
    <section aria-label="What we move" className="cv-auto-mobile relative overflow-x-clip py-10 md:py-28">
      <div className="relative z-10 left-1/2 w-[112vw] -translate-x-1/2 -rotate-3 shadow-[0_30px_60px_-20px_rgb(0_87_255/0.5)]">
        <Band baseVelocity={-0.9} scrollLinked={scrollLinked} className="bg-brand py-5 text-white md:py-7" />
      </div>
      <div className="relative left-1/2 mt-3 w-[112vw] -translate-x-1/2 rotate-2 md:-mt-6">
        {/* Inverted fill rather than outlined text: stroking a variable font exposes
            its overlapping glyph contours as stray lines inside the letters. */}
        <Band baseVelocity={0.65} scrollLinked={scrollLinked} className="bg-fg py-5 text-bg md:py-7" />
      </div>
    </section>
  );
}
