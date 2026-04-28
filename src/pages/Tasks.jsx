import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import { DashboardLayout } from "../components/Layout";
import {
  TaskTable,
  TaskDetails,
  TaskForm,
  StatusModal,
  DeleteModal,
} from "../components/TasksUI";

import {
  fetchTasks,
  fetchUsers,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../store/taskSlice";

export default function Tasks() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const tasks = useSelector((s) => s.tasks.items);
  const users = useSelector((s) => s.tasks.users);

  const role = user?.role || "user";

  const [params, setParams] = useSearchParams();

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

  return (
    <DashboardLayout role={role}>
      <div className="pt-4 pb-2">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {role === "admin" ? "All Tasks" : "My Tasks"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {visible.length} task{visible.length !== 1 ? "s" : ""} total
            </p>
          </div>

          {role === "admin" && (
            <button
              onClick={() => setForm(true)}
              className="flex items-center gap-2 rounded-xl bg-[#5b55d9] hover:bg-[#4e49c4] px-4 py-2.5 text-white text-sm font-semibold transition-colors shrink-0"
            >
              <Plus size={16} />
              <span className="hidden xs:inline">Create Task</span>
              <span className="xs:hidden">New</span>
            </button>
          )}
        </div>

        {/* Task table / cards */}
        <TaskTable
          tasks={visible}
          onView={setSel}
          onUpdate={setSt}
          showUpdate={role !== "admin"}
        />
      </div>

      {sel && (
        <TaskDetails
          task={sel}
          role={role}
          onClose={() => setSel(null)}
          onEdit={() => setEdit(sel)}
          onDelete={() => setDel(true)}
          onUpdate={() => setSt(sel)}
        />
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
