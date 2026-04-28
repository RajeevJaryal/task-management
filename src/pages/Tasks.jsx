import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
      <div className="pt-4">
        <h1 className="text-base font-bold text-gray-900">Tasks</h1>

        {role === "admin" && (
          <button
            onClick={() => setForm(true)}
            className="mt-4 rounded-lg bg-[#5b55d9] px-4 py-2 text-white"
          >
            + Create
          </button>
        )}

        <div className="mt-4">
          <TaskTable
            tasks={visible}
            onView={setSel}
            onUpdate={setSt}
            showUpdate={role !== "admin"}
          />
        </div>
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