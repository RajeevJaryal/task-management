import { useState } from "react";
import { Badge, Modal } from "./UI";
import { X, Eye, RefreshCw, Edit2, Trash2 } from "lucide-react";

/* ─────────────────────────────────────────────
   TaskTable
   Desktop  → full <table>
   Mobile   → card list (NO horizontal scroll)
───────────────────────────────────────────── */
export function TaskTable({ tasks = [], onView, onUpdate, showUpdate }) {
  if (tasks.length === 0) {
    return (
      <div className="border border-gray-100 rounded-xl bg-white p-10 text-center text-gray-400 text-sm">
        No tasks found.
      </div>
    );
  }

  return (
    <>
      {/* ── DESKTOP TABLE (md+) ── */}
      <div className="hidden md:block border border-gray-100 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {[
                  "Task ID",
                  "Task Title",
                  showUpdate ? "Assigned By" : "Assigned To",
                  "Status",
                  "Created On",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-gray-500 font-semibold text-xs uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tasks.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-gray-700 whitespace-nowrap text-sm">
                    {t.taskCode || `#${t.id?.slice(0, 6)}`}
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900 max-w-[200px] truncate text-sm">
                    {t.title || "Untitled"}
                  </td>
                  <td className="px-5 py-4 text-gray-500 max-w-[160px] truncate text-sm">
                    {showUpdate
                      ? t.assignedByName || t.assignedBy || "Admin"
                      : t.assignedToName || t.assignedTo || "Not assigned"}
                  </td>
                  <td className="px-5 py-4">
                    <Badge status={t.status || "pending"} />
                  </td>
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap text-sm">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 flex-nowrap">
                      <button
                        onClick={() => onView?.(t)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors font-medium text-sm whitespace-nowrap"
                      >
                        View
                      </button>
                      {showUpdate && (
                        <button
                          onClick={() => onUpdate?.(t)}
                          className="px-4 py-2 bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MOBILE CARD LIST (< md) — zero horizontal scroll ── */}
      <div className="md:hidden space-y-3">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            {/* Row 1: ID + Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 tracking-wide">
                {t.taskCode || `#${t.id?.slice(0, 6)}`}
              </span>
              <Badge status={t.status || "pending"} />
            </div>

            {/* Row 2: Title */}
            <p className="text-base font-bold text-gray-900 mb-2 leading-snug">
              {t.title || "Untitled"}
            </p>

            {/* Row 3: Assigned + Date */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 truncate max-w-[60%]">
                {showUpdate
                  ? `By: ${t.assignedByName || t.assignedBy || "Admin"}`
                  : `To: ${t.assignedToName || t.assignedTo || "Not assigned"}`}
              </span>
              <span className="text-sm text-gray-400 shrink-0 ml-2">
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>

            {/* Row 4: Action Buttons — full width, easy tap targets */}
            <div className="flex gap-2">
              <button
                onClick={() => onView?.(t)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={15} /> View
              </button>
              {showUpdate && (
                <button
                  onClick={() => onUpdate?.(t)}
                  className="flex-1 py-2.5 bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={15} /> Update
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   TaskDetails — slides up as bottom sheet on mobile,
   sticky sidebar on desktop
───────────────────────────────────────────── */
export function TaskDetails({ task, role, onClose, onEdit, onDelete, onUpdate }) {
  if (!task) return null;

  const statusBg = {
    pending: "bg-orange-50",
    completed: "bg-green-50",
    progress: "bg-blue-50",
  };

  return (
    <>
      {/* Mobile: full-screen bottom sheet */}
      <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />
        {/* Sheet */}
        <div className="relative bg-white rounded-t-3xl w-full max-h-[92dvh] flex flex-col shadow-2xl">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>
          {/* Header */}
          <div className="flex justify-between items-center px-5 pt-2 pb-3 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-base font-bold text-gray-900">Task Details</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <TaskDetailsBody task={task} role={role} onUpdate={onUpdate} statusBg={statusBg} />
          </div>
          {/* Footer */}
          <TaskDetailsFooter role={role} onDelete={onDelete} onEdit={onEdit} onUpdate={onUpdate} />
        </div>
      </div>

      {/* Desktop: sticky sidebar */}
      <aside
        className="hidden lg:flex bg-white border border-gray-100 rounded-xl flex-col w-full"
        style={{ maxHeight: "calc(100vh - 120px)", position: "sticky", top: "80px" }}
      >
        <div className="flex justify-between items-center px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
          >
            <X size={14} />
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}
        >
          <TaskDetailsBody task={task} role={role} onUpdate={onUpdate} statusBg={statusBg} />
        </div>
        <TaskDetailsFooter role={role} onDelete={onDelete} onEdit={onEdit} onUpdate={onUpdate} />
      </aside>
    </>
  );
}

function TaskDetailsBody({ task, role, onUpdate, statusBg }) {
  return (
    <>
      <div
        className={`${statusBg[task.status] || "bg-orange-50"} rounded-xl p-4 flex justify-between items-center gap-3`}
      >
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <Badge status={task.status || "pending"} />
        </div>
        <button
          onClick={onUpdate}
          className="text-sm border border-gray-200 bg-white rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors shrink-0 font-medium"
        >
          Update status
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Task Title</p>
          <p className="font-bold text-gray-900 text-base break-words leading-snug">
            {task.title || "Untitled"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-1">
              {role === "admin" ? "Assigned To" : "Assigned By"}
            </p>
            <p className="font-semibold text-gray-900 text-sm break-words">
              {role === "admin"
                ? task.assignedToName || task.assignedTo || "Not assigned"
                : task.assignedByName || task.assignedBy || "Admin"}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-1">Task ID</p>
            <p className="font-semibold text-gray-900 text-sm break-all">
              {task.taskCode || `#${task.id?.slice(0, 6)}`}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">Description</p>
          <p className="text-gray-600 text-sm leading-relaxed break-words">
            {task.description || "No description provided for this task."}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Activity History
        </p>
        {(task.history || []).length === 0 ? (
          <p className="text-sm text-gray-400">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {(task.history || []).map((h, i) => (
              <div className="flex gap-3" key={i}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      i === 0 ? "bg-gray-900" : "border-2 border-gray-300 bg-white"
                    }`}
                  />
                  {i < (task.history || []).length - 1 && (
                    <div className="w-px flex-1 bg-gray-100 mt-1" style={{ minHeight: "16px" }} />
                  )}
                </div>
                <div className="pb-2 min-w-0">
                  <p className="text-sm font-medium text-gray-700 break-words">{h.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {h.date ? new Date(h.date).toLocaleString() : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function TaskDetailsFooter({ role, onDelete, onEdit, onUpdate }) {
  return (
    <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white rounded-b-xl">
      {role === "admin" ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDelete}
            className="py-3 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Trash2 size={15} /> Delete
          </button>
          <button
            onClick={onEdit}
            className="py-3 text-sm text-white bg-[#5b55d9] hover:bg-[#4e49c4] rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Edit2 size={15} /> Edit Task
          </button>
        </div>
      ) : (
        <button
          onClick={onUpdate}
          className="w-full py-3 text-sm text-white bg-[#5b55d9] hover:bg-[#4e49c4] rounded-xl transition-colors font-semibold"
        >
          Update Task
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TaskForm
───────────────────────────────────────────── */
export function TaskForm({ task, users = [], onClose, onSubmit }) {
  const [f, setF] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignedTo: task?.assignedTo || "",
    assignedToName: task?.assignedToName || "",
  });

  const handleUserChange = (email) => {
    const selectedUser = users.find((u) => u.email === email);
    setF({
      ...f,
      assignedTo: email,
      assignedToName: selectedUser?.name || selectedUser?.email || "",
      assignedToUid: selectedUser?.uid || "",
    });
  };

  return (
    <Modal title={task ? "Edit Task" : "Create Task"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(f);
        }}
      >
        <label className="text-sm font-semibold text-gray-700">Task title</label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1.5 mb-4 text-sm outline-none focus:border-[#5b55d9] placeholder:text-gray-300"
          placeholder="Enter the task title"
          value={f.title}
          onChange={(e) => setF({ ...f, title: e.target.value })}
          required
        />

        <label className="text-sm font-semibold text-gray-700">Description</label>
        <textarea
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1.5 mb-4 min-h-[90px] text-sm outline-none focus:border-[#5b55d9] resize-none placeholder:text-gray-300"
          placeholder="Briefly describe what needs to be done"
          value={f.description}
          onChange={(e) => setF({ ...f, description: e.target.value })}
        />

        <label className="text-sm font-semibold text-gray-700">Assign to</label>
        <select
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1.5 mb-5 text-sm outline-none focus:border-[#5b55d9] text-gray-700"
          value={f.assignedTo}
          onChange={(e) => handleUserChange(e.target.value)}
          required
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.uid || user.email} value={user.email}>
              {user.name || user.email}
            </option>
          ))}
        </select>

        {users.length === 0 && (
          <p className="text-sm text-red-500 -mt-3 mb-4">
            No users found. Create a user account with role "user" first.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-3 text-sm bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-xl transition-colors font-semibold"
          >
            {task ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   StatusModal
───────────────────────────────────────────── */
export function StatusModal({ task, role, onClose, onSubmit }) {
  const [s, setS] = useState(task?.status || "pending");

  if (!task) return null;

  const statusBg = {
    pending: "bg-orange-50",
    completed: "bg-green-50",
    progress: "bg-blue-50",
  };

  return (
    <Modal title="Update Status" onClose={onClose}>
      <div
        className={`${statusBg[task.status] || "bg-orange-50"} rounded-xl p-4 flex justify-between items-center mb-4`}
      >
        <p className="text-sm text-gray-500 font-medium">Current Status</p>
        <Badge status={task.status || "pending"} />
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-1">Task Title</p>
        <p className="text-base font-bold text-gray-900 break-words leading-snug">
          {task.title || "Untitled"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-1">
            {role === "admin" ? "Assigned To" : "Assigned By"}
          </p>
          <p className="text-sm font-semibold text-gray-900 break-words">
            {role === "admin"
              ? task.assignedToName || task.assignedTo || "Not assigned"
              : task.assignedByName || task.assignedBy || "Admin"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-1">Task ID</p>
          <p className="text-sm font-semibold text-gray-900 break-all">
            {task.taskCode || `#${task.id?.slice(0, 6)}`}
          </p>
        </div>
      </div>

      <label className="text-sm font-semibold text-gray-700">Update status</label>
      <select
        className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1.5 text-sm outline-none focus:border-[#5b55d9]"
        value={s}
        onChange={(e) => setS(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <p className="text-xs text-gray-400 mt-2 mb-5">
        Changing the status will update it for the assigned user.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="py-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit(s)}
          className="py-3 text-sm bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-xl transition-colors font-semibold"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   DeleteModal
───────────────────────────────────────────── */
export function DeleteModal({ onClose, onDelete }) {
  return (
    <Modal title="" onClose={onClose}>
      <div className="text-center pt-2">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h2 className="font-bold text-xl text-gray-900 mb-2">Delete this task?</h2>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          This action cannot be undone. The task will be permanently removed.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="py-3 text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold"
          >
            Delete Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
