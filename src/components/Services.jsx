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
      className="group relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden bg-bg p-7 md:p-8"
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-brand transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:circle(0%_at_var(--fx,50%)_var(--fy,50%))] group-hover:[clip-path:circle(150%_at_var(--fx,50%)_var(--fy,50%))]"
      />
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs text-muted transition-colors duration-500 group-hover:text-white/70">
          /{String(index + 1).padStart(2, "0")}
        </span>
        <span className="grid size-9 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-white/40 group-hover:text-white">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <MaskIcon
        src={item.icon}
        className="my-8 size-16 text-brand transition-all duration-700 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-white"
      />

      <div>
        <h3 className="font-display text-2xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-white">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-muted transition-colors duration-500 group-hover:text-white/80">
          {item.text}
        </p>
      </div>
    </motion.article>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-28 md:py-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <span className="eyebrow">(03) Capabilities</span>
            <h2 className="mt-6 font-display text-[clamp(2.75rem,6vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.04em]">
              <RevealWords text="Everything your freight needs." highlight={[2]} />
            </h2>
          </div>
          <FadeUp delay={0.2}>
            <p className="max-w-md text-lg text-muted lg:ml-auto">
              One partner from pickup to proof of delivery. Mix and match services to
              build the exact lane your cargo needs.
            </p>
          </FadeUp>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {SERVICES.map((item, i) => (
            <ServiceCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
