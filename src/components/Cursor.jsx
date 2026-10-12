import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

const INTERACTIVE = "a, button, [data-cursor], input, textarea, label";

/** Dot + trailing ring. Grows over interactive elements; shows `data-cursor` labels. */
export default function Cursor() {
  // Decided after mount so the prerendered HTML and the first client render match.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(
      window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);
  const [state, setState] = useState({ hover: false, label: "", text: false, visible: false });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setState((s) => (s.visible ? s : { ...s, visible: true }));
    };
    const over = (e) => {
      const el = e.target.closest?.(INTERACTIVE);
      const next = {
        hover: !!el,
        label: el?.dataset.cursor || "",
        text: !!el?.matches("input, textarea"),
        visible: true,
      };
      setState((s) =>
        s.hover === next.hover && s.label === next.label && s.text === next.text ? s : next
      );
    };
    const leave = () => setState((s) => ({ ...s, visible: false }));

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    root.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      root.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = state.label ? 96 : state.text ? 6 : state.hover ? 64 : 36;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300"
      style={{ opacity: state.visible ? 1 : 0 }}
    >
      <motion.div
        className="absolute left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
        style={{ x, y }}
      />
      <motion.div
        className="absolute left-0 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border"
        style={{ x: rx, y: ry }}
        animate={{
          width: size,
          height: size,
          backgroundColor: state.label ? "rgba(0,87,255,1)" : "rgba(0,87,255,0)",
          borderColor: state.label ? "rgba(0,87,255,0)" : "rgba(0,87,255,0.55)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <AnimatePresence>
          {state.label && (
            <motion.span
              key={state.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-white"
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
