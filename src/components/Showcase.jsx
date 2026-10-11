import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SOLUTIONS } from "../lib/data";
import { scrollToTarget } from "../lib/scroll";
import { ArrowUpRight, Truck } from "./ui/icons";
import { RevealWords } from "./ui/primitives";

gsap.registerPlugin(ScrollTrigger);

export default function Showcase() {
  const section = useRef(null);
  const track = useRef(null);
  const truck = useRef(null);
  const road = useRef(null);
  const counter = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.current.scrollWidth - window.innerWidth;

      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const roadWidth = road.current.offsetWidth - truck.current.offsetWidth;
            gsap.set(truck.current, { x: p * roadWidth });
            gsap.set(road.current.firstChild, { scaleX: p });
            const idx = Math.min(SOLUTIONS.length, Math.max(1, Math.ceil(p * SOLUTIONS.length)));
            counter.current.textContent = String(idx).padStart(2, "0");
          },
        },
      });

      gsap.utils.toArray(".sc-img", section.current).forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });

      gsap.utils.toArray(".sc-reveal", section.current).forEach((el) => {
        gsap.from(el, {
          yPercent: 110,
          rotate: 3,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el.closest(".sc-panel"),
            containerAnimation: tween,
            start: "left 75%",
            toggleActions: "play none none reverse",
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="solutions" ref={section} className="relative overflow-clip">
      <div
        ref={track}
        className="flex flex-col gap-5 px-[clamp(1rem,4vw,3rem)] py-24 lg:h-[100svh] lg:w-max lg:flex-row lg:items-center lg:gap-[3vw] lg:py-0"
      >
        {/* intro panel */}
        <div className="flex shrink-0 flex-col justify-center lg:w-[38vw] lg:pr-[2vw]">
          <span className="eyebrow">(01) Solutions</span>
          <h2 className="mt-6 font-display text-[clamp(2.75rem,5.6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.04em]">
            <RevealWords text="Four ways we move your world." highlight={[4, 5]} />
          </h2>
          <p className="mt-6 max-w-sm text-muted">
            From a single urgent pallet to dedicated trucks crossing borders — pick
            the lane, we handle the miles.
          </p>
          <span className="mt-10 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted lg:flex">
            Keep scrolling
            <span className="h-px w-16 bg-brand" />
          </span>
        </div>

        {SOLUTIONS.map((s, i) => (
          <article
            key={s.title}
            data-cursor="Drive"
            className="sc-panel group sticky top-(--stack) h-[78svh] w-full shrink-0 overflow-hidden rounded-[2rem] bg-ink text-paper lg:relative lg:top-0 lg:h-[74svh] lg:w-[min(72vw,1080px)]"
            style={{ "--stack": `calc(6rem + ${i * 14}px)` }}
          >
            <img
              src={s.image}
              alt=""
              loading="lazy"
              className="sc-img absolute inset-0 h-full w-full scale-[1.12] object-cover transition-[filter] duration-700 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />

            <div className="relative flex h-full flex-col justify-between p-6 md:p-10 lg:p-14">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs tracking-[0.2em] text-paper/70">
                  {String(i + 1).padStart(2, "0")} / {String(SOLUTIONS.length).padStart(2, "0")}
                </span>
                <span className="grid size-12 place-items-center rounded-full border border-paper/25 bg-ink/40 transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>

              <div>
                <div className="overflow-hidden pb-2">
                  <h3 className="sc-reveal font-display text-[clamp(2.5rem,7vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
                    {s.title}
                  </h3>
                </div>
                <div className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                  <p className="max-w-xl text-sm leading-relaxed text-paper/75 md:text-base">
                    {s.description}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-paper/20 bg-ink/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* closing panel */}
        <div className="sc-panel flex shrink-0 flex-col items-start justify-center gap-6 py-10 lg:w-[34vw] lg:pl-[2vw]">
          <p className="font-display text-[clamp(2rem,3.6vw,3.75rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Something else on the road? <span className="text-brand">Let’s talk.</span>
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#contact");
            }}
            className="group inline-flex items-center gap-3 rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-bg"
          >
            Start a shipment
            <span className="grid size-8 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight />
            </span>
          </a>
        </div>
      </div>

      {/* road progress (desktop pinned mode) */}
      <div className="pointer-events-none absolute inset-x-[clamp(1rem,4vw,3rem)] bottom-6 hidden items-center gap-6 lg:flex">
        <span className="font-mono text-xs tabular-nums text-muted">
          <span ref={counter} className="text-fg">
            01
          </span>{" "}
          / {String(SOLUTIONS.length).padStart(2, "0")}
        </span>
        <div ref={road} className="relative h-px flex-1 bg-line">
          <div className="absolute inset-0 origin-left scale-x-0 bg-brand" />
          <div ref={truck} className="absolute -top-[22px] left-0 text-brand">
            <Truck className="h-5 w-9" />
          </div>
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Destination</span>
      </div>
    </section>
  );
}
