export default function ActivityFeed({ title, items, renderItem }) {
  return (
    <div className="activity-feed">
      <h3 className="activity-feed-title">{title}</h3>
      <div className="activity-feed-list">
        {items.map((item, idx) => (
          <div key={idx}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}