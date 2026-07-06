"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import type { AnnouncementAudience } from "@/lib/types";

export default function SystemAnnouncementsPage() {
  const { user } = useAuth();
  const { data, addAnnouncement, getGroupById } = useData();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    audience: "all" as AnnouncementAudience,
    group_id: "",
    is_important: false,
    show_on_homepage: true,
  });

  const allAnnouncements = data.announcements
    .filter((a) => a.audience === "all" || a.audience === "group_admins")
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const audienceLabel = (a: AnnouncementAudience, groupId: string | null) => {
    if (a === "all") return "כולם";
    if (a === "group_admins") return "מנהלי קבוצות";
    if (groupId) return getGroupById(groupId)?.name ?? "קבוצה ספציפית";
    return "קבוצה ספציפית";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addAnnouncement({
      title: form.title,
      content: form.content,
      audience: form.audience,
      group_id: form.audience === "specific_group" ? form.group_id : null,
      is_important: form.is_important,
      show_on_homepage: form.show_on_homepage,
      created_by: user.id,
    });
    showToast("הודעת המערכת פורסמה");
    setShowForm(false);
    setForm({ title: "", content: "", audience: "all", group_id: "", is_important: false, show_on_homepage: true });
  };

  return (
    <div>
      <PageHeader
        title="הודעות מערכת"
        subtitle="פרסום הודעות לכל המשתמשים"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            הודעה חדשה
          </button>
        }
      />

      {allAnnouncements.length === 0 ? (
        <EmptyState title="אין הודעות מערכת" />
      ) : (
        <div className="space-y-4">
          {allAnnouncements.map((a) => (
            <Card key={a.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {a.is_important && <span className="badge-red mb-2 inline-block">חשוב</span>}
                  <h3 className="font-bold text-forest-800 text-lg">{a.title}</h3>
                  <span className="badge-gray mt-1 inline-block">{audienceLabel(a.audience, a.group_id)}</span>
                </div>
                <span className="text-sm text-forest-500">{formatDate(a.created_at)}</span>
              </div>
              <p className="mt-3 text-forest-700 whitespace-pre-line">{a.content}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="הודעת מערכת">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">כותרת</label>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">תוכן</label>
            <textarea className="input-field min-h-[120px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <div>
            <label className="label">קהל יעד</label>
            <select className="input-field" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as AnnouncementAudience })}>
              <option value="all">כולם</option>
              <option value="group_admins">מנהלי קבוצות</option>
              <option value="specific_group">קבוצה ספציפית</option>
            </select>
          </div>
          {form.audience === "specific_group" && (
            <div>
              <label className="label">קבוצה</label>
              <select className="input-field" value={form.group_id} onChange={(e) => setForm({ ...form, group_id: e.target.value })} required>
                <option value="">בחר קבוצה</option>
                {data.groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}
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
