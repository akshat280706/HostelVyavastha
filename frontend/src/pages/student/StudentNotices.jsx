import { useState } from 'react';
import { Calendar, Pin } from 'lucide-react';
import { noticesData, getNoticesByCategory } from '../../data/noticesData';

export default function StudentNotices() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState(null);

  const categories = [
    { value: 'all', label: 'All Notices', count: noticesData.length },
    { value: 'maintenance', label: 'Maintenance', count: getNoticesByCategory('maintenance').length },
    { value: 'mess', label: 'Mess', count: getNoticesByCategory('mess').length },
    { value: 'event', label: 'Events', count: getNoticesByCategory('event').length },
    { value: 'policy', label: 'Policies', count: getNoticesByCategory('policy').length },
  ];

  const filteredNotices = selectedCategory === 'all' ? noticesData : getNoticesByCategory(selectedCategory);
  const pinnedNotices = filteredNotices.filter(n => n.pinned);
  const regularNotices = filteredNotices.filter(n => !n.pinned);

  const filterBtnStyle = (active) => ({
    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', border: '1px solid', whiteSpace: 'nowrap', transition: 'all 0.15s ease',
    background: active ? 'var(--accent-blue)' : 'white',
    color: active ? 'white' : 'var(--text-secondary)',
    borderColor: active ? 'var(--accent-blue)' : 'var(--border-medium)',
  });

  const noticeCardBase = {
    borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.15s ease',
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button key={cat.value} onClick={() => setSelectedCategory(cat.value)} style={filterBtnStyle(selectedCategory === cat.value)}>
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {pinnedNotices.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Pin size={15} style={{ color: 'var(--status-yellow)' }} />
            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Pinned Notices</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pinnedNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                style={{ ...noticeCardBase, background: '#fffbeb', border: '1px solid #fcd34d' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef3c7'}
                onMouseLeave={e => e.currentTarget.style.background = '#fffbeb'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '15px' }}>{notice.title}</h4>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', whiteSpace: 'nowrap' }}>Pinned</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{notice.content}</p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={11} />{notice.date}</span>
                  <span>By: {notice.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '12px' }}>Recent Notices</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {regularNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              style={{ ...noticeCardBase, background: 'white', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '15px', marginBottom: '6px' }}>{notice.title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{notice.content}</p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={11} />{notice.date}</span>
                <span>By: {notice.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNotice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '600px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid var(--border-light)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>{selectedNotice.title}</h2>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span>{selectedNotice.date}</span>
                    <span>By: {selectedNotice.author}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedNotice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '20px' }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '14px' }}>{selectedNotice.content}</p>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedNotice(null)} className="btn-submit" style={{ padding: '8px 20px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
