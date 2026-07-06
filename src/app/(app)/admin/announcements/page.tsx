"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function AdminAnnouncementsPage() {
  const { user } = useAuth();
  const { data, addAnnouncement } = useData();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    show_on_homepage: true,
    is_important: false,
  });

  if (!user?.group_id) return null;

  const announcements = data.announcements
    .filter((a) => a.group_id === user.group_id && a.audience === "specific_group")
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      ...form,
      audience: "specific_group",
      group_id: user.group_id,
      created_by: user.id,
    });
    showToast("ההודעה פורסמה לחברי הקבוצה");
    setShowForm(false);
    setForm({ title: "", content: "", show_on_homepage: true, is_important: false });
  };

  return (
    <div>
      <PageHeader
        title="הודעות לקבוצה"
        subtitle="פרסום עדכונים והודעות לחברי הקבוצה"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            הודעה חדשה
          </button>
        }
      />

      {announcements.length === 0 ? (
        <EmptyState title="אין הודעות" description="פרסמו הודעה ראשונה לחברי הקבוצה" />
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {a.is_important && <span className="badge-red mb-2 inline-block">חשוב</span>}
                  <h3 className="font-bold text-forest-800 text-lg">{a.title}</h3>
                </div>
                <span className="text-sm text-forest-500">{formatDate(a.created_at)}</span>
              </div>
              <p className="mt-3 text-forest-700 whitespace-pre-line">{a.content}</p>
              <div className="mt-3 flex gap-2 text-xs">
                {a.show_on_homepage && <span className="badge-green">מוצג בדף הבית</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="הודעה לקבוצה">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">כותרת</label>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">תוכן</label>
            <textarea className="input-field min-h-[120px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.show_on_homepage} onChange={(e) => setForm({ ...form, show_on_homepage: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm text-forest-700">הצג בדף הבית</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_important} onChange={(e) => setForm({ ...form, is_important: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm text-forest-700">סמן כחשוב</span>
          </label>
          <button type="submit" className="btn-primary w-full">פרסום</button>
        </form>
      </Modal>
    </div>
  );
}
