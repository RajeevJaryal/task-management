import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { StatCard, makeBarData } from "../components/UI";
import { TaskTable, TaskDetails, StatusModal } from "../components/TasksUI";
import { fetchTasks, updateTaskStatus } from "../store/taskSlice";
import frame1 from "../assets/frame1.png";
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
    role === "user" ? tasks.filter((t) => t.assignedTo === user?.email) : tasks;

  const count = (status) => myTasks.filter((t) => t.status === status).length;

  const stats = [
    {
      title: role === "admin" ? "All Tasks" : "My Tasks",
      subtitle:
        role === "admin" ? "All tasks created so far" : "Assigned to you",
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
    <>
      <div className="pt-4 pb-2">
        {/* Page title */}
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {role === "admin"
            ? "Overview of all tasks"
            : "Your personal task overview"}
        </p>

       
        <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        {role === "user" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">My Tasks</h2>
            </div>
            <TaskTable
              tasks={myTasks}
              onView={setSel}
              onUpdate={setSt}
              showUpdate
            />
          </div>
        )}

       
        {role === "admin" && (
          <div className="mt-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">
              Quick actions
            </h2>

            <div className="flex flex-wrap gap-2">
              {/* All Tasks */}
              <Link
                to="/tasks"
                className="group w-[300px] h-[82px] flex items-center rounded-[18px] border border-gray-200 bg-white px-4 transition-all hover:border-[#5b55d9] hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 shrink-0 overflow-hidden">
                    <img
                      src={frame1}
                      alt="All tasks"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-none">
                      All tasks
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      View and manage tasks
                    </p>
                  </div>
                </div>
              </Link>

             
              <Link
                to="/tasks?create=true"
                className="group w-[300px] h-[82px] flex items-center rounded-[18px] border border-gray-200 bg-white px-4 transition-all hover:border-[#5b55d9] hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 shrink-0 overflow-hidden">
                    <img
                      src={frame1}
                      alt="Create Task"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-none">
                      Create Task
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Create new task
                    </p>
                  </div>
                </div>
              </Link>
            </div>
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
    </>
  );
}
