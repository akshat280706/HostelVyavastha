export default function NoticeCard({ notice }) {
  return (
    <div className="notice-card">
      <h4 className="notice-card-title">{notice.title}</h4>
      <p className="notice-card-content">{notice.content}</p>
      <p className="notice-card-date">{notice.date}</p>
    </div>
  );
}