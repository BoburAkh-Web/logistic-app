import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];

/** Recolorable single-color SVG from /public (inherits currentColor). */
export function MaskIcon({ src, className = "" }) {
  return (
    <span
      aria-hidden
      className={`mask-icon ${className}`}
      style={{ "--icon": `url("${src}")` }}
    />
  );
}

/** Child drifts toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.6 });

  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Words rise out of a mask one after another.
 * Plays when scrolled into view, or when `play` flips to true if provided.
 */
export function RevealWords({
  text,
  as: Tag = "span",
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.06,
  duration = 1.1,
  play,
  highlight = [],
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const show = play === undefined ? inView : play && inView;
  const words = text.split(" ");
  const MotionTag = motion[Tag] ?? motion.span;

  return (
    <MotionTag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            className={`inline-block ${
              highlight.includes(i) ? "text-brand" : ""
            } ${wordClassName}`}
            initial={{ y: "110%", rotate: 4 }}
            animate={show ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration, ease: EASE_OUT, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Fade-up wrapper for blocks entering the viewport. */
export function FadeUp({ children, delay = 0, y = 40, className = "", as = "div" }) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Counts up to `to` once visible. */
export function Counter({ to, duration = 2.2, suffix = "", prefix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

/** Text that rolls to a duplicate of itself on hover (parent needs `group`). */
export function RollText({ children, className = "" }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

/** Tracks pointer position as CSS vars for `.spotlight` cards. */
export const spotlightHandlers = {
  onPointerMove: (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  },
};

// Constructing Intl formatters is expensive — build it once, not on every tick.
const chicagoFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Current time in Wheeling, IL (dispatch HQ). */
export function useChicagoTime() {
  const format = () => chicagoFormatter.format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/** Ticking clock isolated in its own component so parents don't re-render every second. */
export function LiveClock({ className = "" }) {
  const time = useChicagoTime();
  return <span className={`tabular-nums ${className}`}>{time}</span>;
}
