"use client";

import { useState } from "react";
import { Plus, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import {
  REQUEST_STATUS_LABELS,
  type RequestUrgency,
  type RequestVisibility,
} from "@/lib/types";

export default function RequestsPage() {
  const { user } = useAuth();
  const { data, getUserById, getPracticeAreaName, addRequest, addRequestComment } = useData();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [commentModal, setCommentModal] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    practice_area: "",
    urgency: "normal" as RequestUrgency,
    visibility: "my_group" as RequestVisibility,
  });

  if (!user) return null;

  const visibleRequests = data.requests.filter(
    (r) =>
      r.visibility === "all_forum" ||
      (r.visibility === "my_group" && r.group_id === user.group_id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      ...form,
      status: "open",
      created_by: user.id,
      group_id: user.group_id ?? "",
    });
    showToast("הבקשה פורסמה בהצלחה");
    setShowForm(false);
    setForm({ title: "", description: "", practice_area: "", urgency: "normal", visibility: "my_group" });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentModal) return;
    addRequestComment({ request_id: commentModal, user_id: user.id, comment });
    showToast("התגובה נוספה");
    setComment("");
    setCommentModal(null);
  };

  return (
    <div>
      <PageHeader
        title="בקשות מקצועיות"
        subtitle="פרסום צרכים ובקשות לשיתוף פעולה"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            בקשה מקצועית חדשה
          </button>
        }
      />

      {visibleRequests.length === 0 ? (
        <EmptyState title="אין בקשות" description="פרסמו בקשה מקצועית חדשה" />
      ) : (
        <div className="space-y-4">
          {visibleRequests.map((req) => {
            const author = getUserById(req.created_by);
            const comments = data.requestComments.filter((c) => c.request_id === req.id);
            return (
              <Card key={req.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-forest-800 text-lg">{req.title}</h3>
                    <p className="text-sm text-forest-500 mt-1">{author?.full_name}</p>
                  </div>
                  <div className="flex gap-2">
                    {req.urgency === "urgent" && <span className="badge-red">דחוף</span>}
                    <span className="badge-green">{REQUEST_STATUS_LABELS[req.status]}</span>
                  </div>
                </div>
                <p className="mt-3 text-forest-700">{req.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  <span className="badge-gray">{getPracticeAreaName(req.practice_area)}</span>
                  <span className="text-forest-500">{formatDate(req.created_at)}</span>
                </div>

                {comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-cream-300">
                    <p className="text-sm font-medium text-forest-700 mb-2">תגובות ({comments.length})</p>
                    {comments.map((c) => {
                      const commenter = getUserById(c.user_id);
                      return (
                        <div key={c.id} className="bg-cream-100 rounded-lg p-3 mb-2 text-sm">
                          <p className="font-medium text-forest-800">{commenter?.full_name}</p>
                          <p className="text-forest-700 mt-1">{c.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() => setCommentModal(req.id)}
                  className="btn-secondary btn-sm mt-3"
                >
                  <MessageCircle className="w-4 h-4" />
                  הגיבו
                </button>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="בקשה מקצועית חדשה">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">כותרת</label>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">תחום</label>
            <select className="input-field" value={form.practice_area} onChange={(e) => setForm({ ...form, practice_area: e.target.value })} required>
              <option value="">בחר תחום</option>
              {data.practiceAreas.filter((p) => p.is_active).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">תיאור</label>
            <textarea className="input-field min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div>
            <label className="label">רמת דחיפות</label>
            <select className="input-field" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value as RequestUrgency })}>
              <option value="normal">רגיל</option>
              <option value="urgent">דחוף</option>
            </select>
          </div>
          <div>
            <label className="label">פרסום</label>
            <select className="input-field" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as RequestVisibility })}>
              <option value="my_group">רק לקבוצה שלי</option>
              <option value="all_forum">לכל הפורום</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">פרסום</button>
        </form>
      </Modal>

      <Modal isOpen={!!commentModal} onClose={() => setCommentModal(null)} title="הוספת תגובה">
        <form onSubmit={handleComment} className="space-y-4">
          <textarea className="input-field min-h-[100px]" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="כתבו תגובה..." required />
          <button type="submit" className="btn-primary w-full">שליחה</button>
        </form>
      </Modal>
    </div>
  );
}
