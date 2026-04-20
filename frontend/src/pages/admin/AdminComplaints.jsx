import { useState, useEffect } from 'react';
import { complaintService } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    const response = await complaintService.getComplaints({ limit: 100 });
    if (response.success) {
      setComplaints(response.data || []);
    } else {
      toast.error('Failed to load complaints');
    }
    setLoading(false);
  };

  const filteredComplaints = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const response = await complaintService.updateComplaint(id, { status: newStatus });
    if (response.success) {
      toast.success(`Complaint marked as ${newStatus}`);
      fetchComplaints(); // Refresh list
      setSelectedComplaint(null);
    } else {
      toast.error(response.message || 'Failed to update complaint');
    }
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
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  const filterBtnStyle = (active) => ({
    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', border: '1px solid', textTransform: 'capitalize', transition: 'all 0.15s ease',
    background: active ? '#3b82f6' : 'white',
    color: active ? 'white' : '#64748b',
    borderColor: active ? '#3b82f6' : '#e2e8f0',
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading complaints...</div>
      </div>
    );
  }

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
          <div className="stat-card-value" style={{ color: '#ef4444' }}>{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">In Progress</div>
          <div className="stat-card-value" style={{ color: '#f59e0b' }}>{stats.inProgress}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Resolved</div>
          <div className="stat-card-value" style={{ color: '#22c55e' }}>{stats.resolved}</div>
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
                  <div style={{ fontWeight: '500' }}>{complaint.profiles?.name || 'Unknown'}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>ID: {complaint.student_id?.slice(0, 8)}...</div>
                </td>
                <td>{complaint.profiles?.room_number || '—'}</td>
                <td>
                  <div style={{ fontWeight: '500' }}>{complaint.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{complaint.description?.substring(0, 50)}...</div>
                </td>
                <td>{new Date(complaint.created_at).toLocaleDateString()}</td>
                <td style={{ fontWeight: '500', color: priorityColor(complaint.priority) }}>
                  {complaint.priority?.toUpperCase() || 'MEDIUM'}
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
                      cursor: 'pointer', border: '1px solid #e2e8f0',
                      background: 'white', color: '#3b82f6', fontWeight: '500',
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
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '440px', width: '100%' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Update Complaint</h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>{selectedComplaint.title}</p>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Student: {selectedComplaint.profiles?.name}</p>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Room: {selectedComplaint.profiles?.room_number || 'N/A'}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  ['pending', 'Mark as Pending', '#fee2e2', '#991b1b'],
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
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setSelectedComplaint(null)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}
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