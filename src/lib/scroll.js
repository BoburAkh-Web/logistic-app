import { useEffect } from "react";

let lenis = null;
let gsapPromise = null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** GSAP + ScrollTrigger, fetched on demand (desktop only) and shared by every caller. */
export function loadGsap() {
  gsapPromise ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    }
  );
  return gsapPromise;
}

/**
 * Lenis smooth scrolling for mouse/trackpad users, driven by GSAP's ticker so
 * ScrollTrigger stays in sync. Touch devices keep native scrolling (Lenis doesn't
 * smooth touch anyway), so phones never download either library.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;

    let cancelled = false;
    let cleanup = () => {};

    Promise.all([import("lenis"), loadGsap()]).then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, touchMultiplier: 1.4 });
      lenis.on("scroll", ScrollTrigger.update);
      if (document.documentElement.classList.contains("is-locked")) lenis.stop();

      const tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const refresh = () => ScrollTrigger.refresh();
      if (document.readyState === "complete") refresh();
      else window.addEventListener("load", refresh, { once: true });
      document.fonts?.ready.then(refresh);

      cleanup = () => {
        window.removeEventListener("load", refresh);
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
}

export function scrollToTarget(target) {
  // Render every `content-visibility: auto` section first; otherwise the target's
  // position is computed from placeholder heights and the jump lands short.
  document.documentElement.classList.add("cv-off");
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (target === 0 || target === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

export function lockScroll(locked) {
  document.documentElement.classList.toggle("is-locked", locked);
  if (lenis) locked ? lenis.stop() : lenis.start();
}
