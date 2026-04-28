import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../components/AuthLayout";
import { loginUser } from "../store/authSlice";
import { inputClass, primaryButtonClass } from "../constants/styles";

export default function Login() {
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
      <form onSubmit={sub} className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Log in to manage your tasks and track progress.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <label className="mt-6 block text-sm font-medium text-gray-700 sm:mt-8">
          Email address
        </label>
        <input
          className={inputClass}
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          required
          type="email"
          placeholder="you@example.com"
        />

        <label className="mt-4 block text-sm font-medium text-gray-700 sm:mt-5">
          Password
        </label>
        <input
          type="password"
          className={inputClass}
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          required
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className={`${primaryButtonClass} mt-6 sm:mt-8`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-5 text-sm text-gray-400 sm:mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#5b55d9] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}