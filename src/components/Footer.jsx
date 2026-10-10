import React from "react";

const Footer = () => {
  const today = new Date();
  const year = today.getFullYear();
  return (
    <div className="bg-primaryClr mt-[200px] tablet-mini:mt-[100px]">
      <div className="container mx-auto py-[30px]">
        <img
          src="./images/EZ logo.svg"
          width={135}
          height={85}
          alt=""
          className="mx-auto"
        />
        <div className="bg-white w-full h-[1px] mt-6"></div>
        <div className="pt-4 flex justify-between mobile:flex-col mobile:items-center">
          <p className="text-white text-[14px] tracking-wide tablet-extra:max-w-[200px] tablet-extra:text-center mobile:pt-[10px]">
            Copywrite © {year} EZ Trans Group
          </p>
          <p className="text-white tablet-mini:max-w-[250px] tablet-mini:text-center tablet-extra:max-w-[200px] mobile:pt-[20px] mobile:pb-[20px]">
            WE ARE OPEN 24/7 A WEEK, 365 DAYS A YEAR.
          </p>
          <a
            href="https://t.me/boobur_akh"
            target={"_blank"}
            className="text-white text-[14px] tracking-wide underline underline-offset-4 hover:opacity-[0.8] mobile:mt-2"
          >
            Created by Murad and updated by Bobur
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
