"use client";
import React from "react";

const FilterBar = ({ filters, setFilters }) => {
  const handlePlanChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      planType: prev.planType === type ? null : type, // toggle
    }));
  };

  const handleAddonChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      addonType: prev.addonType === type ? null : type, // toggle
    }));
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl shadow">

      {/* Plan Type */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-semibold">Plan:</span>

        {["basic", "advanced", "premium"].map((type) => (
          <button
            key={type}
            onClick={() => handlePlanChange(type)}
            className={`px-3 py-1 rounded-full border text-sm capitalize transition 
              ${
                filters.planType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Addon Type */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-semibold">Add-ons:</span>

        {["storage", "security", "custom"].map((type) => (
          <button
            key={type}
            onClick={() => handleAddonChange(type)}
            className={`px-3 py-1 rounded-full border text-sm capitalize transition 
              ${
                filters.addonType === type
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={() => setFilters({ planType: null, addonType: null })}
        className="text-sm text-red-500 underline"
      >
        Reset
      </button>
    </div>
  );
};

export default FilterBar;