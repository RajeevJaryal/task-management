import { useState } from "react";
import { LayoutDashboard, ListTodo, LogOut, Search, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";

export function DashboardLayout({ children, role }) {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const out = async () => {
    await dispatch(logoutUser());
    nav("/login");
  };

  const navCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-gray-100 text-gray-900 font-medium"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  const tabCls = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[10px] font-medium transition-colors ${
      isActive ? "text-[#5b55d9]" : "text-gray-400"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50 md:bg-white">

      {/* ── DESKTOP SIDEBAR (lg+) ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] xl:w-[300px] border-r border-gray-200 bg-white flex-col justify-between z-30">
        <div>
          <div className="w-full h-16 flex items-center px-4 xl:px-[14px] border-b border-gray-100">
            <h1 className="font-bold text-gray-900 tracking-tight text-xl xl:text-2xl truncate">
              Task Management
            </h1>
          </div>
          <nav className="w-full px-3 xl:px-[14px] pt-4 space-y-1">
            <NavLink to="/dashboard" className={navCls}>
              <LayoutDashboard size={16} className="shrink-0" />
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={navCls}>
              <ListTodo size={16} className="shrink-0" />
              {role === "admin" ? "Tasks" : "My Tasks"}
            </NavLink>
          </nav>
        </div>
        <button
          onClick={out}
          className="m-4 flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          Logout
        </button>
      </aside>

      {/* ── TABLET ICON SIDEBAR (md–lg) ── */}
      <aside className="hidden md:flex lg:hidden fixed left-0 top-0 h-screen w-16 border-r border-gray-200 bg-white flex-col items-center justify-between z-30 py-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#5b55d9] flex items-center justify-center mb-3 shrink-0">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <NavLink
            to="/dashboard"
            title="Dashboard"
            className={({ isActive }) =>
              `w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-50"
              }`
            }
          >
            <LayoutDashboard size={18} />
          </NavLink>
          <NavLink
            to="/tasks"
            title={role === "admin" ? "Tasks" : "My Tasks"}
            className={({ isActive }) =>
              `w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-50"
              }`
            }
          >
            <ListTodo size={18} />
          </NavLink>
        </div>
        <button
          onClick={out}
          title="Logout"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </aside>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── MOBILE SLIDE-IN DRAWER ── */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
            <h1 className="font-bold text-gray-900 text-base">Task Management</h1>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
          <nav className="px-3 pt-4 space-y-1">
            <NavLink to="/dashboard" className={navCls} onClick={() => setMobileMenuOpen(false)}>
              <LayoutDashboard size={16} className="shrink-0" />
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={navCls} onClick={() => setMobileMenuOpen(false)}>
              <ListTodo size={16} className="shrink-0" />
              {role === "admin" ? "Tasks" : "My Tasks"}
            </NavLink>
          </nav>
        </div>
        <button
          onClick={out}
          className="m-4 flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          Logout
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 ml-0 md:ml-16 lg:ml-[260px] xl:ml-[300px] flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 md:left-16 lg:left-[260px] xl:left-[300px] h-14 md:h-16 lg:h-20 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-5 lg:px-6 z-20">

          {/* Mobile: hamburger + brand */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} />
            </button>
            <span className="font-bold text-gray-900 text-sm">Task Management</span>
          </div>

          {/* Tablet / Desktop: search */}
          <div className="relative hidden md:flex items-center w-[220px] lg:w-[340px] xl:w-[422px] h-9 lg:h-11">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full h-full pl-9 pr-4 border border-gray-200 rounded-full text-xs bg-gray-50 focus:outline-none focus:border-gray-300 placeholder:text-gray-400"
              placeholder="Search here..."
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-2.5">
            {/* Mobile search icon */}
            <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
              <Search size={16} />
            </button>
            <div className="w-7 h-7 rounded-full bg-gray-800 text-white grid place-items-center text-xs font-medium shrink-0">
              {role === "admin" ? "A" : "U"}
            </div>
            <span className="text-xs font-medium capitalize text-gray-700 hidden sm:block">{role}</span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="pt-14 md:pt-16 lg:pt-20 px-4 md:px-5 lg:px-6 pb-24 md:pb-8 flex-1">
          {children}
        </main>

        {/* ── MOBILE BOTTOM TAB BAR ── */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center md:hidden z-20">
          <NavLink to="/dashboard" className={tabCls}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/tasks" className={tabCls}>
            <ListTodo size={20} />
            {role === "admin" ? "Tasks" : "My Tasks"}
          </NavLink>
          <button
            onClick={out}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[10px] font-medium text-gray-400"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}