import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

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
  const isAdmin = role === "admin";

  const [params, setParams] = useSearchParams();

  const [viewTask, setViewTask] = useState(null);
  const [form, setForm] = useState(params.get("create") === "true");
  const [edit, setEdit] = useState(null);
  const [st, setSt] = useState(null);
  const [del, setDel] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setForm(params.get("create") === "true");
  }, [params]);

  const visible = isAdmin
    ? tasks
    : tasks.filter((t) => t.assignedTo === user?.email);

  return (
    <>
      <div className="pt-4 pb-2">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isAdmin ? "All Tasks" : "My Tasks"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {visible.length} task{visible.length !== 1 ? "s" : ""} total
            </p>
          </div>

          {isAdmin && (
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

        <div className={`grid gap-4 ${isAdmin && viewTask ? "grid-cols-[1fr_380px]" : "grid-cols-1"}`}>
          <div className="min-w-0">
            <TaskTable
              tasks={visible}
              onView={setViewTask}
              onUpdate={setSt}
              showUpdate={!isAdmin}
            />
          </div>

          {/* ADMIN: sticky side panel */}
          {isAdmin && viewTask && (
            <TaskDetails
              task={viewTask}
              role={role}
              onClose={() => setViewTask(null)}
              onEdit={() => {
                setEdit(viewTask);
                setViewTask(null);
              }}
              onDelete={() => setDel(viewTask)}
              onUpdate={() => {
                setViewTask(null);
                setSt(viewTask);
              }}
            />
          )}
        </div>
      </div>

      {/* USER: view modal via portal */}
      {!isAdmin && viewTask && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setViewTask(null); }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <TaskDetails
              modal={true}
              task={viewTask}
              role={role}
              onClose={() => setViewTask(null)}
              onUpdate={() => {
                setViewTask(null);
                setSt(viewTask);
              }}
            />
          </div>
        </div>,
        document.body
      )}

      {form && createPortal(
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
        />,
        document.body
      )}

      {edit && createPortal(
        <TaskForm
          task={edit}
          users={users}
          onClose={() => setEdit(null)}
          onSubmit={async (f) => {
            await dispatch(updateTask({ id: edit.id, changes: f }));
            setEdit(null);
          }}
        />,
        document.body
      )}

      {st && createPortal(
        <StatusModal
          task={st}
          role={role}
          onClose={() => setSt(null)}
          onSubmit={async (status) => {
            await dispatch(updateTaskStatus({ id: st.id, status }));
            setSt(null);
          }}
        />,
        document.body
      )}

      {del && createPortal(
        <DeleteModal
          onClose={() => setDel(null)}
          onDelete={async () => {
            await dispatch(deleteTask(del.id));
            setDel(null);
            setViewTask(null);
          }}
        />,
        document.body
      )}
    </>
  );
}