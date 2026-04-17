import { useState } from "react";

export default function NoticeForm({ addNotice }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addNotice({ title, content, date: new Date().toISOString().slice(0, 10) });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="notice-form">
      <h3 className="notice-form-title">Create Notice</h3>
      <div className="notice-form-field">
        <input
          className="notice-form-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="notice-form-field">
        <textarea
          className="notice-form-textarea"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="notice-form-actions">
        <button type="submit" className="btn btn--primary">
          Add Notice
        </button>
      </div>
    </form>
  );
}