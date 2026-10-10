import React from "react";
import { Zoom, Slide } from "react-awesome-reveal";

const Partners = () => {
  const logos = [
    "./images/amazon_logo.svg",
    "./images/dell_logo.svg",
    "./images/dhl_logo.svg",
    "./images/electric_ab_logo.svg",
    "./images/fedex_logo.svg",
    "./images/harley_logo.svg",
    "./images/hunt_logo.svg",
    "./images/knight_logo.svg",
    "./images/pepsi_logo.svg",
    "",
    "./images/swift_logo.svg",
    "./images/toyota_logo.svg",
    "",
    "",
    "./images/ups_logo.svg",
  ];
  return (
    <div
      className="bg-primaryClr mt-[200px] pb-[90px] tablet-extra:mt-14 tablet:mt-[100px]"
      id="partners"
    >
      <div className="flex justify-between container mx-auto tablet-extra:flex-col mobile-extra:items-center">
        <div className="mt-[120px] mobile-mini:mt-[30px] flex flex-col tablet-extra:items-center tablet-extra:justify-center">
          <Zoom top cascade>
            <h1 className="max-w-[100%] text-[40px] text-white mb-5 font-bold tablet-extra:text-[35px] tablet-extra:text-center mobile:text-[30px]">
              Customers and Partners
            </h1>
          </Zoom>
          <Slide direction="left" duration={2000}>
            <p className="max-w-[400px] pr-[20px] text-white text-[18px] tablet-extra:text-[16px] tablet-extra:text-center">
              We cooperate with companies all over the US, Canada and Mexico.
              80% of our clients have been working with us for over 10 years
            </p>
          </Slide>
        </div>
        <div className="grid grid-cols-3 grid-flow-row gap-[30px] place-items-end mt-[100px] w-fit mr-[100px] tablet-extra:flex tablet-extra:flex-wrap tablet-extra:justify-center tablet-mini:place-items-center tablet-mini:mr-0 mobile:mt-[50px] mobile-mini:pb-10">
          {logos.map((item, index) => {
            return (
              <div key={index}>
                <div className="hover:animate-pulse tablet-mini:hidden">
                  <Zoom direction="right" cascade>
                    <img src={item} alt="" />
                  </Zoom>
                </div>
                <div className="hidden hover:animate-pulse tablet-mini:block">
                  <img src={item} alt="" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Partners;
