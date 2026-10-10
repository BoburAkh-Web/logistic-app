import React from "react";
import { Zoom } from "react-awesome-reveal";

const Services = () => {
  const servicesInfo = [
    {
      img: "./images/delivery_icon.svg",
      text: "Same Day Courier Services ",
    },
    {
      img: "./images/motor_cycle.svg",
      text: "Motor Carrier Services",
    },
    {
      img: "./images/glove_service.svg",
      text: "White Glove Service/Lift Gate ",
    },
    {
      img: "./images/high_tech.svg",
      text: "High Tech/Electronics",
    },
    {
      img: "./images/dispatcher.svg",
      text: "24/7 Dispatch support",
    },
    {
      img: "./images/live_tracking.svg",
      text: "LIVE TRACKING",
    },
    {
      img: "./images/cross_docking.svg",
      text: "CROSS DOCKING",
    },
    {
      img: "./images/warehouse.svg",
      text: "WAREHOUSING",
    },
  ];

  return (
    <div className="mt-[180px] tablet-extra:mt-14" id="services">
      <div className="container mx-auto h-fit pt-[30px] pb-[10px] mobile:pb-[30px]">
        <Zoom left cascade>
          <h1 className="uppercase text-center text-[40px] font-bold mb-[20px] tablet-extra:text-[30px] mobile:text-[25px] ">
            Services
          </h1>
        </Zoom>
        <div className="flex flex-wrap gap-1 w-fit mx-auto tablet:items-center  tablet:justify-center tablet-extra:justify-center mobile:gap-3 mobile-mini:gap-4">
          {servicesInfo.map((e, index) => {
            return (
              <div
                className="flex items-center justify-center flex-col max-w-[100%] group w-[274px] h-[180px] bg-primaryClr"
                key={index}
              >
                <img
                  className="service_icon block mx-auto w-[100px] h-[100px] p-[20px] "
                  src={e.img}
                  alt={e.text}
                />
                <Zoom right cascade>
                  <p className="text-center max-w-[220px] text-[18px] font-bold text-white tracking-[0.9px]  tablet:mt-[25px] tablet-mini:mt-[20px] tablet-mini:text-[16px] mobile-mini:mt-[15px] mobile-mini:text-[13px]">
                    {e.text}
                  </p>
                </Zoom>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
