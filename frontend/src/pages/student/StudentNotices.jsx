import { useState, useEffect } from 'react';
import { noticeService } from '../../services/api';
import { Calendar, Pin } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StudentNotices() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    const response = await noticeService.getNotices();
    if (response.success) {
      setNotices(response.data || []);
    } else {
      toast.error('Failed to load notices');
    }
    setLoading(false);
  };

  // Get unique categories from notices
  const categories = ['all', ...new Set(notices.map(n => n.category).filter(Boolean))];
  
  const filteredNotices = selectedCategory === 'all' 
    ? notices 
    : notices.filter(n => n.category === selectedCategory);
  
  const pinnedNotices = filteredNotices.filter(n => n.is_important === true);
  const regularNotices = filteredNotices.filter(n => n.is_important !== true);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading notices...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              border: '1px solid',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              background: selectedCategory === cat ? '#3b82f6' : 'white',
              color: selectedCategory === cat ? 'white' : '#64748b',
              borderColor: selectedCategory === cat ? '#3b82f6' : '#e2e8f0',
            }}
          >
            {cat === 'all' ? 'All Notices' : cat.charAt(0).toUpperCase() + cat.slice(1)} ({cat === 'all' ? notices.length : notices.filter(n => n.category === cat).length})
          </button>
        ))}
      </div>

      {/* Pinned Notices Section */}
      {pinnedNotices.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Pin size={15} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Pinned Notices</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pinnedNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                style={{
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: '#fffbeb',
                  border: '1px solid #fcd34d',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef3c7'}
                onMouseLeave={e => e.currentTarget.style.background = '#fffbeb'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px', margin: 0 }}>{notice.title}</h4>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', whiteSpace: 'nowrap' }}>Pinned</span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{notice.content}</p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={11} />{new Date(notice.created_at).toLocaleDateString()}</span>
                  <span>By: {notice.profiles?.name || 'Admin'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Notices Section */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '12px' }}>Recent Notices</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {regularNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              style={{
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: 'white',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <h4 style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px', marginBottom: '6px' }}>{notice.title}</h4>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{notice.content}</p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={11} />{new Date(notice.created_at).toLocaleDateString()}</span>
                <span>By: {notice.profiles?.name || 'Admin'}</span>
              </div>
            </div>
          ))}
          {regularNotices.length === 0 && (
            <p style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No notices available</p>
          )}
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '600px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>{selectedNotice.title}</h2>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#64748b' }}>
                    <span>{new Date(selectedNotice.created_at).toLocaleDateString()}</span>
                    <span>By: {selectedNotice.profiles?.name || 'Admin'}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedNotice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '20px' }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '14px' }}>{selectedNotice.content}</p>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedNotice(null)} className="btn-submit" style={{ padding: '8px 20px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}