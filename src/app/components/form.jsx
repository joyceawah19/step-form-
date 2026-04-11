"use client";
import { useState } from "react";

export default function MyForm({formData, setFormData, errors, handleChange}) {

  return (
    <div className = "bg-white flex justify-center h-fit rounded-lg px-6 lg:px-10 py-10 lg:py-4" > 
            <div className=" h-fit" >
                <h1 className =" text-[30px] text-[hsl(213,96%,18%)] font-bold "> Personal info</h1>
                <p className = "text-[hsl(231,11%,63%)] text-[14px]"> Please provide your name, email address, and phone number.</p>
                <form className="flex flex-col gap-2 mt-4 " >
                    <label htmlFor="name" className="mt-4 text-[hsl(213,96%,18%)]" >Name</label>
                    <input type="text" name="name" value={formData.name}  onChange={handleChange} placeholder="e.g Stephane King " className ={`${errors.name ? "border border-red-600":" border border-[hsl(231,4%,68%)]"} p-4 rounded-lg`} />
                    {errors.name && (
                      <p className = "text-red-400 text-sm" > {errors.name}</p>
                    )}
                    <label htmlFor="email"  className="mt-4 text-[hsl(213,96%,18%)]" >Email</label>
                    <input type="email" name="email"  value={formData.email}  id="email" onChange={handleChange}  className ={`${errors.email ? "border border-red-600":" border border-[hsl(231,4%,68%)]"} p-4 rounded-lg`} placeholder="e.g StephaneKing@lorem.com" />
                    {errors.email && (
                      <p className = "text-red-400 text-sm" > {errors.email}</p>
                    )}
                    <label htmlFor="phone"  className="mt-4 text-[hsl(213,96%,18%)] " >Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className ={`${errors.phone ? "border border-red-600":" border border-[hsl(231,4%,68%)]"} p-4 rounded-lg`} placeholder="e.g +1 (555) 123-4567" />
                    {errors.phone && (
                      <p className = "text-red-400 text-sm" > {errors.phone}</p>
                    )}
                </form>
               
            </div>
    </div>
  );
}