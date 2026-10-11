import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { VALUES } from "../lib/data";
import { ArrowUpRight } from "./ui/icons";
import {
  Counter,
  EASE_OUT,
  spotlightHandlers,
  LiveClock,
} from "./ui/primitives";

const MANIFESTO =
  "EZ Trans is built around one obsession — your supply chain. We move cargo safely and to the highest standard, and we take care of every customer, because a reliable, loyal carrier changes everything. Right people. Right technology. Right equipment.";
const ACCENT = new Set(["Right", "people.", "technology.", "equipment."]);

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={ACCENT.has(children) ? "text-brand" : undefined}
    >
      {children}{" "}
    </motion.span>
  );
}

function Manifesto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = MANIFESTO.split(" ");
  return (
    <p
      ref={ref}
      className="max-w-6xl font-display text-[clamp(1.75rem,4.2vw,4rem)] font-medium leading-[1.08] tracking-[-0.025em]"
    >
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

const rise = (i) => ({
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  transition: { duration: 1.1, ease: EASE_OUT, delay: i * 0.1 },
});

const card =
  "spotlight relative overflow-hidden rounded-[1.75rem] border border-line bg-card p-6 md:p-8";

function DispatchCard() {
  return (
    <motion.div
      {...rise(0)}
      {...spotlightHandlers}
      className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-brand p-6 text-white md:p-8 lg:col-span-5 lg:row-span-2"
    >
      {/* radar */}
      <div aria-hidden className="absolute -right-24 -top-24 size-[420px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full border border-white/20"
            style={{ transform: `scale(${0.25 + i * 0.25})` }}
          />
        ))}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgb(255 255 255 / 0.35), transparent 22%, transparent)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <span className="absolute left-1/2 top-1/2 size-2 -translate-1/2 rounded-full bg-white" />
      </div>

      <div className="relative">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
          Dispatch never sleeps
        </span>
      </div>
      <div className="relative">
        <p className="font-display text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-[0.85] tracking-[-0.04em]">
          24/7/365
        </p>
        <p className="mt-4 max-w-xs text-white/80">
          A real dispatcher picks up — at 3 a.m. on a holiday, just like at noon on a Tuesday.
        </p>
        <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-5 font-mono text-xs uppercase tracking-[0.16em]">
          <span className="text-white/70">Wheeling, IL</span>
          <LiveClock />
        </div>
      </div>
    </motion.div>
  );
}

function LoyaltyCard() {
  return (
    <motion.div {...rise(1)} {...spotlightHandlers} className={`${card} lg:col-span-4`}>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        Client loyalty
      </span>
      <p className="mt-6 font-display text-[clamp(3.5rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]">
        <Counter to={80} suffix="%" />
      </p>
      <p className="mt-3 text-muted">of our clients have worked with us for over 10 years.</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-elev">
        <motion.div
          className="h-full rounded-full bg-brand"
          initial={{ width: 0 }}
          whileInView={{ width: "80%" }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: EASE_OUT }}
        />
      </div>
    </motion.div>
  );
}

function CountriesCard() {
  return (
    <motion.div {...rise(2)} {...spotlightHandlers} className={`${card} lg:col-span-3`}>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        Coverage
      </span>
      <p className="mt-6 font-display text-[clamp(3.5rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]">
        <Counter to={3} />
      </p>
      <p className="mt-3 text-muted">countries, one network.</p>
      <svg viewBox="0 0 200 40" className="mt-6 w-full text-brand" aria-hidden>
        <motion.path
          d="M10 30 C 60 0, 140 0, 190 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE_OUT }}
        />
        {[
          [10, 30, "US"],
          [100, 7.5, "CA"],
          [190, 30, "MX"],
        ].map(([x, y, label]) => (
          <g key={label}>
            <circle cx={x} cy={y} r="4" fill="currentColor" />
            <text
              x={x}
              y={y === 30 ? 40 : 2}
              textAnchor="middle"
              className="fill-muted font-mono text-[7px]"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

function ValuesCard() {
  const [active, setActive] = useState(0);
  return (
    <motion.div {...rise(1)} {...spotlightHandlers} className={`${card} lg:col-span-7`}>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        What you get
      </span>
      <ul className="mt-4">
        {VALUES.map((v, i) => {
          const open = active === i;
          return (
            <li key={v.title} className="border-b border-line last:border-b-0">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  <span
                    className={`font-display text-xl font-semibold tracking-tight transition-colors duration-300 md:text-2xl ${
                      open ? "text-brand" : ""
                    }`}
                  >
                    {v.title}
                  </span>
                </span>
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                    open ? "rotate-45 border-brand bg-brand text-white" : "border-line"
                  }`}
                >
                  <ArrowUpRight className="size-3.5" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="overflow-hidden pl-9 text-muted"
                  >
                    <span className="block max-w-lg pb-5">{v.description}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="container-x">
        <span className="eyebrow">(02) Why EZ Trans</span>
        <div className="mt-8">
          <Manifesto />
        </div>

        <div className="mt-20 grid gap-4 md:mt-28 lg:grid-cols-12">
          <DispatchCard />
          <LoyaltyCard />
          <CountriesCard />
          <ValuesCard />
        </div>
      </div>
    </section>
  );
}
