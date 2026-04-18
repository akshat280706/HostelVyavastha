import { useState } from 'react';
import { complaintsData } from '../../data/complaintsData';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState(complaintsData);
  const [filter, setFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const filteredComplaints = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  const handleStatusUpdate = (id, newStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
    setSelectedComplaint(null);
  };

  const statusStyle = (status) => {
    switch (status) {
      case 'resolved': return { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' };
      case 'in-progress': return { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' };
      default: return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--status-red)';
      case 'medium': return 'var(--status-yellow)';
      default: return 'var(--status-green)';
    }
  };

  const filterBtnStyle = (active) => ({
    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', border: '1px solid', textTransform: 'capitalize', transition: 'all 0.15s ease',
    background: active ? 'var(--accent-blue)' : 'white',
    color: active ? 'white' : 'var(--text-secondary)',
    borderColor: active ? 'var(--accent-blue)' : 'var(--border-medium)',
  });

  return (
    <div>
      <h1 className="page-title">Complaints</h1>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total</div>
          <div className="stat-card-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Pending</div>
          <div className="stat-card-value" style={{ color: 'var(--status-red)' }}>{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">In Progress</div>
          <div className="stat-card-value" style={{ color: 'var(--status-yellow)' }}>{stats.inProgress}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Resolved</div>
          <div className="stat-card-value" style={{ color: 'var(--status-green)' }}>{stats.resolved}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'pending', 'in-progress', 'resolved'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={filterBtnStyle(filter === s)}>{s}</button>
        ))}
      </div>

      <div className="complaints-container">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Room</th>
              <th>Issue</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>
                  <div style={{ fontWeight: '500' }}>{complaint.studentName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>ID: {complaint.studentId}</div>
                </td>
                <td>{complaint.roomNumber}</td>
                <td>
                  <div style={{ fontWeight: '500' }}>{complaint.issue}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{complaint.description.substring(0, 50)}...</div>
                </td>
                <td>{complaint.date}</td>
                <td style={{ fontWeight: '500', color: priorityColor(complaint.priority) }}>
                  {complaint.priority.toUpperCase()}
                </td>
                <td>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '500', ...statusStyle(complaint.status) }}>
                    {complaint.status}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    style={{
                      padding: '4px 12px', borderRadius: '6px', fontSize: '12px',
                      cursor: 'pointer', border: '1px solid var(--border-medium)',
                      background: 'white', color: 'var(--accent-blue)', fontWeight: '500',
                    }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid var(--border-light)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Update Complaint</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{selectedComplaint.issue}</p>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Student: {selectedComplaint.studentName}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Room: {selectedComplaint.roomNumber}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[['pending', 'Mark as Pending', '#fee2e2', '#991b1b'],
                  ['in-progress', 'Mark as In Progress', '#fef3c7', '#92400e'],
                  ['resolved', 'Mark as Resolved', '#d1fae5', '#065f46']
                ].map(([status, label, bg, color]) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedComplaint.id, status)}
                    style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: bg, color, fontWeight: '500', fontSize: '14px' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-light)' }}>
              <button
                onClick={() => setSelectedComplaint(null)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'white', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
