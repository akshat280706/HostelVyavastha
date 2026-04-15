import { useState } from 'react';
import { Bell, Calendar, Pin, Eye } from 'lucide-react';
import { noticesData, getNoticesByCategory, getPinnedNotices } from '../../data/noticesData';

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
  
  const filteredNotices = selectedCategory === 'all' 
    ? noticesData 
    : getNoticesByCategory(selectedCategory);
  
  const pinnedNotices = filteredNotices.filter(n => n.pinned);
  const regularNotices = filteredNotices.filter(n => !n.pinned);
  
  return (
    <div>
      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>
      
      {/* Pinned Notices Section */}
      {pinnedNotices.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Pin size={16} className="text-yellow-400" />
            <h3 className="text-sm font-medium text-gray-300">Pinned Notices</h3>
          </div>
          <div className="space-y-3">
            {pinnedNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 cursor-pointer hover:bg-yellow-500/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold">{notice.title}</h4>
                  <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Pinned</span>
                </div>
                <p className="text-gray-300 text-sm mb-2 line-clamp-2">{notice.content}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {notice.date}
                  </span>
                  <span>By: {notice.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Regular Notices */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Notices</h3>
        {regularNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setSelectedNotice(notice)}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
          >
            <h4 className="text-white font-semibold mb-2">{notice.title}</h4>
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{notice.content}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {notice.date}
              </span>
              <span>By: {notice.author}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-700">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedNotice.title}</h2>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                    <span>{selectedNotice.date}</span>
                    <span>By: {selectedNotice.author}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-300 leading-relaxed">{selectedNotice.content}</p>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}