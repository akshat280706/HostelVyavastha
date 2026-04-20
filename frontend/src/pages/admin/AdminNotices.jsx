import { useState, useEffect } from 'react';
import { noticeService } from '../../services/api';
import { Trash2, Pin } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'maintenance', is_important: false });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    const response = await noticeService.getNotices({ limit: 100 });
    if (response.success) {
      setNotices(response.data || []);
    } else {
      toast.error('Failed to load notices');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await noticeService.createNotice({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      is_important: formData.is_important
    });
    
    if (response.success) {
      toast.success('Notice created successfully');
      fetchNotices(); // Refresh list
      setShowForm(false);
      setFormData({ title: '', content: '', category: 'maintenance', is_important: false });
    } else {
      toast.error(response.message || 'Failed to create notice');
    }
  };

  const handleDelete = async (id) => {
    const response = await noticeService.deleteNotice(id);
    if (response.success) {
      toast.success('Notice deleted');
      fetchNotices();
    } else {
      toast.error('Failed to delete notice');
    }
  };

  const handleTogglePin = async (id, currentStatus) => {
    const response = await noticeService.updateNotice(id, { is_important: !currentStatus });
    if (response.success) {
      toast.success(`Notice ${!currentStatus ? 'pinned' : 'unpinned'}`);
      fetchNotices();
    } else {
      toast.error('Failed to update notice');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading notices...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Notices</h1>
        <button onClick={() => setShowForm(true)} className="btn-submit" style={{ padding: '8px 18px' }}>
          + Post New Notice
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Title', 'Category', 'Date', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 4 ? 'center' : 'left', padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id} style={{ borderBottom: '1px solid #e2e8f0' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '500', color: '#0f172a' }}>{notice.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>{notice.content}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', textTransform: 'capitalize' }}>
                      {notice.category || 'general'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>{new Date(notice.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {notice.is_important ? (
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}>Pinned</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Normal</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <button onClick={() => handleTogglePin(notice.id, notice.is_important)} title="Pin/Unpin"
                        style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Pin size={16} style={{ color: '#64748b' }} />
                      </button>
                      <button onClick={() => handleDelete(notice.id)} title="Delete"
                        style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Trash2 size={16} style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No notices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '600px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Create New Notice</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Title</label>
                  <input type="text" className="form-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category</label>
                  <select className="form-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="maintenance">Maintenance</option>
                    <option value="mess">Mess</option>
                    <option value="event">Event</option>
                    <option value="policy">Policy</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Content</label>
                  <textarea className="form-textarea" rows="4" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="pinned" checked={formData.is_important} onChange={(e) => setFormData({ ...formData, is_important: e.target.checked })} />
                  <label htmlFor="pinned" style={{ fontSize: '13px', color: '#64748b' }}>Pin this notice (important)</label>
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" style={{ padding: '8px 18px' }}>Post Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}