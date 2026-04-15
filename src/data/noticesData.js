export const noticesData = [
  { id: 1, title: 'Hostel Maintenance', content: 'Routine maintenance will be conducted on Sunday from 9 AM to 5 PM. Please cooperate.', date: '2026-04-05', category: 'maintenance', pinned: true, author: 'Chief Warden', target: 'all' },
  { id: 2, title: 'Mess Menu Update', content: 'New mess menu has been uploaded for April 2026. Special items added for weekends.', date: '2026-04-03', category: 'mess', pinned: false, author: 'Mess Committee', target: 'all' },
  { id: 3, title: 'Electricity Schedule', content: 'Power backup testing on Saturday (April 12). Expect minor interruptions between 10 AM - 12 PM.', date: '2026-04-01', category: 'facility', pinned: false, author: 'Maintenance Dept', target: 'all' },
  { id: 4, title: 'Annual Day Celebrations', content: 'Hostel Annual Day will be celebrated on April 25. Register for participation by April 20.', date: '2026-03-28', category: 'event', pinned: true, author: 'Cultural Committee', target: 'all' },
  { id: 5, title: 'Guest Entry Policy Update', content: 'New guest entry timings: 8 AM - 8 PM. All guests must register at security desk.', date: '2026-03-25', category: 'policy', pinned: false, author: 'Security Office', target: 'all' },
];

export const getNoticesByCategory = (category) => noticesData.filter(notice => notice.category === category);
export const getPinnedNotices = () => noticesData.filter(notice => notice.pinned);