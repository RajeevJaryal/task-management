import { useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  LogOut,
  Search,
  X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";

export function DashboardLayout() {
  const dispatch = useDispatch();
  const role = useSelector((s) => s.auth.user?.role || "user");
  const nav = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const out = async () => {
    await dispatch(logoutUser());
    nav("/login");
  };

  const navCls = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-4 lg:gap-3 lg:px-4 lg:py-2.5 rounded-xl lg:rounded-lg text-lg lg:text-sm transition-colors ${
      isActive
        ? "bg-gray-100 text-gray-900 font-semibold lg:font-medium"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50 lg:bg-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[230px] xl:w-[270px] border-r border-gray-200 bg-white flex-col justify-between z-30">
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

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-white z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
            <h1 className="font-bold text-gray-900 text-xl">
              Task Management
            </h1>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-11 h-11 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="px-4 pt-5 space-y-2">
            <NavLink
              to="/dashboard"
              className={navCls}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={24} className="shrink-0 lg:hidden" />
              <LayoutDashboard size={16} className="shrink-0 hidden lg:block" />
              Dashboard
            </NavLink>

            <NavLink
              to="/tasks"
              className={navCls}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListTodo size={24} className="shrink-0 lg:hidden" />
              <ListTodo size={16} className="shrink-0 hidden lg:block" />
              {role === "admin" ? "Tasks" : "My Tasks"}
            </NavLink>
          </nav>
        </div>

        <button
          onClick={out}
          className="m-4 flex items-center gap-4 px-5 py-4 text-gray-500 hover:text-gray-700 text-lg rounded-xl hover:bg-gray-50 transition-colors"
        >
          <LogOut size={24} className="shrink-0" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[260px] xl:ml-[300px] flex flex-col min-h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 lg:left-[260px] xl:left-[300px] h-20 lg:h-20 border-b border-gray-200 bg-white flex items-center justify-between px-5 lg:px-6 z-20">
          {/* Mobile Title Only */}
          <div className="flex items-center lg:hidden">
            <span className="font-bold text-gray-900 text-xl">
              Task Management
            </span>
          </div>

          {/* Desktop Search */}
          <div className="relative hidden lg:flex items-center w-[340px] xl:w-[422px] h-11">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              className="w-full h-full pl-9 pr-4 border border-gray-200 rounded-full text-xs bg-gray-50 focus:outline-none focus:border-gray-300 placeholder:text-gray-400"
              placeholder="Search here..."
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
              <Search size={24} />
            </button>

            <div className="w-10 h-10 lg:w-7 lg:h-7 rounded-full bg-gray-800 text-white grid place-items-center text-base lg:text-xs font-semibold lg:font-medium shrink-0">
              {role === "admin" ? "A" : "U"}
            </div>

            <span className="text-base lg:text-xs font-semibold lg:font-medium capitalize text-gray-700 hidden sm:block">
              {role}
            </span>
          </div>
        </header>

        {/* Page */}
        <main className="pt-20 lg:pt-20 px-5 lg:px-6 pb-24 lg:pb-8 flex-1">
          <Outlet />
        </main>

        {/* Bottom Navigation Mobile */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around lg:hidden z-30">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-[#5b55d9]" : "text-gray-400"
              }`
            }
          >
            <LayoutDashboard size={22} />
            Home
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-[#5b55d9]" : "text-gray-400"
              }`
            }
          >
            <ListTodo size={22} />
            Tasks
          </NavLink>

          <button
            onClick={out}
            className="flex flex-col items-center text-xs text-gray-400"
          >
            <LogOut size={22} />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}