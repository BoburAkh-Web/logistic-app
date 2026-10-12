import { useRef } from "react";
import { motion } from "motion/react";
import { SERVICES } from "../lib/data";
import { ArrowUpRight } from "./ui/icons";
import { EASE_OUT, FadeUp, MaskIcon, RevealWords } from "./ui/primitives";

/** Brand fill grows from the pointer's entry point and collapses toward its exit. */
function ServiceCard({ item, index }) {
  const ref = useRef(null);

  const setOrigin = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--fx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--fy", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      ref={ref}
      onPointerEnter={setOrigin}
      onPointerLeave={setOrigin}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease: EASE_OUT, delay: (index % 4) * 0.08 }}
      className="group relative isolate flex min-h-[210px] flex-col justify-between overflow-hidden bg-bg p-4 sm:min-h-[260px] sm:p-6 md:min-h-[300px] md:p-8"
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-brand transition-[clip-path] duration-700 ease-out-expo [clip-path:circle(0%_at_var(--fx,50%)_var(--fy,50%))] group-hover:[clip-path:circle(150%_at_var(--fx,50%)_var(--fy,50%))]"
      />
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] text-muted transition-colors duration-500 group-hover:text-white/70 sm:text-xs">
          /{String(index + 1).padStart(2, "0")}
        </span>
        <span className="grid size-7 place-items-center rounded-full border border-line transition-all sm:size-9 duration-500 group-hover:rotate-45 group-hover:border-white/40 group-hover:text-white">
          <ArrowUpRight className="size-3.5 sm:size-4" />
        </span>
      </div>

      <MaskIcon
        src={item.icon}
        className="my-5 size-11 text-brand transition-all sm:my-8 sm:size-16 duration-700 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-white"
      />

      <div>
        <h3 className="font-display text-base font-semibold leading-tight tracking-tight transition-colors duration-500 group-hover:text-white sm:text-xl md:text-2xl">
          {item.title}
        </h3>
        <p className="mt-1.5 text-xs leading-snug text-muted transition-colors duration-500 group-hover:text-white/80 sm:mt-2 sm:text-sm">
          {item.text}
        </p>
      </div>
    </motion.article>
  );
}

export default function Services() {
  return (
    <section id="services" className="cv-auto relative py-20 md:py-40">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <span className="eyebrow">(03) Capabilities</span>
            <h2 className="mt-6 font-display text-[clamp(2.75rem,6vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.04em]">
              <RevealWords text="Everything your freight needs." highlight={[2]} />
            </h2>
          </div>
          <FadeUp delay={0.2}>
            <p className="max-w-md text-base text-muted md:text-lg lg:ml-auto">
              One partner from pickup to proof of delivery. Mix and match services to
              build the exact lane your cargo needs.
            </p>
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-20 md:rounded-[1.75rem] lg:grid-cols-4">
          {SERVICES.map((item, i) => (
            <ServiceCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
