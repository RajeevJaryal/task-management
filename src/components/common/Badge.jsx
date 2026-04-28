export function Badge({ status }) {
  const styles = {
    pending:   "bg-orange-50 text-orange-500 border border-orange-200",
    completed: "bg-green-50 text-green-600 border border-green-200",
    progress:  "bg-blue-50 text-blue-500 border border-blue-200",
  };

  const label =
    status === "progress"
      ? "In Progress"
      : status
      ? status[0].toUpperCase() + status.slice(1)
      : "Pending";

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        styles[status] || styles.pending
      }`}
    >
      {label}
    </span>
  );
}

