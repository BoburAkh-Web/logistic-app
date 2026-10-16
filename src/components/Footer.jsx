import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CONTACT, NAV_LINKS } from "../lib/data";
import { scrollToTarget } from "../lib/scroll";
import { Logo } from "./Nav";
import { ArrowUp } from "./ui/icons";
import { EASE_OUT, LiveClock, Magnetic, RollText } from "./ui/primitives";

const WORDMARK = "EZ TRANS".split("");

function Wordmark() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  return (
    <div
      ref={ref}
      aria-hidden
      className="flex select-none justify-between overflow-hidden pb-[0.06em] pr-[0.04em] font-display text-[clamp(4.5rem,21.5vw,24rem)] font-bold leading-[0.78] tracking-[-0.06em]"
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
        ),
      )}
    </div>
  );
}

function BackToTop({ className = "" }) {
  return (
    <Magnetic>
      <button
        type="button"
        onClick={() => scrollToTarget(0)}
        aria-label="Back to top"
        data-cursor="Top"
        className={`group grid place-items-center rounded-full border border-line transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-white ${className}`}
      >
        <ArrowUp className="size-5 transition-transform duration-500 group-hover:-translate-y-1 md:size-6" />
      </button>
    </Magnetic>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="cv-auto relative overflow-hidden pt-16 md:pt-32">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 border-b border-line pb-12 md:grid-cols-2 md:gap-12 md:pb-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Logo className="h-10 md:h-12" />
              <p className="mt-5 max-w-sm text-muted md:mt-6">
                Your top-notch expedited service provider. The right equipment,
                at the right place, at the right time. Always.
              </p>
            </div>
            {/* On phones/tablets the back-to-top button sits beside the brand block. */}
            <div className="shrink-0 lg:hidden">
              <BackToTop className="size-14" />
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Explore
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 md:mt-5 md:block md:space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(l.href);
                    }}
                    className="group inline-flex text-base md:text-lg"
                  >
                    <RollText>{l.label}</RollText>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Reach us
            </p>
            <ul className="mt-4 space-y-2 text-base md:mt-5 md:text-lg">
              <li>
                <a href={CONTACT.phoneHref} className="group inline-flex">
                  <RollText>{CONTACT.phone}</RollText>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="group inline-flex max-w-full"
                >
                  <RollText>{CONTACT.email}</RollText>
                </a>
              </li>
              <li className="text-sm text-muted md:text-base">
                {CONTACT.address}
              </li>
            </ul>
          </div>

          <div className="hidden items-start justify-end lg:flex">
            <BackToTop className="size-24" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 py-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[11px] md:flex-row md:items-center md:justify-between md:gap-3">
          {/* Year is baked in at build time; tolerate a mismatch across New Year. */}
          <p suppressHydrationWarning>
            © {year} EZ Trans Group. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Open 24/7/365 · Wheeling, IL <LiveClock />
          </p>
          <a
            href="https://t.me/boobur_akh"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 transition-colors hover:text-fg hover:underline"
          >
            Created by software engineer
          </a>
        </div>
      </div>

      <div className="px-[clamp(0.5rem,2vw,1.5rem)]">
        <Wordmark />
      </div>
    </footer>
  );
}
