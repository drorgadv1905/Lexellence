"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function AdminSummariesPage() {
  const { user } = useAuth();
  const { data, addDocument } = useData();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    meeting_date: "",
    content: "",
    decisions: "",
    tasks: "",
  });

  if (!user?.group_id) return null;

  const summaries = data.documents
    .filter((d) => d.group_id === user.group_id && d.type === "meeting_summary")
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      title: form.title,
      type: "meeting_summary",
      group_id: user.group_id!,
      content: form.content,
      file_url: "",
      uploaded_by: user.id,
      meeting_date: form.meeting_date,
      decisions: form.decisions,
      tasks: form.tasks,
    });
    showToast("סיכום המפגש הועלה בהצלחה");
    setShowForm(false);
    setForm({ title: "", meeting_date: "", content: "", decisions: "", tasks: "" });
  };

  return (
    <div>
      <PageHeader
        title="סיכומי מפגש"
        subtitle="העלאת סיכומים, החלטות ומשימות"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            סיכום חדש
          </button>
        }
      />

      {summaries.length === 0 ? (
        <EmptyState title="אין סיכומים" description="העלו סיכום מפגש ראשון" />
      ) : (
        <div className="space-y-4">
          {summaries.map((doc) => (
            <Card key={doc.id}>
              <h3 className="font-bold text-forest-800 text-lg">{doc.title}</h3>
              {doc.meeting_date && (
                <p className="text-sm text-forest-500 mt-1">תאריך מפגש: {formatDate(doc.meeting_date)}</p>
              )}
              <div className="mt-3 p-4 bg-cream-100 rounded-lg text-forest-700 whitespace-pre-line">{doc.content}</div>
              {doc.decisions && (
                <div className="mt-3">
                  <p className="font-medium text-forest-800">החלטות:</p>
                  <p className="text-forest-700">{doc.decisions}</p>
                </div>
              )}
              {doc.tasks && (
                <div className="mt-3">
                  <p className="font-medium text-forest-800">משימות להמשך:</p>
                  <p className="text-forest-700">{doc.tasks}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="העלאת סיכום מפגש" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">כותרת</label>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">תאריך מפגש</label>
            <input type="date" className="input-field" value={form.meeting_date} onChange={(e) => setForm({ ...form, meeting_date: e.target.value })} required />
          </div>
          <div>
            <label className="label">סיכום טקסטואלי</label>
            <textarea className="input-field min-h-[120px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <div>
            <label className="label">החלטות</label>
            <textarea className="input-field" value={form.decisions} onChange={(e) => setForm({ ...form, decisions: e.target.value })} />
          </div>
          <div>
            <label className="label">משימות להמשך</label>
            <textarea className="input-field" value={form.tasks} onChange={(e) => setForm({ ...form, tasks: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">העלאה</button>
        </form>
      </Modal>
    </div>
  );
}
