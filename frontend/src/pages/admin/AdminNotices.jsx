import { useState } from 'react';
import { noticesData } from '../../data/noticesData';
import { Trash2, Pin } from 'lucide-react';

export default function AdminNotices() {
  const [notices, setNotices] = useState(noticesData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'maintenance', pinned: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotice = { id: Date.now(), ...formData, date: new Date().toISOString().split('T')[0], author: 'Admin', target: 'all' };
    setNotices([newNotice, ...notices]);
    setShowForm(false);
    setFormData({ title: '', content: '', category: 'maintenance', pinned: false });
  };

  const handleDelete = (id) => setNotices(notices.filter(n => n.id !== id));
  const handleTogglePin = (id) => setNotices(notices.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Notices</h1>
        <button onClick={() => setShowForm(true)} className="btn-submit" style={{ padding: '8px 18px' }}>
          + Post New Notice
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-light)' }}>
                {['Title', 'Category', 'Date', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 4 ? 'center' : 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id} style={{ borderBottom: '1px solid var(--border-light)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{notice.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>{notice.content}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: 'var(--text-secondary)', border: '1px solid var(--border-light)', textTransform: 'capitalize' }}>
                      {notice.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>{notice.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {notice.pinned ? (
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}>Pinned</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Normal</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <button onClick={() => handleTogglePin(notice.id)} title="Pin/Unpin"
                        style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Pin size={16} style={{ color: 'var(--text-secondary)' }} />
                      </button>
                      <button onClick={() => handleDelete(notice.id)} title="Delete"
                        style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Trash2 size={16} style={{ color: 'var(--status-red)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '600px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid var(--border-light)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>Create New Notice</h3>
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
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Content</label>
                  <textarea className="form-textarea" rows="4" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="pinned" checked={formData.pinned} onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })} />
                  <label htmlFor="pinned" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pin this notice</label>
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'white', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}
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
