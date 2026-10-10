import React, { useEffect, useRef, useState } from "react";
import { Fade, Slide } from "react-awesome-reveal";

const Hero = () => {
  const links = [
    { name: "About Us", path: "#about" },
    { name: "Services", path: "#services" },
    { name: "Partners", path: "#partners" },
    { name: "Contact", path: "#contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const handleScreenResize = () => {
    if (window.innerWidth >= 576) {
      setIsMobileMenuOpen(false);
    }
  };
  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleScreenResize);
    window.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleScreenResize);
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };
  return (
    <div className="bg-cover bg-center h-[620px] bg-hero-pattern">
      <header ref={navRef} className="w-full backdrop-blur-sm bg-white/10">
        <div className="py-4 flex items-center justify-between container mx-auto">
          <a href="#" alt="logo">
            <img src="./images/EZ logo.svg" width={80} height={80} alt="logo" />
          </a>

          {/* Hamburger Menu (only shown on mobile) */}
          <div className="hidden mobile:block">
            <button
              type="button"
              className="text-white focus:outline-none"
              onClick={handleMobileMenuToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Responsive Navigation */}
          <nav className="flex items-center mobile:hidden tablet:flex">
            <ul className="flex items-center [&>*:not(:last-child)]:mr-[30px]">
              {links.map((item, index) => (
                <li key={index}>
                  <a href={item.path} className="nav-link">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* Mobile Menu */}
        <div className={` ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <nav className="flex flex-col items-center">
            <ul className="my-4 space-y-4">
              {links.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.path}
                    className="nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <div className="container mx-auto mt-16">
        <Slide left duration={1500} delay={500}>
          <h3 className="text-white text-6xl leading-[64px] max-w-[636px] mobile-extra:text-5xl">
            A thousand miles of our success is your success
          </h3>
        </Slide>
        <div className="flex mt-4 gap-6">
          <span className="bg-white w-[2px] h-18 flex"></span>
          <Fade left duration={3000} delay={1000}>
            <p className="text-white text-[15px] leading-5 max-w-[386px] mobile-extra:text-[13px]">
              Your top-notch Expedited Service Provider, with the right
              equipment at the right place and right time. Always.
            </p>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default Hero;
