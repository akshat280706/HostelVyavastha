import { useState } from 'react';
import { complaintsData } from '../../data/complaintsData';
import { AlertCircle, CheckCircle, Clock, User, Home } from 'lucide-react';

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
    resolved: complaints.filter(c => c.status === 'resolved').length
  };
  
  const handleStatusUpdate = (id, newStatus) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === id ? { ...complaint, status: newStatus } : complaint
    ));
    setSelectedComplaint(null);
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-500/10 text-green-400';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-400';
      default: return 'bg-red-500/10 text-red-400';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };
  
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-gray-400">Total Complaints</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-2xl font-bold text-red-400">{stats.pending}</p>
          <p className="text-sm text-gray-400">Pending</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
          <p className="text-sm text-gray-400">In Progress</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
          <p className="text-sm text-gray-400">Resolved</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      
      {/* Complaints Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Student</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Room</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Issue</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-medium">{complaint.studentName}</p>
                      <p className="text-xs text-gray-500">ID: {complaint.studentId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{complaint.roomNumber}</td>
                  <td className="py-3 px-4">
                    <p className="text-white text-sm">{complaint.issue}</p>
                    <p className="text-xs text-gray-500">{complaint.description.substring(0, 50)}...</p>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{complaint.date}</td>
                  <td className={`py-3 px-4 font-medium ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority.toUpperCase()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                      className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600 rounded text-xs transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Update Status Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">Update Complaint</h3>
              <p className="text-gray-400 text-sm mt-1">{selectedComplaint.issue}</p>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">Student: {selectedComplaint.studentName}</p>
                <p className="text-sm text-gray-300">Room: {selectedComplaint.roomNumber}</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusUpdate(selectedComplaint.id, 'pending')}
                  className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                >
                  Mark as Pending
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedComplaint.id, 'in-progress')}
                  className="w-full p-3 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg text-yellow-400 transition-colors"
                >
                  Mark as In Progress
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedComplaint.id, 'resolved')}
                  className="w-full p-3 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
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