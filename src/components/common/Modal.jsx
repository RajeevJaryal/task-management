import { X } from "lucide-react";
export function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md sm:mx-4 max-h-[92dvh] flex flex-col"
      >
        {/* Drag handle (mobile only) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-4 sm:pt-5 pb-1 flex-shrink-0">
          {title && (
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-8 pt-3 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}