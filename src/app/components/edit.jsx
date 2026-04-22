import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';


function EditUserModal({ isOpen, onClose, user, onSave }) {
 const [formData, setFormData] = useState({ name: "", email: "", plan: "", addons: [] });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      // Logic to handle potential JSON strings from Supabase
      let initialAddons = [];
      try {
        initialAddons = Array.isArray(user.addons) 
          ? user.addons 
          : JSON.parse(user.addons || "[]");
      } catch (e) {
        initialAddons = [];
      }

      setFormData({ 
        ...user, 
        addons: initialAddons 
      });
    }
  }, [user, isOpen]);

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("Form-submissions")
        .update({
          name: formData.name,
          email: formData.email,
          plan: formData.plan,
          addons: formData.addons, // Supabase handles JSON arrays automatically
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("User updated successfully!");
      
      // Delay closing slightly so the user sees the success toast
      setTimeout(() => {
        onSave(); 
        onClose();
      }, 1000);

    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  // ... inside EditUserModal function

const toggleAddon = (addonTitle) => {
  // Ensure we have an array to work with
  const currentAddons = Array.isArray(formData.addons) ? formData.addons : [];
  
  // Check if this addon is already selected
  const exists = currentAddons.some((a) => a.title === addonTitle);

  let updatedAddons;
  if (exists) {
    // If it exists, remove it
    updatedAddons = currentAddons.filter((a) => a.title !== addonTitle);
  } else {
    // If it doesn't exist, add it
    // Note: Use the same object structure your database expects
    updatedAddons = [
      ...currentAddons,
      { title: addonTitle, monthlyPrice: 1, yearlyPrice: 10 },
    ];
  }
  // Update the local state
  setFormData({ ...formData, addons: updatedAddons });
};

// ... before the return statement
  console.log("Updating user with ID:", user.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
        <div>
            <Toaster position="top-right" reversedOrder={false} />
        </div>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Slide-over Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit User</h2>
            <p className="text-sm text-slate-500">ID: {user.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700">Full Name</label>
             <input 
                type="text" 
                value={formData.name || ""} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" 
             />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700">Email</label>
             <input 
                type="email" 
                value={formData.email || ""} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" 
             />
          </div>

          {/* Plan Selection Buttons */}
          <div className="space-y-4">
             <label className="block text-sm font-medium text-slate-700">Subscription Plan</label>
             <div className="grid grid-cols-3 gap-3">
                {['Arcade', 'Advanced', 'Pro'].map((plan) => (
                  <button 
                    key={plan} 
                    type="button"
                    onClick={() => setFormData({...formData, plan: plan})}
                    className={`p-3 border rounded-lg text-sm font-semibold transition-all ${
                        formData.plan === plan 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {plan}
                  </button>
                ))}
             </div>
          </div>

          {/* Add-ons Checkboxes */}
          <div className="space-y-3">
             <label className="block text-sm font-medium text-slate-700">Active Add-ons</label>
             <div className="space-y-2">
                {['Online service', 'Larger storage', 'Customizable profile'].map((addon) => (
                  <label key={addon} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg bg-slate-50/50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData.addons?.some(a => a.title === addon) || false} 
                        onChange={() => toggleAddon(addon)}
                        className="w-4 h-4 text-indigo-600 rounded" 
                    />
                    <span className="text-sm text-slate-600">{addon}</span>
                  </label>
                ))}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button 
            disabled={isSaving}
            onClick={onClose} 
            className="flex-1 py-3 px-4 rounded-lg font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            disabled={isSaving}
            onClick={handleUpdate}
            className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-[hsl(213,96%,18%)] hover:opacity-90 flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;