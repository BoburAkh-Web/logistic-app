import React from "react";

const Loader = () => {
  return (
    <div className="absolute top-[50%] w-full">
      <div className="TruckLoader">
        <span className="text-white ">Loading...</span>
        <div className="TruckLoader-cab "></div>
        <div className="TruckLoader-smoke"></div>
      </div>
      <hr />
    </div>
  );
};

export default Loader;
