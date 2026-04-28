import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import AuthLayout from "../components/AuthLayout";
import { signupUser } from "../store/authSlice";
import { inputClass, primaryButtonClass } from "../constants/styles";

export default function Signup() {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const sub = async (e) => {
    e.preventDefault();
    const r = await dispatch(signupUser(f));

    if (r.meta.requestStatus === "fulfilled") {
      nav("/choose-role");
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={sub}
        className="flex min-h-dvh w-full flex-col justify-center sm:min-h-0"
      >
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Join and start managing tasks.
        </p>

        {[
          {
            key: "name",
            label: "Full name",
            type: "text",
            placeholder: "John Doe",
          },
          {
            key: "email",
            label: "Email address",
            type: "email",
            placeholder: "you@example.com",
          },
          {
            key: "password",
            label: "Password",
            type: "password",
            placeholder: "••••••••",
          },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="mt-4 block text-sm font-medium text-gray-700 sm:mt-5">
              {label}
            </label>

            <input
              type={type}
              className={inputClass}
              value={f[key]}
              onChange={(e) => setF({ ...f, [key]: e.target.value })}
              placeholder={placeholder}
              required
            />
          </div>
        ))}

        <button type="submit" className={`${primaryButtonClass} mt-6 sm:mt-8`}>
          Create Account
        </button>

        <p className="mt-5 text-sm text-gray-400 sm:mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#5b55d9] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}