import React from "react";

// ✅ safer hex to rgba (handles #fff also)
function hexToRgba(hex, alpha = 0.03) {
  let value = hex.replace("#", "");

  if (value.length === 3) {
    value = value.split("").map((c) => c + c).join("");
  }

  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ✅ FIXED: no property attached to array
export function makeBarData(solidColor) {
  return {
    data: new Array(120).fill(100),
    solidColor,
  };
}

// ✅ StatCard
export function StatCard({ title, subtitle, value, bars }) {
  const safeBars = bars || makeBarData("#3b82f6");

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-2 pt-3 pb-2 flex justify-between items-start">
        <div>
          <h3 className="text-[11px] font-semibold text-gray-700">{title}</h3>
          <p className="text-[9px] text-gray-400 mt-0.5">{subtitle}</p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 leading-none">
          {value}
        </h2>
      </div>

      <div className="h-14 flex gap-[1px] items-end overflow-visible">
        {safeBars.data.map((_, i) => (
          <div
            key={i}
            className="w-[1px] shrink-0"
            style={{
              height: i === 0 ? "240%" : "100%",
              backgroundImage:
                i === 0
                  ? `linear-gradient(to top,
        ${hexToRgba(safeBars.solidColor, 0.01)} 0%,
        ${hexToRgba(safeBars.solidColor, 0.03)} 8%,
        ${hexToRgba(safeBars.solidColor, 0.08)} 14%,
        ${hexToRgba(safeBars.solidColor, 0.2)} 18%,
        ${safeBars.solidColor} 30%,
        ${safeBars.solidColor} 100%)`
                  : `linear-gradient(to top,
        ${hexToRgba(safeBars.solidColor, 0.01)} 0%,
        ${hexToRgba(safeBars.solidColor, 0.02)} 8%,
        ${hexToRgba(safeBars.solidColor, 0.05)} 18%,
        ${hexToRgba(safeBars.solidColor, 0.12)} 28%,
        ${hexToRgba(safeBars.solidColor, 0.3)} 40%,
        ${hexToRgba(safeBars.solidColor, 0.65)} 60%,
        ${safeBars.solidColor} 100%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ✅ Badge (minor improvement)
export function Badge({ status }) {
  const styles = {
    pending: "bg-orange-50 text-orange-500 border border-orange-200",
    completed: "bg-green-50 text-green-600 border border-green-200",
    progress: "bg-blue-50 text-blue-500 border border-blue-200",
  };

  const label =
    status === "progress"
      ? "In Progress"
      : status
      ? status[0].toUpperCase() + status.slice(1)
      : "Pending";

  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[status] || styles.pending
      }`}
    >
      {label}
    </span>
  );
}

// ✅ Modal (added click outside close)
export function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/25 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center px-5 pt-5 pb-1">
          {title && (
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
          )}

          <button
            onClick={onClose}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-5 pb-5 pt-3">{children}</div>
      </div>
    </div>
  );
}