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
          <Marquee />
          <Showcase />
          <About />
          <Services />
          <Partners />
          <Contact />
        </main>
        <Footer />
        <div aria-hidden className="grain" />
      </MotionConfig>
    </ThemeProvider>
  );
}
