import { useState } from "react";
import { Modal } from "../common/Modal";
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
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mt-1.5 mb-4 min-h-[80px] text-sm outline-none focus:border-[#5b55d9] resize-none placeholder:text-gray-300"
          placeholder="Briefly describe what needs to be done"
          value={f.description}
          onChange={(e) => setF({ ...f, description: e.target.value })}
        />

        <label className="text-xs font-semibold text-gray-700">Assign to</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mt-1.5 mb-5 text-sm outline-none focus:border-[#5b55d9] text-gray-700"
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
          <button
            type="submit"
            className="py-2.5 text-sm bg-[#5b55d9] hover:bg-[#4e49c4] text-white rounded-lg transition-colors"
          >
            {task ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


