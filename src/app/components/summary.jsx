import React from "react";

function Summary({ formData, selected, setActiveState }) {
  // Pricing logic
  const planPrices = {
    Arcade: 9,
    Advanced: 12,
    Pro: 15,
  };

  const isYearly = formData.isYearly;
  const basePrice = planPrices[selected] || 0;
  const planTotal = isYearly ? basePrice * 10 : basePrice;

  const calculateTotal = () => {
    const addonsTotal = formData.addons.reduce((acc, addon) => {
      return acc + (isYearly ? addon.yearlyPrice : addon.monthlyPrice);
    }, 0);
    return planTotal + addonsTotal;
  };

  return (
    <div className="bg-white flex flex-col justify-center h-fit px-10 py-8 lg:py-4 rounded-lg">
      <h1 className="text-[30px] text-[hsl(213,96%,18%)] font-bold">Finishing up</h1>
      <p className="text-[hsl(231,11%,63%)]">
        Double-check everything looks OK before confirming.
      </p>

      <div className="mt-8 bg-[hsl(206,94%,97%)] p-6 rounded-lg">
        {/* Main Plan Selection */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-[hsl(213,96%,18%)] font-bold text-[16px]">
              {selected} ({isYearly ? "Yearly" : "Monthly"})
            </h2>
            <button
              onClick={() => setActiveState(1)}
              className="text-[hsl(231,11%,63%)] underline hover:text-[hsl(243,100%,62%)] text-sm transition-colors"
            >
              Change
            </button>
          </div>
          <p className="text-[hsl(213,96%,18%)] font-bold">
            ${planTotal}/{isYearly ? "yr" : "mo"}
          </p>
        </div>

        {/* Selected Add-ons */}
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-[hsl(213,96%,18%)] font-bold text-[16px]">Add-ons</p>
          {formData.addons.map((addon) => (
            <div key={addon.id} className="flex items-center justify-between">
              <p className="text-[hsl(231,11%,63%)] text-sm">{addon.title}</p>
              <p className="text-[hsl(213,96%,18%)] text-sm">
                +${isYearly ? addon.yearlyPrice : addon.monthlyPrice}/
                {isYearly ? "yr" : "mo"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex items-center justify-between p-6">
        <p className="text-[hsl(231,11%,63%)] text-sm">
          Total (per {isYearly ? "year" : "month"})
        </p>
        <p className="text-[hsl(243,100%,62%)] font-bold text-[20px]">
          +${calculateTotal()}/{isYearly ? "yr" : "mo"}
        </p>
      </div>
    </div>
  );
}

export default Summary;