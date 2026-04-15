import { useState } from 'react';
import { noticesData } from '../../data/noticesData';
import { Bell, Edit, Trash2, Pin, Eye } from 'lucide-react';

export default function AdminNotices() {
  const [notices, setNotices] = useState(noticesData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'maintenance',
    pinned: false
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotice = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      author: 'Admin',
      target: 'all'
    };
    setNotices([newNotice, ...notices]);
    setShowForm(false);
    setFormData({ title: '', content: '', category: 'maintenance', pinned: false });
  };
  
  const handleDelete = (id) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };
  
  const handleTogglePin = (id) => {
    setNotices(notices.map(notice =>
      notice.id === id ? { ...notice, pinned: !notice.pinned } : notice
    ));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Manage Notices</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
        >
          + Post New Notice
        </button>
      </div>
      
      {/* Notices List */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-medium">{notice.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{notice.content}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                      {notice.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{notice.date}</td>
                  <td className="py-3 px-4">
                    {notice.pinned ? (
                      <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Pinned</span>
                    ) : (
                      <span className="text-xs text-gray-500">Normal</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleTogglePin(notice.id)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Pin/Unpin"
                      >
                        <Pin size={16} className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create Notice Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-700">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">Create New Notice</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="mess">Mess</option>
                    <option value="event">Event</option>
                    <option value="policy">Policy</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={formData.pinned}
                    onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                  />
                  <label htmlFor="pinned" className="text-sm text-gray-300">Pin this notice</label>
                </div>
              </div>
              <div className="p-6 border-t border-gray-800 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}