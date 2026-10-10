import { PARTNERS } from "../lib/data";
import { Counter, FadeUp, MaskIcon, RevealWords } from "./ui/primitives";

function LogoRow({ items, reverse = false, duration = "45s" }) {
  return (
    <div className="fade-x group flex overflow-hidden">
      <div
        className="animate-marquee flex w-max shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused]"
        style={{
          "--marquee-duration": duration,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[...items, ...items].map((p, i) => (
          <div
            key={i}
            aria-hidden={i >= items.length}
            className="grid h-24 w-48 shrink-0 place-items-center rounded-2xl border border-line bg-card text-fg/55 transition-colors duration-500 hover:border-brand hover:text-brand md:h-28 md:w-56"
          >
            <MaskIcon src={p.logo} className="h-10 w-28 md:h-12 md:w-32" />
            <span className="sr-only">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Partners() {
  const half = Math.ceil(PARTNERS.length / 2);
  return (
    <section id="partners" className="relative overflow-hidden py-28 md:py-40">
      <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <span className="eyebrow">(04) Customers &amp; partners</span>
          <h2 className="mt-6 font-display text-[clamp(2.75rem,6vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.04em]">
            <RevealWords text="Trusted by the names that move the world." highlight={[5, 6, 7]} />
          </h2>
        </div>
        <FadeUp delay={0.2} className="lg:ml-auto lg:max-w-md">
          <p className="text-lg text-muted">
            We cooperate with companies all over the US, Canada and Mexico — and most of
            them never leave.
          </p>
          <div className="mt-8 flex gap-10">
            <div>
              <p className="font-display text-5xl font-semibold tracking-tight">
                <Counter to={80} suffix="%" />
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Clients 10+ years
              </p>
            </div>
            <div>
              <p className="font-display text-5xl font-semibold tracking-tight">
                <Counter to={PARTNERS.length} suffix="+" />
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Household names
              </p>
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="mt-16 space-y-4 md:mt-24">
        <LogoRow items={PARTNERS.slice(0, half)} duration="40s" />
        <LogoRow items={PARTNERS.slice(half)} duration="48s" reverse />
      </div>
    </section>
  );
}
