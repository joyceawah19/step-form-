import React from "react";
import Image from "next/image";
import { useState } from "react";

function Plan({selected, setSelected, errors}) {
  const paymentType = [
    {
      image: "/images/icon-arcade.svg",
      name: "Arcade",
      monthlyAmount: "$9/mo",
      yearlyAmount: "$90/yr",
      alt: "arcade",
    },
    {
      image: "/images/icon-advanced.svg",
      name: "Advanced",
      monthlyAmount: "$12/mo",
      yearlyAmount: "$120/yr",
      alt: "advanced",
    },
    {
      image: "/images/icon-pro.svg",
      name: "Pro",
      monthlyAmount: "$15/mo",
      yearlyAmount: "$150/yr",
      alt: "pro",
    },
  ];
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="bg-white flex flex-col justify-center h-fit px-10 py-8 lg:py-4 rounded-lg">
      <h1 className=" text-[30px] text-[hsl(213,96%,18%)] font-bold">
        Select your plan
      </h1>
      <p className="text-[hsl(231,11%,63%)] ">
        You have the option of monthly or yearly billing.
      </p>
     
      <div className="flex flex-col gap-4 mt-8">
        {paymentType.map((type, index) => (
          <div
          onClick = {() => setSelected(type.name)}
            className={` cursor-pointer flex gap-4 p-4 border  rounded-lg ${ selected ===type.name ? "border border-[hsl(272,73%,80%)] bg-[hsl(205,51%,87%)] ":" border-[hsl(240,4%,80%)] hover:border-[hsl(243,100%,62%)] "}`}
            key={index}
          >
            <Image src={type.image} height={30} width={30} alt={type.alt} />
            <div>
              <h2 className=" text-[hsl(213,96%,18%)] font-bold ">
                {type.name}
              </h2>
              <p className=" text-[hsl(231,11%,63%)] text-[12px] ">
                {isYearly? type.yearlyAmount : type.monthlyAmount}
              </p>
            </div>
          </div>
        ))}
         {errors.plan && (
        <p className="text-red-500 text-sm font-bold animate-pulse">{errors.plan} </p>
      )}
      </div>
    

      <div className="flex items-center justify-center gap-4 mt-8 bg-[hsl(205,51%,87%)] rounded-lg px-6 py-4">
        {/* Monthly */}
        <p
          className={`font-bold ${!isYearly ? "text-[hsl(213,96%,18%)]" : "text-gray-400"}`}
        >
          Monthly
        </p>

        {/* Toggle */}
        <div
          onClick={() => setIsYearly(!isYearly)}
          className="w-12 h-6 bg-[hsl(213,96%,18%)] rounded-full flex items-center px-1 cursor-pointer"
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${isYearly ? "translate-x-6" : "translate-x-0"}`}
          ></div>
        </div>

        {/* Yearly */}
        <p
          className={`font-bold ${isYearly ? "text-[hsl(213,96%,18%)]" : "text-gray-400"}`}
        >
          Yearly
        </p>
      </div>
    </div>
  );
}

export default Plan;
