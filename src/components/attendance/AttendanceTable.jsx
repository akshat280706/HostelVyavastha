export default function AttendanceTable({ students, toggleStatus }) {
  return (
    <table className="attendance-table">
      <thead>
        <tr className="attendance-table-header-row">
          <th className="attendance-table-header">Name</th>
          <th className="attendance-table-header">Status</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className="attendance-table-row">
            <td className="attendance-table-cell">{student.name}</td>
            <td className="attendance-table-cell">
              <button
                onClick={() => toggleStatus(student.id)}
                className={`status-badge status-badge--${student.status ? "present" : "absent"}`}
              >
                {student.status ? "Present" : "Absent"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}