"use client";
import React from "react";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { ArrowLeft } from "lucide-react";

import MyForm from "./form.jsx";
import Plan from "./plan.jsx";
import Addons from "./ons.jsx";
import Summary from "./summary";
import UserManagerDashboard from "./usermanager.jsx";

function Mainpage() {
  const [activeState, setActiveState] = useState(0);
  const navBarItems = ["YOUR INFO", "SELECT PLAN", "ADD-ONS", "SUMMARY"];
  const [errors, setErrors] = useState({});
  const [selected, setSelected] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [totalToSubmit, setTotalToSubmit] = useState(0);
  const [onsAmountPaid, setOnsAmountPaid] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addons: [],
    isYearly: false,
    amount: 0,
    totalAmount: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const formValidation = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = " phone number is required";
    } else if (!/^\+?[0-9\s\-()]{7,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    return newErrors;
  };


  const handleNext = (e) => {
    e.preventDefault();
    if (activeState === 0) {
      const validationErrors = formValidation();
      if (Object.keys(validationErrors).length === 0) {
        setErrors({}); // this to clear errrors
        setActiveState(1); // move to the next step
        console.log("Form submitted successfully", formData);
      } else {
        setErrors(validationErrors);
      }
    } else if (activeState === 1) {
      if (selected === "") {
        setErrors({ plan: "Please select a plan before proceeding" });
      } else {
        setErrors({});
        setActiveState(2);
      }
    } else if (activeState === 2) {
      if (formData.addons.length === 0) {
        setErrors({ addons: "Please select atleast one add-on" });
      } else {
        setErrors({});
        setActiveState(3);
      }
    } else {
      setActiveState((prev) => Math.min(prev + 1, 3));
    }
  };
  // Form200$4password supabase password
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("Form-submissions") // Your table name
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            plan: formData.plan,
            isyearly: formData.isYearly,
            addons: formData.addons, // This saves as a JSON array
            planAmount: formData.planPrice,
            billing: formData.billingCycle,
            totalAmount: totalToSubmit,
            onsAmount: onsAmountPaid,
          },
        ]);

      if (error) {
        console.error("Error inserting data:", error.message);
        alert("Something went wrong saving your data.");
      } else {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        setActiveState(0); //Move to a "Thank You" screen
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-[hsl(208,42%,94%)] flex w-full overflow-x-hidden min-h-screen  ">
      <div className="w-full max-w-full lg:max-w-5xl mx-auto bg-[hsl(208,42%,94%)] lg:bg-white h-fit lg:p-4 mb-20 lg:mb-0 lg:my-20 rounded-lg flex flex-col lg:flex-row gap-6">
        {/* <div className="bg-[hsl(208,42%,94%)] lg:bg-white h-fit lg:p-4 mb-20 lg:mb-0 lg:my-20 rounded-lg flex flex-col lg:flex-row gap-6 "> */}
        {/* Success Popup */}
        {showToast && (
          <div className="fixed top-10 right-5 z-50 bg-green-300 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce lg:animate-none">
            <div className="bg-white text-green-500 rounded-full w-6 h-6 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm text-green-100">
                Your data has been saved.
              </p>
            </div>
          </div>
        )}
        {/* large screens navbar */}
        <div
          className="hidden lg:flex flex-col gap-8 border bg-cover bg-center text-white p-6 pr-8 "
          style={{ backgroundImage: "url('/images/bg-sidebar-desktop.svg')" }}
        >
          {navBarItems.map((items, index) => (
            <div key={index} className="flex gap-2 px-4">
              <div
                className={`border border-white rounded-full w-10 h-10 p-2 text-[12px] flex items-center justify-center cursor-pointer ${activeState === index ? "bg-[hsl(206,94%,87%)] " : "bg-transparent"}`}
              >
                {index + 1}{" "}
              </div>
              <div className="">
                <p className="text-[hsl(231,11%,63%)] text-[12px] ">
                  STEP{index + 1}{" "}
                </p>
                <p className="font-semibold text-[13px]">{items} </p>
              </div>
            </div>
          ))}
          {activeState === 4 ? (
            <button
              className="flex gap-1 w-fit text-white cursor-pointer border border-white bg-transparent rounded-[20px] font-bold py-2 px-6 w-auto sm:text-sm"
              onClick={() => setActiveState(0)}
            >
              <ArrowLeft size={20} strokeWidth={6} />
              <p>Back</p>
            </button>
          ) : (
            <button
              className="text-white cursor-pointer border border-white bg-transparent rounded-[20px] font-bold p-4 w-auto text-sm lg:text-[16px] "
              onClick={() => setActiveState(4)}
            >
              View Users
            </button>
          )}{" "}
        </div>

        {/* small screens navbar */}
        <div
          className="w-full lg:hidden flex flex-col items-center bg-cover bg-center text-white py-6 pb-20 overflow-hidden"
          style={{ backgroundImage: "url('/images/bg-sidebar-mobile.svg')" }}
        >
          {/* Steps */}
          <div className="flex gap-3 flex-wrap justify-center w-full px-4">
            {navBarItems.map((items, index) => (
              <div key={index}>
                <div
                  className={`border border-white rounded-full w-10 h-10 flex items-center justify-center text-[12px] ${
                    activeState === index
                      ? "bg-[hsl(206,94%,87%)]"
                      : "bg-transparent"
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="mt-4">
            {activeState === 4 ? (
              <button
                className="flex gap-1 items-center text-white border border-white rounded-[20px] font-bold py-2 px-4"
                onClick={() => setActiveState(0)}
              >
                <ArrowLeft size={18} />
                <p>Back</p>
              </button>
            ) : (
              <button
                className="text-white border border-white rounded-[20px] font-bold px-4 py-2"
                onClick={() => setActiveState(4)}
              >
                View Users
              </button>
            )}
          </div>
        </div>

        <div className="-mt-20 lg:mt-0 w-full flex justify-center">
          <div
            className={`${activeState === 4 ? "w-full" : "max-w-2xl w-full"}`}
          >
            {activeState === 0 && (
              <MyForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                handleChange={handleChange}
              />
            )}
            {activeState === 1 && (
              <Plan
                selected={selected}
                setSelected={setSelected}
                errors={errors}
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {activeState === 2 && (
              <Addons
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setOnsAmountPaid={setOnsAmountPaid}
              />
            )}
            {activeState === 3 && (
              <Summary
                formData={formData}
                selected={selected}
                setActiveState={setActiveState}
                setTotalToSubmit={setTotalToSubmit}
              />
            )}
            {activeState === 4 && (
              <div className="w-full min-w-0 justify-start lg:justify-center">
                {" "}
                {/* This min-w-0 is mandatory! */}
                <UserManagerDashboard />
              </div>
            )}

            {activeState !== 4 && (
              <div className="hidden lg:flex justify-between pt-24 py-4 px-12  ">
                <button
                  className={`text-white font-bold py-2 px-6 rounded-lg ${activeState === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[hsl(213,96%,18%)] cursor-pointer"} `}
                  onClick={() =>
                    setActiveState((prev) => Math.max(prev - 1, 0))
                  }
                >
                  Back
                </button>

                {activeState === 3 ? (
                  <button
                    className="text-white font-bold py-2 px-6 rounded-lg bg-[hsl(213,96%,18%)] cursor-pointer"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    className="text-white font-bold py-2 px-6 rounded-lg bg-[hsl(213,96%,18%)] cursor-pointer"
                    onClick={handleNext}
                  >
                    Next Step
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Fixed Buttons */}
      {activeState !== 4 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white flex justify-between px-6 py-4 shadow-md">
          <button
            onClick={() => setActiveState((prev) => Math.max(prev - 1, 0))}
            disabled={activeState === 0}
            className={`font-bold py-2 px-6 rounded-lg ${
              activeState === 0
                ? "bg-gray-300 cursor-not-allowed text-white"
                : "bg-[hsl(213,96%,18%)] text-white"
            }`}
          >
            Back
          </button>

          {activeState === 3 ? (
            <button
              onClick={handleSubmit}
              className="font-bold py-2 px-6 rounded-lg bg-[hsl(213,96%,18%)] text-white cursor-pointer"
            >
              Confirm
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="font-bold py-2 px-6 rounded-lg bg-[hsl(213,96%,18%)] text-white"
            >
              Next Step
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Mainpage;
