import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { complaintService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function SubmitComplaint() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    type: 'Plumbing',
    priority: 'medium' 
  });
  const [submitting, setSubmitting] = useState(false);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    setLoading(true);
    const response = await complaintService.getComplaints();
    if (response.success) {
      const userComplaints = response.data?.filter(c => c.student_id === user?.id) || [];
      setMyComplaints(userComplaints);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Log what we're sending
    console.log('Sending complaint:', formData);
    
    const response = await complaintService.createComplaint({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priority: formData.priority
    });
    
    console.log('Response:', response);
    
    if (response.success) {
      toast.success('Complaint submitted successfully!');
      setFormData({ 
        title: '', 
        description: '', 
        type: 'Plumbing', 
        priority: 'medium' 
      });
      fetchMyComplaints();
    } else {
      toast.error(response.message || 'Failed to submit complaint');
    }
    setSubmitting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle size={14} style={{ color: '#22c55e' }} />;
      case 'in-progress': return <Clock size={14} style={{ color: '#f59e0b' }} />;
      default: return <AlertCircle size={14} style={{ color: '#ef4444' }} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'resolved': return { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' };
      case 'in-progress': return { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' };
      default: return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'urgent': return '#dc2626';
      case 'medium': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading your complaints...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Submit Complaint Form */}
      <div className="form-card">
        <h3 style={{ marginBottom: '16px' }}>Submit New Complaint</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={submitting}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Complaint Type</label>
            <select 
              className="form-input" 
              value={formData.type} 
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              disabled={submitting}
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Furniture">Furniture</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Food">Food</option>
              <option value="Internet">Internet</option>
              <option value="Others">Others</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select 
              className="form-input" 
              value={formData.priority} 
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              disabled={submitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
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
              disabled={submitting}
            />
          </div>
          
          <button type="submit" className="btn-submit full-width" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>

      {/* My Complaints List */}
      <div className="form-card">
        <h3 style={{ marginBottom: '16px' }}>My Complaints ({myComplaints.length})</h3>

        {myComplaints.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '32px 0', fontSize: '14px' }}>
            No complaints submitted yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
            {myComplaints.map((complaint) => (
              <div key={complaint.id} style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontWeight: '500', color: '#0f172a', fontSize: '14px', margin: 0 }}>{complaint.title}</h4>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    ...getStatusStyle(complaint.status)
                  }}>
                    {getStatusIcon(complaint.status)} {complaint.status}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', marginTop: '8px' }}>{complaint.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748b' }}>Submitted: {new Date(complaint.created_at).toLocaleDateString()}</span>
                  <span style={{ fontWeight: '500', color: priorityColor(complaint.priority), textTransform: 'uppercase' }}>
                    {complaint.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}