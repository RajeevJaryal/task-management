import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { setUserRole } from "../store/authSlice";

export default function ChooseRole() {
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
      <div className="flex min-h-dvh w-full flex-col justify-center sm:min-h-0">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Choose Your Role
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Select the role that best describes you.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
            {roles.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-gray-200 p-5 transition-colors hover:border-[#5b55d9] sm:p-6"
              >
                <div className="mb-3 text-3xl">{r.icon}</div>

                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {r.title}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {r.desc}
                </p>

                <button
                  onClick={() => pick(r.id)}
                  className="mt-5 w-full rounded-xl bg-[#5b55d9] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4e49c4] sm:mt-6"
                >
                  Continue as {r.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}