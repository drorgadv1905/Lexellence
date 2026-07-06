"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { EmptyState, PageHeader } from "@/components/ui/Card";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import {
  ROLE_LABELS,
  MEMBERSHIP_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type UserRole,
  type MembershipStatus,
  type PaymentStatus,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";

const emptyUser = {
  full_name: "",
  email: "",
  phone: "",
  password: "member123",
  role: "member" as UserRole,
  group_id: "",
  firm_name: "",
  title: "",
  years_experience: 0,
  practice_areas: [] as string[],
  region: "",
  bio: "",
  website: "",
  linkedin: "",
  profile_image: "",
  membership_status: "active" as MembershipStatus,
  payment_status: "pending" as PaymentStatus,
  referral_seeking: "",
  collaboration_interests: "",
  internal_notes: "",
};

export default function SystemUsersPage() {
  const { data, addUser, updateUser, deleteUser, getGroupById } = useData();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyUser);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyUser);
    setShowForm(true);
  };

  const openEdit = (id: string) => {
    const u = data.users.find((x) => x.id === id);
    if (!u) return;
    setEditingId(id);
    setForm({
      full_name: u.full_name,
      email: u.email,
      phone: u.phone,
      password: u.password,
      role: u.role,
      group_id: u.group_id ?? "",
      firm_name: u.firm_name,
      title: u.title,
      years_experience: u.years_experience,
      practice_areas: u.practice_areas,
      region: u.region,
      bio: u.bio,
      website: u.website,
      linkedin: u.linkedin,
      profile_image: u.profile_image,
      membership_status: u.membership_status,
      payment_status: u.payment_status,
      referral_seeking: u.referral_seeking,
      collaboration_interests: u.collaboration_interests,
      internal_notes: u.internal_notes,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, group_id: form.group_id || null };
    if (editingId) {
      updateUser(editingId, payload);
      showToast("המשתמש עודכן בהצלחה");
    } else {
      addUser(payload);
      showToast("המשתמש נוצר בהצלחה");
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteUser(deleteId);
    showToast("המשתמש נמחק");
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader
        title="ניהול משתמשים"
        subtitle="יצירה, עריכה ומחיקת משתמשים"
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-5 h-5" />
            משתמש חדש
          </button>
        }
      />

      {data.users.length === 0 ? (
        <EmptyState title="אין משתמשים" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full card">
            <thead>
              <tr className="border-b border-cream-300 text-right">
                <th className="p-4 text-sm font-semibold text-forest-700">שם</th>
                <th className="p-4 text-sm font-semibold text-forest-700">אימייל</th>
                <th className="p-4 text-sm font-semibold text-forest-700">תפקיד</th>
                <th className="p-4 text-sm font-semibold text-forest-700">קבוצה</th>
                <th className="p-4 text-sm font-semibold text-forest-700">סטטוס</th>
                <th className="p-4 text-sm font-semibold text-forest-700">תשלום</th>
                <th className="p-4 text-sm font-semibold text-forest-700">הצטרפות</th>
                <th className="p-4 text-sm font-semibold text-forest-700">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="border-b border-cream-200 last:border-0 hover:bg-cream-50">
                  <td className="p-4 text-sm font-medium text-forest-800">{u.full_name}</td>
                  <td className="p-4 text-sm text-forest-600" dir="ltr">{u.email}</td>
                  <td className="p-4"><span className="badge-green">{ROLE_LABELS[u.role]}</span></td>
                  <td className="p-4 text-sm text-forest-600">{u.group_id ? getGroupById(u.group_id)?.name : "—"}</td>
                  <td className="p-4"><span className="badge-gray">{MEMBERSHIP_STATUS_LABELS[u.membership_status]}</span></td>
                  <td className="p-4 text-sm text-forest-600">{PAYMENT_STATUS_LABELS[u.payment_status]}</td>
                  <td className="p-4 text-sm text-forest-500">{formatDate(u.created_at)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u.id)} className="btn-secondary btn-sm">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(u.id)} className="btn-danger btn-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "עריכת משתמש" : "משתמש חדש"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">שם מלא</label>
              <input className="input-field" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div>
              <label className="label">אימייל</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required dir="ltr" />
            </div>
            <div>
              <label className="label">טלפון</label>
              <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
            </div>
            {!editingId && (
              <div>
                <label className="label">סיסמה</label>
                <input type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required dir="ltr" />
              </div>
            )}
            <div>
              <label className="label">תפקיד</label>
              <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">קבוצה</label>
              <select className="input-field" value={form.group_id} onChange={(e) => setForm({ ...form, group_id: e.target.value })}>
                <option value="">ללא קבוצה</option>
                {data.groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">סטטוס חברות</label>
              <select className="input-field" value={form.membership_status} onChange={(e) => setForm({ ...form, membership_status: e.target.value as MembershipStatus })}>
                {Object.entries(MEMBERSHIP_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">סטטוס תשלום</label>
              <select className="input-field" value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value as PaymentStatus })}>
                {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">אזור</label>
              <select className="input-field" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                <option value="">בחר אזור</option>
                {data.regions.filter((r) => r.is_active).map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">שם משרד</label>
              <input className="input-field" value={form.firm_name} onChange={(e) => setForm({ ...form, firm_name: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">הערות פנימיות</label>
            <textarea className="input-field" value={form.internal_notes} onChange={(e) => setForm({ ...form, internal_notes: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">{editingId ? "שמירה" : "יצירה"}</button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="מחיקת משתמש"
        message="האם אתם בטוחים שברצונכם למחוק משתמש זה? פעולה זו אינה ניתנת לביטול."
        confirmLabel="מחק"
        danger
      />
    </div>
  );
}
