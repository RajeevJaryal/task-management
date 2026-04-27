import { useState } from "react";
import { Badge, Modal } from "./UI";
import { X } from "lucide-react";

export function TaskTable({ tasks = [], onView, onUpdate, showUpdate }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            {["Task ID", "Task Title", showUpdate ? "Assigned By" : "Assigned To", "Status", "Created On", "Actions"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-gray-400 font-medium text-[11px] uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3.5 font-semibold text-gray-800">
                {t.taskCode || `#${t.id?.slice(0, 6)}`}
              </td>
              <td className="px-4 py-3.5 font-semibold text-gray-800">
                {t.title || "Untitled"}
              </td>
              <td className="px-4 py-3.5 text-gray-600">
                {showUpdate
                  ? t.assignedByName || t.assignedBy || "Admin"
                  : t.assignedToName || t.assignedTo || "Not assigned"}
              </td>
              <td className="px-4 py-3.5">
                <Badge status={t.status || "pending"} />
              </td>
              <td className="px-4 py-3.5 text-gray-500">
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView?.(t)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors font-medium"
                  >
                    View
                  </button>
                  {showUpdate && (
                    <button
                      onClick={() => onUpdate?.(t)}
                      className="px-3 py-1.5 bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-lg transition-colors font-medium"
                    >
                      Update Status
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tasks.length === 0 && (
        <p className="p-8 text-center text-gray-400">No tasks found.</p>
      )}
    </div>
  );
}

export function TaskDetails({ task, role, onClose, onEdit, onDelete, onUpdate }) {
  if (!task) return null;

  const statusBg = {
    pending: "bg-orange-50",
    completed: "bg-green-50",
    progress: "bg-blue-50",
  };

  return (
    <aside className="bg-white border border-gray-100 rounded-xl flex flex-col" style={{ maxHeight: "calc(100vh - 120px)", position: "sticky", top: "80px" }}>
      {/* Sticky Header */}
      <div className="flex justify-between items-center px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-900">Task Details</h2>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
        >
          <X size={14} />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>

        <div className={`${statusBg[task.status] || "bg-orange-50"} rounded-lg p-3 flex justify-between items-center`}>
          <div>
            <p className="text-[10px] text-gray-400 mb-1">Status</p>
            <Badge status={task.status || "pending"} />
          </div>
          <button
            onClick={onUpdate}
            className="text-xs border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Update status
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Task Title</p>
            <p className="font-semibold text-gray-900">{task.title || "Untitled"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">
                {role === "admin" ? "Assigned To" : "Assigned By"}
              </p>
              <p className="font-semibold text-gray-900 text-xs">
                {role === "admin"
                  ? task.assignedToName || task.assignedTo || "Not assigned"
                  : task.assignedByName || task.assignedBy || "Admin"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Task ID</p>
              <p className="font-semibold text-gray-900 text-xs">
                {task.taskCode || `#${task.id?.slice(0, 6)}`}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Description</p>
            <p className="text-gray-600 text-xs leading-relaxed">
              {task.description || "No description provided for this task."}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Activity History</p>
          {(task.history || []).length === 0 ? (
            <p className="text-xs text-gray-400">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {(task.history || []).map((h, i) => (
                <div className="flex gap-3" key={i}>
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${i === 0 ? "bg-gray-900" : "border-2 border-gray-300 bg-white"}`} />
                    {i < (task.history || []).length - 1 && (
                      <div className="w-px flex-1 bg-gray-100 mt-1" style={{ minHeight: "16px" }} />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-medium text-gray-700">{h.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {h.date ? new Date(h.date).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      {role === "admin" && (
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white rounded-b-xl">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onDelete}
              className="py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Delete
            </button>
            <button
              onClick={onEdit}
              className="py-2.5 text-sm text-white bg-[#5b55d9] hover:bg-[#4e49c4] rounded-lg transition-colors font-medium"
            >
              Edit Task
            </button>
          </div>
        </div>
      )}

      {role !== "admin" && (
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white rounded-b-xl">
          <button
            onClick={onUpdate}
            className="w-full py-2.5 text-sm text-white bg-[#5b55d9] hover:bg-[#4e49c4] rounded-lg transition-colors font-medium"
          >
            Update Task
          </button>
        </div>
      )}
    </aside>
  );
}

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
        <label className="text-xs font-semibold text-gray-700">Task title</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mt-1.5 mb-4 text-sm outline-none focus:border-[#5b55d9] placeholder:text-gray-300"
          placeholder="Enter the task title"
          value={f.title}
          onChange={(e) => setF({ ...f, title: e.target.value })}
          required
        />

        <label className="text-xs font-semibold text-gray-700">Description</label>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mt-1.5 mb-4 min-h-20 text-sm outline-none focus:border-[#5b55d9] resize-none placeholder:text-gray-300"
          placeholder="Briefly describe what needs to be done"
          value={f.description}
          onChange={(e) => setF({ ...f, description: e.target.value })}
        />

        <label className="text-xs font-semibold text-gray-700">Assigned User Dropdown</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mt-1.5 mb-5 text-sm outline-none focus:border-[#5b55d9] text-gray-700"
          value={f.assignedTo}
          onChange={(e) => handleUserChange(e.target.value)}
          required
        >
          <option value="">Assign to</option>
          {users.map((user) => (
            <option key={user.uid || user.email} value={user.email}>
              {user.name || user.email}
            </option>
          ))}
        </select>

        {users.length === 0 && (
          <p className="text-xs text-red-500 -mt-3 mb-4">
            No users found. Create a user account with role "user" first.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button className="py-2.5 text-sm bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-lg transition-colors">
            {task ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function StatusModal({ task, role, onClose, onSubmit }) {
  const [s, setS] = useState(task?.status || "pending");

  if (!task) return null;

  const statusBg = {
    pending: "bg-orange-50",
    completed: "bg-green-50",
    progress: "bg-blue-50",
  };

  return (
    <Modal title="Task Status" onClose={onClose}>
      <div className={`${statusBg[task.status] || "bg-orange-50"} rounded-lg p-3 flex justify-between items-center mb-4`}>
        <p className="text-xs text-gray-500">Status</p>
        <Badge status={task.status || "pending"} />
      </div>

      <div className="mb-4">
        <p className="text-[10px] text-gray-400 mb-0.5">Task Title</p>
        <p className="text-sm font-semibold text-gray-900">{task.title || "Untitled"}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[10px] text-gray-400 mb-0.5">
            {role === "admin" ? "Assigned To" : "Assigned By"}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {role === "admin"
              ? task.assignedToName || task.assignedTo || "Not assigned"
              : task.assignedByName || task.assignedBy || "Admin"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 mb-0.5">Task ID</p>
          <p className="text-sm font-semibold text-gray-900">
            {task.taskCode || `#${task.id?.slice(0, 6)}`}
          </p>
        </div>
      </div>

      <label className="text-xs font-semibold text-gray-700">Update status</label>
      <select
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mt-1.5 text-sm outline-none focus:border-[#5b55d9]"
        value={s}
        onChange={(e) => setS(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <p className="text-[10px] text-gray-400 mt-1.5 mb-5">
        Changing the status will update it for the assigned user.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="py-2.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit(s)}
          className="py-2.5 text-sm bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-lg transition-colors"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}

export function DeleteModal({ onClose, onDelete }) {
  return (
    <Modal title="" onClose={onClose}>
      <div className="text-center pt-2">
        <h2 className="font-bold text-lg text-gray-900 mb-2">Delete this task?</h2>
        <p className="text-sm text-gray-400 mb-6">
          This action cannot be undone. The task will be permanently removed.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-2.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="py-2.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Delete Task
          </button>
        </div>
      </div>
    </Modal>
  );
}