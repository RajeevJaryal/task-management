import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { DashboardLayout } from "../components/Layout";
import { StatCard, makeBarData } from "../components/UI";
import { TaskTable, TaskDetails, StatusModal } from "../components/TasksUI";

import { fetchTasks, updateTaskStatus } from "../store/taskSlice";

export default function Dashboard() {
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

  const count = (status) =>
    myTasks.filter((t) => t.status === status).length;

  const stats = [
    {
      title: role === "admin" ? "All Tasks" : "My Tasks",
      subtitle:
        role === "admin"
          ? "All tasks created so far"
          : "Assigned to you",
      value: myTasks.length,
      bars: makeBarData("#3b82f6"),
    },
    {
      title: "Pending",
      subtitle: "Waiting to be started",
      value: count("pending"),
      bars: makeBarData("#f97316"),
    },
    {
      title: "In Progress",
      subtitle: "Actively worked on",
      value: count("progress"),
      bars: makeBarData("#a855f7"),
    },
    {
      title: "Completed",
      subtitle: "Finished successfully",
      value: count("completed"),
      bars: makeBarData("#22c55e"),
    },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="pt-4">
        <h1 className="text-base font-bold text-gray-900">Dashboard</h1>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        {role === "user" && (
          <div className="mt-6">
            <TaskTable
              tasks={myTasks}
              onView={setSel}
              onUpdate={setSt}
              showUpdate
            />
          </div>
        )}

        {role === "admin" && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link to="/tasks" className="rounded-xl border p-4 bg-white">
              All Tasks
            </Link>

            <Link
              to="/tasks?create=true"
              className="rounded-xl border p-4 bg-white"
            >
              Create Task
            </Link>
          </div>
        )}
      </div>

      {sel && (
        <TaskDetails
          task={sel}
          role={role}
          onClose={() => setSel(null)}
          onUpdate={() => setSt(sel)}
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
          }}
        />
      )}
    </DashboardLayout>
  );
}