import { LayoutDashboard, ListTodo, LogOut, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";

export function DashboardLayout({ children, role }) {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const out = async () => {
    await dispatch(logoutUser());
    nav("/login");
  };

  const cls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-gray-100 text-gray-900 font-medium"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  return (
    <div className="min-h-screen flex bg-white">
      <aside className="fixed left-0 top-0 h-screen w-56 border-r border-gray-200 bg-white flex flex-col justify-between z-30">
        <div>
          <div className="h-14 flex items-center px-5 border-b border-gray-100">
            <h1 className="text-sm font-bold text-gray-900 tracking-tight">Task Management</h1>
          </div>
          <nav className="px-3 pt-4 space-y-1">
            <NavLink to="/dashboard" className={cls}>
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={cls}>
              <ListTodo size={16} />
              {role === "admin" ? "Tasks" : "My Tasks"}
            </NavLink>
          </nav>
        </div>
        <button
          onClick={out}
          className="m-4 flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      <div className="flex-1 ml-56">
        <header className="fixed top-0 left-56 right-0 h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 z-20">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-xs bg-gray-50 focus:outline-none focus:border-gray-300 placeholder:text-gray-400"
              placeholder="Search here..."
            />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gray-800 text-white grid place-items-center text-xs font-medium">
              {role === "admin" ? "A" : "U"}
            </div>
            <span className="text-xs font-medium capitalize text-gray-700">{role}</span>
          </div>
        </header>
        <main className="pt-14 px-6 pb-6">{children}</main>
      </div>
    </div>
  );
}
