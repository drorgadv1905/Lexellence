"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { EmptyState, PageHeader, RoleBadge, SearchBar } from "@/components/ui/Card";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import {
  MEMBERSHIP_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  ROLE_LABELS,
  type UserRole,
  type MembershipStatus,
  type PaymentStatus,
} from "@/lib/types";

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
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyUser);

  const filtered = useMemo(() => {
    if (!search.trim()) return data.users;
    const q = search.trim();
    return data.users.filter(
      (u) => u.full_name.includes(q) || u.email.includes(q)
    );
  }, [data.users, search]);

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
        subtitle={`${data.users.length} משתמשים`}
        action={
          <button onClick={openCreate} className="btn-gold">
            <Plus className="w-5 h-5" />
            משתמש חדש
          </button>
        }
      />

      <SearchBar value={search} onChange={setSearch} placeholder="חיפוש משתמש..." />

      {filtered.length === 0 ? (
        <EmptyState title="לא נמצאו משתמשים" />
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>שם</th>
                <th>תפקיד</th>
                <th>קבוצה</th>
                <th>סטטוס</th>
                <th className="w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <p className="font-semibold text-forest-900">{u.full_name}</p>
                    <p className="text-xs text-forest-400 mt-0.5" dir="ltr">{u.email}</p>
                  </td>
                  <td><RoleBadge role={u.role} /></td>
                  <td className="text-forest-600">
                    {u.group_id ? getGroupById(u.group_id)?.name : "—"}
                  </td>
                  <td>
                    {u.membership_status === "active" ? (
                      <span className="badge-green">פעיל</span>
                    ) : (
                      <span className="badge-gray">{MEMBERSHIP_STATUS_LABELS[u.membership_status]}</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(u.id)} className="icon-btn-edit" title="עריכה">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(u.id)} className="icon-btn-delete" title="מחיקה">
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
          </div>
          <div>
            <label className="label">הערות פנימיות</label>
            <textarea className="input-field" value={form.internal_notes} onChange={(e) => setForm({ ...form, internal_notes: e.target.value })} />
          </div>
          <button type="submit" className="btn-gold w-full">{editingId ? "שמירה" : "יצירה"}</button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="מחיקת משתמש"
        message="האם אתם בטוחים שברצונכם למחוק משתמש זה?"
        confirmLabel="מחק"
        danger
      />
    </div>
  );
}
