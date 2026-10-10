import React, { useState, useEffect } from "react";

const CarouselItem = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Function to handle next slide
  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % data.length);
  };

  // Auto carousel functionality
  useEffect(() => {
    const interval = setInterval(handleNext, 3000); // Change slide every 3 seconds (adjust the interval as needed)
    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, []);

  return (
    <div
      className="bg-cover bg-center h-[1024px] flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(47, 52, 58, 0.75) 0%, rgba(47, 52, 58, 0.75) 100%), url(${data[currentSlide].imageSrc})`, // Set the linear gradient and background image dynamically based on the current slide
      }}
    >
      <div
        className="container mx-auto flex flex-col justify-center items-center relative mobile-extra:mt-[80px]"
        id="controls-carousel"
      >
        {data.map((item, index) => (
          <div
            key={index}
            data-carousel-item
            className={`inner ${
              currentSlide === index ? "animate-fadeIn" : "animate-fadeOut"
            } ${currentSlide !== index && "hidden"}`}
          >
            <h3
              className="text-white text-4xl text-center uppercase leading-[50px] font-bold tablet-mini:text-3xl tablet-extra:text-2xl mobile-extra:text-3xl mobile-extra:leading-[40px]"
              style={{ display: currentSlide === index ? "block" : "none" }}
            >
              {item.title}
            </h3>
            <p
              className="pt-7 text-lg text-white tablet-mini:text-[16px] tablet-extra:text-[15px] mobile-extra:pt-3 mobile-extra:text-[16px]"
              style={{ display: currentSlide === index ? "flex" : "none" }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselItem;
