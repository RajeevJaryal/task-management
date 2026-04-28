import { Modal } from "../common/Modal";
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