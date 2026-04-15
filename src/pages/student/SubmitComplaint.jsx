import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { complaintsData, getComplaintsByStudentId } from '../../data/complaintsData';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function SubmitComplaint() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    issue: '',
    description: '',
    priority: 'medium'
  });
  const [submitted, setSubmitted] = useState(false);
  
  // Get student's complaints from data
  const myComplaints = getComplaintsByStudentId(user?.id || 101);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, this would be an API call
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ issue: '', description: '', priority: 'medium' });
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved': return <CheckCircle size={14} className="text-green-400" />;
      case 'in-progress': return <Clock size={14} className="text-yellow-400" />;
      default: return <AlertCircle size={14} className="text-red-400" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Submit Complaint Form */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Submit New Complaint</h3>
        
        {submitted && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
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
            <select
              className="form-input"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
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
          
          <button type="submit" className="btn-submit w-full">
            Submit Complaint
          </button>
        </form>
      </div>
      
      {/* My Complaints List */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">My Complaints</h3>
        
        {myComplaints.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No complaints submitted yet</p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {myComplaints.map((complaint) => (
              <div key={complaint.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-medium">{complaint.issue}</h4>
                  <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    <span className="ml-1">{complaint.status}</span>
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{complaint.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Submitted: {complaint.date}</span>
                  <span className={`text-xs ${
                    complaint.priority === 'high' ? 'text-red-400' :
                    complaint.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {complaint.priority.toUpperCase()} Priority
                  </span>
                </div>
                {complaint.assignedTo && (
                  <p className="text-xs text-gray-500 mt-2">Assigned to: {complaint.assignedTo}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}