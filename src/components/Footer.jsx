import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CONTACT, NAV_LINKS } from "../lib/data";
import { scrollToTarget } from "../lib/scroll";
import { Logo } from "./Nav";
import { ArrowUp } from "./ui/icons";
import { EASE_OUT, Magnetic, RollText, useChicagoTime } from "./ui/primitives";

const WORDMARK = "EZ TRANS".split("");

function Wordmark() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  return (
    <div
      ref={ref}
      aria-hidden
      className="flex select-none justify-between overflow-hidden font-display text-[clamp(4.5rem,21.5vw,24rem)] font-bold leading-[0.78] tracking-[-0.06em]"
    >
      {WORDMARK.map((ch, i) =>
        ch === " " ? (
          <span key={i} className="w-[0.12em]" />
        ) : (
          <motion.span
            key={i}
            className="inline-block cursor-default pb-[0.04em] transition-colors duration-300 hover:text-brand"
            initial={{ y: "100%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: i * 0.05 }}
          >
            {ch}
          </motion.span>
        )
      )}
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const time = useChicagoTime();

  return (
    <footer className="relative overflow-hidden pt-24 md:pt-32">
      <div className="container-x">
        <div className="grid gap-12 border-b border-line pb-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
          <div>
            <Logo className="h-12" />
            <p className="mt-6 max-w-sm text-muted">
              Your top-notch expedited service provider. The right equipment, at the right
              place, at the right time. Always.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Explore</p>
            <ul className="mt-5 space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(l.href);
                    }}
                    className="group inline-flex text-lg"
                  >
                    <RollText>{l.label}</RollText>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Reach us</p>
            <ul className="mt-5 space-y-2 text-lg">
              <li>
                <a href={CONTACT.phoneHref} className="group inline-flex">
                  <RollText>{CONTACT.phone}</RollText>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="group inline-flex">
                  <RollText>{CONTACT.email}</RollText>
                </a>
              </li>
              <li className="text-base text-muted">{CONTACT.address}</li>
            </ul>
          </div>

          <div className="flex items-start lg:justify-end">
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToTarget(0)}
                aria-label="Back to top"
                data-cursor="Top"
                className="group grid size-24 place-items-center rounded-full border border-line transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-white"
              >
                <ArrowUp className="size-6 transition-transform duration-500 group-hover:-translate-y-1" />
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted md:flex-row md:items-center md:justify-between">
          <p>© {year} EZ Trans Group. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Open 24/7/365 · Wheeling, IL {time}
          </p>
          <a
            href="https://t.me/boobur_akh"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 transition-colors hover:text-fg hover:underline"
          >
            Created by Murad · updated by Bobur
          </a>
        </div>
      </div>

      <div className="px-[clamp(0.5rem,2vw,1.5rem)]">
        <Wordmark />
      </div>
    </footer>
  );
}
