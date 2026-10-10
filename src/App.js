import React from "react";
import { useEffect, useState } from "react";
import About from "./components/About";
import Services from "./components/Services";
import Partners from "./components/Partners";
import Contact from "./components/Contact";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
import CarouselComponent from "./components/Carousel";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Hero />
          <CarouselComponent />
          <About />
          <Services />
          <Partners />
          <Contact />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
