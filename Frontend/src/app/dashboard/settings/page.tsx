"use client";

import { useAuth } from "@/contexts/AuthContext";
import { User as UserIcon, Lock, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 p-3 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-lg">
            <UserIcon size={18} /> Profile
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
            <Lock size={18} /> Security
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
            <Bell size={18} /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
            <Globe size={18} /> Preferences
          </button>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">Profile Information</h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input type="text" className="input" defaultValue={user?.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="input bg-slate-50 text-slate-500" defaultValue={user?.email} disabled />
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role / Status</label>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 font-medium rounded-full text-sm">
                    {user?.role}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded-full text-sm">
                    {user?.status || "ACTIVE"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
