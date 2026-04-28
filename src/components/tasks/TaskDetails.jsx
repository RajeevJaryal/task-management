import { X } from "lucide-react";
import { Badge } from "../common/Badge";

export function TaskDetails({
  task,
  role,
  onClose,
  onEdit,
  onDelete,
  onUpdate,
  modal = false,
}) {
  if (!task) return null;

  const statusBg = {
    pending: "bg-orange-50",
    completed: "bg-green-50",
    progress: "bg-blue-50",
  };

  return (
    <aside
      className="bg-white border border-gray-100 rounded-xl flex flex-col w-full"
      style={
        modal
          ? {
              maxHeight: "90vh",
            }
          : {
              maxHeight: "calc(100vh - 120px)",
              position: "sticky",
              top: "80px",
            }
      }
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-900">Task Details</h2>

        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#e5e7eb transparent",
        }}
      >
        <div
          className={`${
            statusBg[task.status] || "bg-orange-50"
          } rounded-lg p-3 flex justify-between items-center gap-3`}
        >
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 mb-1">Status</p>
            <Badge status={task.status || "pending"} />
          </div>

          <button
            onClick={onUpdate}
            className="text-xs border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
          >
            Update status
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Task Title</p>
            <p className="font-semibold text-gray-900 break-words">
              {task.title || "Untitled"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 mb-0.5">
                {role === "admin" ? "Assigned To" : "Assigned By"}
              </p>

              <p className="font-semibold text-gray-900 text-xs truncate">
                {role === "admin"
                  ? task.assignedToName || task.assignedTo || "Not assigned"
                  : task.assignedByName || task.assignedBy || "Admin"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 mb-0.5">Task ID</p>

              <p className="font-semibold text-gray-900 text-xs truncate">
                {task.taskCode || `#${task.id?.slice(0, 6)}`}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Description</p>

            <p className="text-gray-600 text-xs leading-relaxed break-words">
              {task.description || "No description provided for this task."}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Activity History
          </p>

          {(task.history || []).length === 0 ? (
            <p className="text-xs text-gray-400">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {(task.history || []).map((h, i) => (
                <div className="flex gap-3" key={i}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        i === 0
                          ? "bg-gray-900"
                          : "border-2 border-gray-300 bg-white"
                      }`}
                    />

                    {i < (task.history || []).length - 1 && (
                      <div
                        className="w-px flex-1 bg-gray-100 mt-1"
                        style={{ minHeight: "16px" }}
                      />
                    )}
                  </div>

                  <div className="pb-2 min-w-0">
                    <p className="text-xs font-medium text-gray-700 break-words">
                      {h.text}
                    </p>

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

      {/* Footer */}
      {role === "admin" ? (
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
      ) : (
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