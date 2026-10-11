import { PARTNERS } from "../lib/data";
import { Counter, FadeUp, MaskIcon, RevealWords } from "./ui/primitives";

function LogoRow({ items, reverse = false, duration = "45s" }) {
  return (
    <div className="fade-x group flex overflow-hidden">
      <div
        className="animate-marquee flex w-max shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4 group-hover:[animation-play-state:paused]"
        style={{
          "--marquee-duration": duration,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[...items, ...items].map((p, i) => (
          <div
            key={i}
            aria-hidden={i >= items.length}
            className="grid h-20 w-36 shrink-0 place-items-center rounded-2xl border border-line bg-card text-fg/55 transition-colors duration-500 hover:border-brand hover:text-brand sm:h-24 sm:w-48 md:h-28 md:w-56"
          >
            <MaskIcon src={p.logo} className="h-8 w-24 sm:h-10 sm:w-28 md:h-12 md:w-32" />
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
    <section id="partners" className="relative overflow-hidden py-20 md:py-40">
      <div className="container-x grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <span className="eyebrow">(04) Customers &amp; partners</span>
          <h2 className="mt-6 font-display text-[clamp(2.75rem,6vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.04em]">
            <RevealWords text="Trusted by the names that move the world." highlight={[5, 6, 7]} />
          </h2>
        </div>
        <FadeUp delay={0.2} className="lg:ml-auto lg:max-w-md">
          <p className="text-base text-muted md:text-lg">
            We cooperate with companies all over the US, Canada and Mexico — and most of
            them never leave.
          </p>
          <div className="mt-6 flex gap-10 md:mt-8">
            <div>
              <p className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                <Counter to={80} suffix="%" />
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Clients 10+ years
              </p>
            </div>
            <div>
              <p className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                <Counter to={PARTNERS.length} suffix="+" />
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Household names
              </p>
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="mt-12 space-y-3 sm:space-y-4 md:mt-24">
        <LogoRow items={PARTNERS.slice(0, half)} duration="40s" />
        <LogoRow items={PARTNERS.slice(half)} duration="48s" reverse />
      </div>
    </section>
  );
}
