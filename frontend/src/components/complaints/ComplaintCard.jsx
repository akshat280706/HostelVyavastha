export default function ComplaintCard({ complaint }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <div className="flex justify-between">
        <h4 className="text-white">{complaint.issue}</h4>
        <span
          className={`text-xs px-2 py-1 rounded ${
            complaint.status === "resolved"
              ? "bg-green-600"
              : "bg-yellow-600"
          }`}
        >
          {complaint.status}
        </span>
      </div>
      <p className="text-gray-400 text-sm mt-2">{complaint.description}</p>
      <p className="text-gray-500 text-xs mt-2">{complaint.student}</p>
    </div>
  );
}