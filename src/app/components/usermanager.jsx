"use client";
import React from "react";
import { useRef } from "react";
import { supabase } from "../lib/supabase.js";
import { Search, Filter, Edit2, Trash2, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import EditUserModal from "./edit.jsx";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import FilterBar from "./filter.jsx";

function UserManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null); // stores the ID or null
  const [filters, setFilters] = useState({ planType: null, addonType: null });
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

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

  // Step 1: Just open the modal
  const confirmDelete = (id) => {
    setUserToDelete(id);
  };

  // Step 2: Actually talk to Supabase
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from("Form-submissions")
        .delete()
        .eq("id", userToDelete);

      if (error) throw error;

      setUsers(users.filter((user) => user.id !== userToDelete));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Delete Error:", error);
    } finally {
      setUserToDelete(null); // Close modal
    }
  };

  const filterUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search);

    const matchesPlan = filters.planType
      ? user.plan?.toLowerCase().includes(filters.planType)
      : true;

    const matchesAddons= filters.addonType
      ? user.addons?.some((addon) =>
          addon.title?.toLowerCase().includes(filters.addonType),
        )
      : true;

    return matchesSearch && matchesPlan && matchesAddons;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className=" bg-white flex flex-col max-w-full min-w-0 h-fit justify-center rounded-lg px-6 lg:px-10 py-10 lg:py-4 gap-4 ">
      <div>
        <Toaster position="top-right" reversedOrder={false} />
      </div>
      <div className=" w-full">
        <h1 className="font-bold text-[30px] ">Manage Users</h1>
        <p className="text-[hsl(231,11%,63%)] ">
          Manage all users from multi-step-form
        </p>
      </div>

      <div className="flex w-full justify-between items-center gap-4 lg:p-6 p-2 shadow-sm bg-[hsl(204,56%,98%)] justify-between">
        <div className="relative w-full rounded-lg flex  justify-center items-center">
          <Search className="absolute left-2 h-4 w-6" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-[hsl(240,8%,87%)] focus:ring-2 focus:ring-indigo-500/20 focus:ring-indigo-500/20 rounded-lg"
            placeholder="search for a user...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div
          className="relative "
          ref={filterRef}
        >
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex py-2 px-4 gap-2 justify-center items-center rounded-lg border border-[hsl(240,8%,87%)]"
          >
            <Filter className="h-4 w-4" />
            <p>Filter</p>
          </button>
          {showFilter && (
              <div className="absolute right-0 mt-1 z-50 w-[300px]">
                <FilterBar filters={filters} setFilters={setFilters} />
              </div>
            )}
        </div>
      </div>
      <div className="w-full overflow-x-auto  lg:overflow-x-hidden rounded-lg">
        {/* <table className=" min-w-max lg:min-w-full  border-collapse w-full text-xs md:text-sm"> */}
        <table className="w-full table-auto border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm">
              <th className="px-6 py-4 font-semibold w-[25%]">User</th>
              <th className="px-6 py-4 font-semibold w-[15%] whitespace-nowrap">
                Plan Details
              </th>
              <th className="px-6 py-4 font-semibold w-[30%] whitespace-nowrap">
                Add-ons
              </th>
              <th className="px-6 py-4 font-semibold w-[10%] whitespace-nowrap">
                Total
              </th>
              <th className="px-6 py-4 font-semibold w-[10%] whitespace-nowrap">
                Phone
              </th>
              <th className="px-6 py-4 font-semibold w-[10%] text-right whitespace-nowrap">
                Actions
              </th>
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
            ) : filterUsers.length == 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-500">
                  No matching users found
                </td>
              </tr>
            ) : (
              filterUsers.map((user) => (
                <tr
                  key={user.id || Math.random()}
                  className=" transition-colors group cursor-pointer odd:bg-white hover:bg-[hsl(206,94%,97%)] even:bg-slate-50/50 "
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 whitespace-nowrap">
                        {user.name}
                      </span>
                      <span className="text-sm text-slate-500 whitespace-nowrap">
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
                      <button
                        className="cursor-pointer p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        onClick={() => {
                          confirmDelete(user.id);
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
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={fetchFormData} // This refreshes the table after saving
        />
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setUserToDelete(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Confirm Deletion
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>

              <div className="flex gap-3 mt-6 w-full">
                <button
                  onClick={() => setUserTyoDelete(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagerDashboard;
