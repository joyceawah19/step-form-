import React from "react";

function Addons({ formData, setFormData, errors }) {
  const availableAddons = [
    {
      id: "online-service",
      title: "Online service",
      description: "Access to multiplayer games",
      monthlyPrice: 1,
      yearlyPrice: 10,
    },
    {
      id: "larger-storage",
      title: "Larger storage",
      description: "Extra 1TB of cloud save",
      monthlyPrice: 2,
      yearlyPrice: 20,
    },
    {
      id: "custom-profile",
      title: "Customizable Profile",
      description: "Custom theme on your profile",
      monthlyPrice: 2,
      yearlyPrice: 20,
    },
  ];

  const toggleAddon = (addon) => {
  // Use ?. and || [] to ensure we always have an array to work with
  const currentAddons = formData?.addons || [];
  const isSelected = currentAddons.some((item) => item.id === addon.id);
  
  if (isSelected) {
    setFormData({
      ...formData,
      addons: currentAddons.filter((item) => item.id !== addon.id),
    });
  } else {
    setFormData({
      ...formData,
      addons: [...currentAddons, addon],
    });
  }
};


  return (
    <div className="bg-white flex flex-col justify-center h-fit px-10 py-12 lg:py-4 rounded-lg">
      <h1 className="text-[30px] text-[hsl(213,96%,18%)] font-bold">Pick add-ons</h1>
      <p className="text-[hsl(231,11%,63%)]">Add-ons help enhance your gaming experience.</p>

      {errors?.addons &&(
        <p className="text-red-500 text-sm font-bold animate-pulse mt-4">{errors.addons}</p>
      )}
      <div className="flex flex-col gap-4 mt-8">
        {availableAddons.map((addonItems) => {
          const isChecked = formData.addons.some((item) => item.id === addonItems.id);
          
          return (
            <div
              key={addonItems.id}
              onClick={() => toggleAddon(addonItems)}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                isChecked
                  ? "border-[hsl(243,100%,62%)] bg-[hsl(206,94%,87%)]"
                  : "border-[hsl(240,4%,80%)] hover:border-[hsl(243,100%,62%)]"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Custom Checkbox */}
                <div
                  className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                    isChecked ? "bg-[hsl(243,100%,62%)] border-none" : "border-gray-300"
                  }`}
                >
                  {isChecked && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9">
                      <path fill="none" stroke="#FFF" strokeWidth="2" d="m1 4 3.433 3.433L10.866 1"/>
                    </svg>
                  )}
                </div>

                <div>
                  <h3 className="text-[hsl(213,96%,18%)] font-bold text-[16px]">{addonItems.title}</h3>
                  <p className="text-[hsl(231,11%,63%)] text-[14px]">{addonItems.description}</p>
                </div>
              </div>

              <p className="text-[hsl(243,100%,62%)] text-[14px]">
                {formData.isYearly 
                  ? `+$${addonItems.yearlyPrice}/yr` 
                  : `+$${addonItems.monthlyPrice}/mo`
                }
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Addons;