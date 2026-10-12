import { Suspense } from "react";
import { MotionConfig, motion, useScroll, useSpring } from "motion/react";
import { useSmoothScroll } from "./lib/scroll";
import { ThemeProvider } from "./lib/theme";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Showcase from "./components/Showcase";
import About from "./components/About";
import Services from "./components/Services";
import Partners from "./components/Partners";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-brand"
    />
  );
}

/**
 * Each below-the-fold section is its own Suspense boundary. With prerendered HTML,
 * React hydrates the shell (nav + hero) first and then each boundary in a separate
 * task, instead of one long main-thread block for the whole page.
 */
const Section = ({ children }) => <Suspense fallback={null}>{children}</Suspense>;

export default function App() {
  useSmoothScroll();

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <Cursor />
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <Section><Marquee /></Section>
          <Section><Showcase /></Section>
          <Section><About /></Section>
          <Section><Services /></Section>
          <Section><Partners /></Section>
          <Section><Contact /></Section>
        </main>
        <Section><Footer /></Section>
        <div aria-hidden className="grain" />
      </MotionConfig>
    </ThemeProvider>
  );
}
