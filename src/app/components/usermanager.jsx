"use client";
import React from "react";
import { supabase } from "../lib/supabase.js";
import { Search, Filter, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

function UserManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const[searchTerm, setSearchTerm] = useState('')

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Form-submissions")
        .select(
          "id, name, plan, addons, email, phone, totalAmount, planAmount, onsAmount, billing",
        )
        .order("created_at", { ascending: false });
      console.log("Supabase Data:", data);
      console.log("Supabase Error:", error);

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error("Error fetching form data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  const deleteUsers = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const { error } = await supabase
        .from("Form-submissions")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      alert("Failed to delete user");
      console.error(
        "Detailed Error:",
        error.message,
        error.details,
        error.hint,
      );
    }
  };
 
  const filterUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return(
      user.name?.toLowerCase().includes(search) || 
      user.email?.toLowerCase().includes(search)
    );
  } )

  return (
    <div className="bg-white flex flex-col justify-center h-fit rounded-lg px-6 lg:px-10 py-10 lg:py-4 gap-4 max-w-full overflow-hidden">
      <div>
        <h1 className="font-bold text-[30px] ">Manage Users</h1>
        <p className="text-[hsl(231,11%,63%)] ">
          Manage all users from multi-step-form
        </p>
      </div>

      <div className="flex w-full justify-between items-center gap-4 p-6 shadow-sm bg-[hsl(204,56%,98%)] flex wrap">
        <div className="relative w-full rounded-lg flex  justify-center items-center">
          <Search className="absolute left-2 h-4 w-6" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-[hsl(240,8%,87%)] focus:ring-2 focus:ring-indigo-500/20 focus:ring-indigo-500/20 rounded-lg"
            placeholder="search for a user...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto gap-4 flex justify-between">
          <button className="flex py-2 px-4 gap-2 justify-center items-center rounded-lg border border-[hsl(240,8%,87%)]">
            <Filter className="h-4 w-4" />
            <p>Filter</p>
          </button>
          {/* <button className="flex p-4 gap-4 justify-center items-center rounded-lg text-white bg-[hsl(213,96%,18%)] ml-auto ">
            <p>+</p>
            <p>Add Users</p>
          </button> */}
        </div>
      </div>
      <div className="w-full overflow-x-auto border border-slate-100 rounded-x">
        <table className=" min-w-[900px] w-full text-center border-collapse w-full text-xs md:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm">
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Plan Details</th>
              <th className="px-6 py-4 font-semibold">Add-ons</th>
              <th className="px-6 py-4 font-semibold">Total Amount</th>
              <th className="px-6 py-4 font-semibold">Phone</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td>Loading Users... </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td>No user found </td>
              </tr>
            ) :filterUsers.length == 0 ? (
              <tr><td colSpan="6" className="py-10 text-center text-slate-500">No matching users found</td></tr>
            ):(
    
              filterUsers.map((user) => (
      // ... your <tr> code ...
              // users.map((user) => (
                <tr
                  key={user.id || Math.random()}
                  className=" transition-colors group cursor-pointer odd:bg-white hover:bg-[hsl(206,94%,97%)] even:bg-slate-50/50 "
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">
                        {user.name}
                      </span>
                      <span className="text-sm text-slate-500">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex flex-col justify-center text-center gap-1">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                        {user.plan}
                      </span>
                      <span className="text-sm text-slate-500">
                        ${user.planAmount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {user.addons && Array.isArray(user.addons) ? (
                      user.addons.map((addon, index) => {
                        // Determine if we should show monthly or yearly price based on the user's billing
                        const isYearly = user.billing === "Yearly";
                        const price = isYearly
                          ? addon.yearlyPrice
                          : addon.monthlyPrice;
                        const suffix = isYearly ? "yr" : "mo";

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-2 mb-2 last:mb-0 border-b border-slate-50 pb-1"
                          >
                            <span className=" text-indigo-600 text-xs bg-slate-100 px-2 py-1 rounded text-indigo-700">
                              {addon.title}
                            </span>
                            <span className="text-sm whitespace-nowrap text-slate-500 ">
                              ${price}/{suffix}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-slate-400 italic text-xs">
                        No Add-ons
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-600 text-sm">
                    ${user.totalAmount}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        onClick={() => {
                          deleteUsers(user.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagerDashboard;
