"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { canViewReferral } from "@/lib/permissions";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import {
  REFERRAL_TYPE_LABELS,
  REFERRAL_STATUS_LABELS,
  type ReferralType,
  type ReferralStatus,
} from "@/lib/types";

export default function ReferralsPage() {
  const { user } = useAuth();
  const { data, getUserById, getPracticeAreaName, addReferral } = useData();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    type: "given" as ReferralType,
    related_user_id: "",
    practice_area: "",
    description: "",
    status: "new" as ReferralStatus,
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  if (!user) return null;

  const visibleReferrals = data.referrals.filter((r) => canViewReferral(r, user));

  const groupMembers = data.users.filter(
    (u) => u.group_id === user.group_id && u.id !== user.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReferral({
      ...form,
      created_by: user.id,
      group_id: user.group_id ?? "",
    });
    showToast("ההפניה דווחה בהצלחה");
    setShowForm(false);
    setForm({
      type: "given",
      related_user_id: "",
      practice_area: "",
      description: "",
      status: "new",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  return (
    <div>
      <PageHeader
        title="הפניות ושיתופי פעולה"
        subtitle="דיווח על הפניות ושיתופי פעולה מקצועיים"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            הפניה חדשה
          </button>
        }
      />

      <div className="card mb-6 bg-forest-50 border-forest-200">
        <div className="card-body text-sm text-forest-700">
          {data.systemContent.find((c) => c.key === "referrals_help")?.content}
        </div>
      </div>

      {visibleReferrals.length === 0 ? (
        <EmptyState title="אין הפניות" description="טרם דווחו הפניות" />
      ) : (
        <div className="space-y-4">
          {visibleReferrals.map((ref) => {
            const related = getUserById(ref.related_user_id);
            const creator = getUserById(ref.created_by);
            return (
              <Card key={ref.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="badge-gold">{REFERRAL_TYPE_LABELS[ref.type]}</span>
                    <h3 className="font-bold text-forest-800 mt-2">{ref.description}</h3>
                  </div>
                  <span className="badge-green">{REFERRAL_STATUS_LABELS[ref.status]}</span>
                </div>
                <div className="mt-3 text-sm text-forest-600 space-y-1">
                  <p>חבר קשור: {related?.full_name ?? "—"}</p>
                  <p>תחום: {getPracticeAreaName(ref.practice_area)}</p>
                  <p>תאריך: {formatDate(ref.date)}</p>
                  <p>דווח על ידי: {creator?.full_name}</p>
                  {ref.notes && <p>הערות: {ref.notes}</p>}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="דיווח הפניה / שיתוף פעולה">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">סוג</label>
            <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ReferralType })}>
              {Object.entries(REFERRAL_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">חבר קשור</label>
            <select className="input-field" value={form.related_user_id} onChange={(e) => setForm({ ...form, related_user_id: e.target.value })} required>
              <option value="">בחר חבר</option>
              {groupMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">תחום מקצועי</label>
            <select className="input-field" value={form.practice_area} onChange={(e) => setForm({ ...form, practice_area: e.target.value })} required>
              <option value="">בחר תחום</option>
              {data.practiceAreas.filter((p) => p.is_active).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">תיאור קצר</label>
            <textarea className="input-field min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div>
            <label className="label">תאריך</label>
            <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div>
            <label className="label">הערות</label>
            <textarea className="input-field" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">שמירה</button>
        </form>
      </Modal>
    </div>
  );
}
