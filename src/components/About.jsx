import React from "react";
import CountUp from "react-countup";
import { Slide, Flip } from "react-awesome-reveal";

const About = () => {
  const data = [
    {
      title: "Services",
      description:
        "We do provide services for expedite, full truckload/less than truckload. You benefit from every innovation, whether it involves a simple extension to your cargo, whether it means a development in warehousing.",
    },
    {
      title: "Beneficial Solution",
      description:
        "You assign us a task – and we’ll provide you with the most beneficial solution.",
    },
    {
      title: "Location",
      description:
        "We are specializing in freight moving services of all kinds, though The United States, Canada, and Mexico. We don’t expect any instructions from clients.",
    },
    {
      title: "Safety & Compliance",
      description:
        "You benefit from our experience in delivering effective solutions to the complex  supply chains of some of the  biggest corporations.",
    },
  ];
  return (
    <div
      className="bg-primaryClr pt-[200px] pb-[200px] tablet-extra:pt-14  tablet-extra:pb-14 mobile:pb-10"
      id="about"
    >
      <div className="container gap-x-[100px] mx-auto my-auto flex tablet:gap-x-[50px] tablet-mini:gap-x-[30px] tablet-extra:flex-col tablet-extra:gap-y-[-50px] ">
        <div>
          <Slide direction="left" duration={2000}>
            <h1 className="max-w-[100%] uppercase text-white w-[350px] mb-[30px] text-[40px] font-bold tablet:w-[250px] tablet:text-[30px] tablet:mb-[20px] tablet-extra:text-center tablet-extra:w-[100%] tablet-extra:text-[40px] tablet-extra:mb-3 mobile:text-[25px]">
              Why choose Ez Trans Group?
            </h1>
          </Slide>
          <Slide direction="left" duration={2000}>
            <p className="max-w-[100%] w-[400px] h-[179px] text-[16px] text-white font-normal tablet:w-[350px] tablet:text-[14px] tablet-extra:text-center tablet-extra:w-[100%] tablet-extra:text-[16px] tablet-extra:pt-6 mobile:h-fit mobile:text-[12px]">
              Ez Trans is majorly oriented in satisfying your supply chain
              demands and performing safe and high quality in transporting the
              cargo. We take care of all our customers as we understand how
              important it is to have reliable and loyal carrier to cover your
              needs. Carrier who has ability based on right people, right
              technology and right equipment.
            </p>
          </Slide>
        </div>
        <div>
          <Slide direction="right" duration={2000}>
            {data.map((item, index) => {
              return (
                <div
                  key={index}
                  className="mb-[30px] tablet-extra:flex tablet-extra:flex-col tablet-extra:items-center tablet-extra:justify-center mobile:mt-[20px]"
                >
                  <h3 className="text-[32px] font-large text-white tablet-extra:text-center tablet:text-[30px]">
                    {item.title}
                  </h3>
                  <p className="text-[16px] font-normal w-[80%] pt-[10px] text-white tablet-extra:text-center tablet:text-[14px] tablet-extra:text-[16px] mobile:text-[12px]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </Slide>
        </div>
      </div>
    </div>
  );
};

export default About;
