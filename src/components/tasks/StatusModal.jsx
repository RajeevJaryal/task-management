import { useState } from "react";
import { Badge } from "../common/Badge";
import { Modal } from "../common/Modal";
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
      <div
        className={`${
          statusBg[task.status] || "bg-orange-50"
        } rounded-lg p-3 flex justify-between items-center mb-4`}
      >
        <p className="text-xs text-gray-500">Status</p>
        <Badge status={task.status || "pending"} />
      </div>

      <div className="mb-4">
        <p className="text-[10px] text-gray-400 mb-0.5">Task Title</p>
        <p className="text-sm font-semibold text-gray-900 break-words">{task.title || "Untitled"}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-[10px] text-gray-400 mb-0.5">
            {role === "admin" ? "Assigned To" : "Assigned By"}
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {role === "admin"
              ? task.assignedToName || task.assignedTo || "Not assigned"
              : task.assignedByName || task.assignedBy || "Admin"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-gray-400 mb-0.5">Task ID</p>
          <p className="text-sm font-semibold text-gray-900 truncate">
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

