import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Spark } from "./ui/icons";

const WORDS = [
  "Expedite",
  "Full Truckload",
  "LTL",
  "Cross Border",
  "Warehousing",
  "Live Tracking",
  "White Glove",
];

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Infinite band whose speed and direction follow scroll velocity. */
function VelocityBand({ baseVelocity, className, outline = false }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "100px 0px" });
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  // Four identical copies → one copy is 25% of the track.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * Math.abs(baseVelocity) * (delta / 1000) * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  return (
    <div ref={ref} className={`flex overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex shrink-0" style={{ x }}>
        {Array.from({ length: 4 }).map((_, copy) => (
          <span key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
            {WORDS.map((w) => (
              <span key={w} className="flex items-center">
                <span
                  className={`px-6 font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold uppercase leading-none tracking-[-0.03em] md:px-10 ${
                    outline ? "text-outline" : ""
                  }`}
                >
                  {w}
                </span>
                <Spark className="size-[clamp(1.25rem,3vw,2.75rem)] shrink-0" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="What we move" className="relative py-16 md:py-28">
      <div className="relative z-10 left-1/2 w-[112vw] -translate-x-1/2 -rotate-3 shadow-[0_30px_60px_-20px_rgb(0_87_255/0.5)]">
        <VelocityBand baseVelocity={-3.5} className="bg-brand py-5 text-white md:py-7" />
      </div>
      <div className="relative left-1/2 -mt-4 w-[112vw] -translate-x-1/2 rotate-2 md:-mt-6">
        <VelocityBand
          baseVelocity={2.5}
          outline
          className="border-y border-line bg-bg py-5 text-fg md:py-7"
        />
      </div>
    </section>
  );
}
