import { Badge } from "../common/Badge";

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
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
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
                    className="px-4 py-3 text-left text-gray-400 font-medium text-[11px] uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                    {t.taskCode || `#${t.id?.slice(0, 6)}`}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-800 max-w-[180px] truncate">
                    {t.title || "Untitled"}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 max-w-[140px] truncate">
                    {showUpdate
                      ? t.assignedByName || t.assignedBy || "Admin"
                      : t.assignedToName || t.assignedTo || "Not assigned"}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge status={t.status || "pending"} />
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2 flex-nowrap">
                      <button
                        onClick={() => onView?.(t)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors font-medium whitespace-nowrap"
                      >
                        View
                      </button>
                      {showUpdate && (
                        <button
                          onClick={() => onUpdate?.(t)}
                          className="px-3 py-1.5 bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-lg transition-colors font-medium whitespace-nowrap"
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

      {/* ── MOBILE CARD LIST (<md) ── */}
      <div className="md:hidden space-y-2">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-gray-100 rounded-xl p-4"
          >
            {/* Row 1: ID + badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-400">
                {t.taskCode || `#${t.id?.slice(0, 6)}`}
              </span>
              <Badge status={t.status || "pending"} />
            </div>

            {/* Row 2: Title */}
            <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
              {t.title || "Untitled"}
            </p>

            {/* Row 3: Assigned + date */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span className="truncate max-w-[55%]">
                {showUpdate
                  ? `By: ${t.assignedByName || t.assignedBy || "Admin"}`
                  : `To: ${t.assignedToName || t.assignedTo || "Not assigned"}`}
              </span>
              <span className="shrink-0 ml-2">
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>

            {/* Row 4: Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onView?.(t)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-xs font-medium transition-colors"
              >
                View
              </button>
              {showUpdate && (
                <button
                  onClick={() => onUpdate?.(t)}
                  className="flex-1 py-2 bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Update Status
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

