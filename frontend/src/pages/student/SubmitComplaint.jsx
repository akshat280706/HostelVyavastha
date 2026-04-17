import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { complaintsData, getComplaintsByStudentId } from '../../data/complaintsData';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function SubmitComplaint() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ issue: '', description: '', priority: 'medium' });
  const [submitted, setSubmitted] = useState(false);

  const myComplaints = getComplaintsByStudentId(user?.id || 101);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ issue: '', description: '', priority: 'medium' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle size={13} style={{ color: 'var(--status-green)' }} />;
      case 'in-progress': return <Clock size={13} style={{ color: 'var(--status-yellow)' }} />;
      default: return <AlertCircle size={13} style={{ color: 'var(--status-red)' }} />;
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
      case 'high': return 'var(--status-red)';
      case 'medium': return 'var(--status-yellow)';
      default: return 'var(--status-green)';
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div className="form-card">
        <h3 style={{ marginBottom: '16px' }}>Submit New Complaint</h3>

        {submitted && (
          <div style={{ marginBottom: '16px', padding: '12px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', color: '#065f46', fontSize: '13px' }}>
            Complaint submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Brief description of the issue"
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-input" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              className="form-textarea"
              placeholder="Provide details about the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
            />
          </div>
          <button type="submit" className="btn-submit full-width">Submit Complaint</button>
        </form>
      </div>

      <div className="form-card">
        <h3 style={{ marginBottom: '16px' }}>My Complaints</h3>

        {myComplaints.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '32px 0', fontSize: '14px' }}>No complaints submitted yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '440px', overflowY: 'auto' }}>
            {myComplaints.map((complaint) => (
              <div key={complaint.id} style={{ padding: '14px', background: 'var(--bg-surface-hover)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h4 style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '14px' }}>{complaint.issue}</h4>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: '500', ...statusStyle(complaint.status) }}>
                    {getStatusIcon(complaint.status)} {complaint.status}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{complaint.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Submitted: {complaint.date}</span>
                  <span style={{ fontWeight: '500', color: priorityColor(complaint.priority) }}>{complaint.priority.toUpperCase()} Priority</span>
                </div>
                {complaint.assignedTo && (
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>Assigned to: {complaint.assignedTo}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
