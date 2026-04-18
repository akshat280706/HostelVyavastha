import ComplaintCard from "./ComplaintCard";

export default function ComplaintList({ complaints }) {
  return (
    <div className="complaint-list">
      {complaints.map((c) => (
        <ComplaintCard key={c.id} complaint={c} />
      ))}
    </div>
  );
}