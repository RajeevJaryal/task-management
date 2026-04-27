import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "./components/AuthLayout";
import { DashboardLayout } from "./components/Layout";
import { StatCard, makeBarData } from "./components/UI";
import {
  TaskTable,
  TaskDetails,
  TaskForm,
  StatusModal,
  DeleteModal,
} from "./components/TasksUI";

import {
  loginUser,
  signupUser,
  setUserRole,
  loadCurrentUser,
} from "./store/authSlice";

import {
  fetchTasks,
  fetchUsers,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "./store/taskSlice";

function Protected({ children, role = false }) {
  const { user, initialized } = useSelector((s) => s.auth);
  if (!initialized) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (role && !user.role) return <Navigate to="/choose-role" />;
  return children;
}

function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { error, loading } = useSelector((s) => s.auth);

  const sub = async (e) => {
    e.preventDefault();
    const r = await dispatch(loginUser(f));
    if (r.meta.requestStatus === "fulfilled") {
      nav(r.payload.role ? "/dashboard" : "/choose-role");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={sub} className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">Welcome back 👋</h1>
        <p className="text-center text-gray-400 mt-2 text-sm">
          Log in to manage your tasks and track progress.
        </p>
        {error && (
          <p className="text-red-500 mt-4 text-center text-sm bg-red-50 rounded-lg py-2">
            {error}
          </p>
        )}
        <label className="block mt-8 text-sm font-medium text-gray-700">Email address</label>
        <input
          className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b55d9]"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          required
          type="email"
          placeholder="you@example.com"
        />
        <label className="block mt-5 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b55d9]"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          required
          placeholder="••••••••"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5b55d9] hover:bg-[#4e49c4] disabled:opacity-60 text-white py-3 rounded-xl mt-8 text-sm font-medium transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#5b55d9] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function Signup() {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const sub = async (e) => {
    e.preventDefault();
    const r = await dispatch(signupUser(f));
    if (r.meta.requestStatus === "fulfilled") nav("/choose-role");
  };

  return (
    <AuthLayout>
      <form onSubmit={sub} className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">Create your account</h1>
        <p className="text-center text-gray-400 mt-2 text-sm">Join and start managing tasks.</p>
        {[
          { key: "name", label: "Full name", type: "text", placeholder: "John Doe" },
          { key: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
          { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block mt-5 text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b55d9]"
              value={f[key]}
              onChange={(e) => setF({ ...f, [key]: e.target.value })}
              placeholder={placeholder}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-[#5b55d9] hover:bg-[#4e49c4] text-white py-3 rounded-xl mt-8 text-sm font-medium transition-colors"
        >
          Create Account
        </button>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#5b55d9] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function ChooseRole() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const pick = async (role) => {
    await dispatch(setUserRole({ uid: user.uid, role }));
    nav("/dashboard");
  };

  const roles = [
    {
      id: "admin",
      title: "Admin",
      desc: "Manage all tasks, assign work to team members, and track overall progress.",
      icon: "🛡️",
    },
    {
      id: "user",
      title: "User",
      desc: "View and update your assigned tasks and track your personal progress.",
      icon: "👤",
    },
  ];

  return (
    <AuthLayout>
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">Choose Your Role</h1>
        <p className="text-center text-gray-400 mt-2 text-sm">
          Select the role that best describes you.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {roles.map((r) => (
            <div key={r.id} className="border border-gray-200 rounded-2xl p-6 hover:border-[#5b55d9] transition-colors group">
              <div className="text-3xl mb-3">{r.icon}</div>
              <h2 className="text-xl font-bold text-gray-900">{r.title}</h2>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">{r.desc}</p>
              <button
                onClick={() => pick(r.id)}
                className="w-full py-2.5 rounded-xl mt-6 bg-[#5b55d9] hover:bg-[#4e49c4] text-white text-sm font-medium transition-colors"
              >
                Continue as {r.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const tasks = useSelector((s) => s.tasks.items);

  const role = user?.role || "user";

  const [sel, setSel] = useState(null);
  const [st, setSt] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const myTasks =
    role === "user"
      ? tasks.filter((t) => t.assignedTo === user?.email)
      : tasks;

  const c = (status) => myTasks.filter((t) => t.status === status).length;

  const stats = [
    {
      title: "All Tasks",
      subtitle:
        role === "admin"
          ? "All tasks created so far"
          : "All tasks assigned to you",
      value: myTasks.length,
      bars: makeBarData("#3b82f6"),
    },
    {
      title: "Pending Tasks",
      subtitle: "Tasks waiting to be started",
      value: c("pending"),
      bars: makeBarData("#f97316"),
    },
    {
      title: "In Progress",
      subtitle: "Tasks being actively worked on",
      value: c("progress"),
      bars: makeBarData("#a855f7"),
    },
    {
      title: "Completed Tasks",
      subtitle: "Tasks finished successfully",
      value: c("completed"),
      bars: makeBarData("#22c55e"),
    },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="pt-5">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-4 gap-4 mt-5">
          {stats.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        {role === "user" && (
          <div className="mt-7">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              All Tasks
            </h2>

            <TaskTable
              tasks={myTasks}
              onView={setSel}
              onUpdate={setSt}
              showUpdate
            />
          </div>
        )}

        {role === "admin" && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Quick actions
            </h2>

            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              <Link
                to="/tasks"
                className="border border-gray-100 bg-white rounded-xl p-5 hover:border-[#5b55d9] transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                  📋
                </div>

                <p className="font-semibold text-gray-900 text-sm">
                  All Tasks
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  View and manage all posted tasks
                </p>
              </Link>

              <Link
                to="/tasks?create=true"
                className="border border-gray-100 bg-white rounded-xl p-5 hover:border-[#5b55d9] transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                  ➕
                </div>

                <p className="font-semibold text-gray-900 text-sm">
                  Create Task
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Create new task and post
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/25 grid place-items-center z-40">
          <div className="w-[500px] mx-4">
            <TaskDetails
              task={sel}
              role={role}
              onClose={() => setSel(null)}
              onUpdate={() => {
                setSt(sel);
                setSel(null);
              }}
            />
          </div>
        </div>
      )}

      {st && (
        <StatusModal
          task={st}
          role={role}
          onClose={() => setSt(null)}
          onSubmit={async (status) => {
            await dispatch(updateTaskStatus({ id: st.id, status }));
            setSt(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}
function Tasks() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const tasks = useSelector((s) => s.tasks.items);
  const users = useSelector((s) => s.tasks.users);
  const role = user?.role || "user";

  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState("all");
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState(params.get("create") === "true");
  const [edit, setEdit] = useState(null);
  const [st, setSt] = useState(null);
  const [del, setDel] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const visible =
    role === "admin"
      ? tasks
      : tasks.filter((t) => t.assignedTo === user?.email);

  const list =
    filter === "all" ? visible : visible.filter((t) => t.status === filter);

  const filterLabel = { all: "All", pending: "Pending", completed: "Completed", progress: "In Progress" };

  return (
    <DashboardLayout role={role}>
      <div className="pt-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {role === "admin" ? "All Tasks" : "My Tasks"}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {role === "admin"
                ? "Manage, assign, and track tasks across your team."
                : "Track and update your assigned tasks."}
            </p>
          </div>
          {role === "admin" && (
            <button
              onClick={() => setForm(true)}
              className="bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Create Task
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {["all", "pending", "completed", "progress"].map((x) => (
            <button
              key={x}
              onClick={() => setFilter(x)}
              className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${
                filter === x
                  ? "border-[#5b55d9] text-[#5b55d9] bg-indigo-50"
                  : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
            >
              {filterLabel[x]}
            </button>
          ))}
        </div>

        <div
          className={
            sel && role === "admin"
              ? "grid grid-cols-[1fr_360px] gap-5 mt-5"
              : "mt-5"
          }
        >
          <TaskTable
            tasks={list}
            onView={(t) => {
              setSel(t);
              setSt(null);
            }}
            onUpdate={setSt}
            showUpdate={role !== "admin"}
          />

          {sel && role === "admin" && (
            <TaskDetails
              task={sel}
              role={role}
              onClose={() => setSel(null)}
              onEdit={() => setEdit(sel)}
              onDelete={() => setDel(true)}
              onUpdate={() => setSt(sel)}
            />
          )}
        </div>
      </div>

      {/* User View modal */}
      {sel && role !== "admin" && (
        <div className="fixed inset-0 bg-black/25 grid place-items-center z-40">
          <div className="w-[500px] mx-4">
            <TaskDetails
              task={sel}
              role={role}
              onClose={() => setSel(null)}
              onUpdate={() => {
                setSt(sel);
                setSel(null);
              }}
            />
          </div>
        </div>
      )}

      {form && (
        <TaskForm
          users={users}
          onClose={() => {
            setForm(false);
            setParams({});
          }}
          onSubmit={async (f) => {
            await dispatch(
              createTask({
                ...f,
                assignedBy: user.email,
                assignedByName: user.name,
              })
            );
            setForm(false);
            setParams({});
          }}
        />
      )}

      {edit && (
        <TaskForm
          task={edit}
          users={users}
          onClose={() => setEdit(null)}
          onSubmit={async (f) => {
            await dispatch(updateTask({ id: edit.id, changes: f }));
            setEdit(null);
            setSel(null);
          }}
        />
      )}

      {st && (
        <StatusModal
          task={st}
          role={role}
          onClose={() => setSt(null)}
          onSubmit={async (status) => {
            await dispatch(updateTaskStatus({ id: st.id, status }));
            setSt(null);
            setSel(null);
          }}
        />
      )}

      {del && (
        <DeleteModal
          onClose={() => setDel(false)}
          onDelete={async () => {
            await dispatch(deleteTask(sel.id));
            setDel(false);
            setSel(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/choose-role"
          element={
            <Protected>
              <ChooseRole />
            </Protected>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Protected role>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/tasks"
          element={
            <Protected role>
              <Tasks />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}