import React from 'react';
import { Search, Filter, Edit2, Trash2, MoreVertical, Plus } from 'lucide-react';

const UserManagementUI = () => {
  // Mock data to visualize the UI
  const mockUsers = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', plan: 'Arcade', status: 'Monthly' },
    { id: 2, name: 'Sarah Williams', email: 'sarah@design.io', plan: 'Advanced', status: 'Yearly' },
    { id: 3, name: 'Michael Chen', email: 'm.chen@tech.com', plan: 'Pro', status: 'Monthly' },
  ];

//   const {data, error} = await supabase.from(Form-submissions)
 
  return (
    <div className="flex min-h-screen bg-slate-50 font-ubuntu">
      {/* Sidebar - Matching your previous multi-step style */}
      <aside className="w-64 bg-indigo-700 p-8 hidden md:block">
        <nav className="space-y-6">
          <div className="flex items-center gap-4 text-white opacity-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white text-indigo-700 font-bold">1</span>
            <div>
              <p className="text-xs text-indigo-200 uppercase">Step 5</p>
              <p className="text-sm font-bold tracking-wider">USER LIST</p>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">User Directory</h1>
            <p className="text-slate-500">Manage and preview all registered users from your multi-step form.</p>
          </header>

          {/* Controls: Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Plan Details</th>
                  <th className="px-6 py-4 font-semibold">Billing</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{user.name}</span>
                        <span className="text-sm text-slate-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {user.status}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagementUI;