import React from "react";
import CarouselItem from "./CarouselItem";
import { Slide } from "react-awesome-reveal";

const Carousel = () => {
  const data = [
    {
      title: "EXPEDITE",
      description:
        "Need your shipment to arrive in a shortest time possible - we are the answer to cover your expedited  freight with  right drivers and right technology. Our expedite division understands what critically important means.",
      imageSrc: "./images/expedited_shipment.jpg",
    },
    {
      title: "FULL TRUCKLOAD",
      description:
        "Need a dedicated truck for all your cargo? Experienced drivers with top-notch trucks at your disposal to get your cargo to be delivered on time without any delays!",
      imageSrc: "./images/full_truck_load.jpg",
    },
    {
      title: "LESS THAN TRUCKLOAD",
      description:
        "Why paying for the full truck load with a small shipment when  considering using our LTL services at the right price? Our LTL division is there for you.",
      imageSrc: "./images/less_than_truckload.jpg",
    },
    {
      title: "CROSS BORDER",
      description:
        "Ship your cargo to Canada or Mexico with us! Professional and well-experienced drivers with top-notch trucks are always at your disposal!",
      imageSrc: "./images/cross_border.jpg",
    },
  ];
  return (
    <>
      {/* <Slide direction="up"> */}
      <CarouselItem data={data} />
      {/* </Slide> */}
    </>
  );
};

export default Carousel;
