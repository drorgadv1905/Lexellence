"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import type { GroupStatus } from "@/lib/types";

const GROUP_STATUS_LABELS: Record<GroupStatus, string> = {
  active: "פעילה",
  forming: "בהקמה",
  inactive: "לא פעילה",
};

const emptyGroup = {
  name: "",
  region: "",
  description: "",
  group_admin_id: "",
  status: "active" as GroupStatus,
  meeting_frequency: "",
  default_meeting_day: "",
  rules: "",
  notes: "",
};

export default function SystemGroupsPage() {
  const { data, addGroup, updateGroup, deleteGroup, getUserById } = useData();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyGroup);

  const groupAdmins = data.users.filter((u) => u.role === "group_admin" || u.role === "super_admin");

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyGroup);
    setShowForm(true);
  };

  const openEdit = (id: string) => {
    const g = data.groups.find((x) => x.id === id);
    if (!g) return;
    setEditingId(id);
    setForm({
      name: g.name,
      region: g.region,
      description: g.description,
      group_admin_id: g.group_admin_id,
      status: g.status,
      meeting_frequency: g.meeting_frequency,
      default_meeting_day: g.default_meeting_day,
      rules: g.rules,
      notes: g.notes,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateGroup(editingId, form);
      showToast("הקבוצה עודכנה בהצלחה");
    } else {
      addGroup(form);
      showToast("הקבוצה נוצרה בהצלחה");
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteGroup(deleteId);
    showToast("הקבוצה נמחקה");
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader
        title="ניהול קבוצות"
        subtitle="יצירה, עריכה ומחיקת קבוצות"
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-5 h-5" />
            קבוצה חדשה
          </button>
        }
      />

      {data.groups.length === 0 ? (
        <EmptyState title="אין קבוצות" />
      ) : (
        <div className="space-y-4">
          {data.groups.map((g) => {
            const admin = getUserById(g.group_admin_id);
            const memberCount = data.users.filter((u) => u.group_id === g.id).length;
            return (
              <Card key={g.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <span className="badge-green">{GROUP_STATUS_LABELS[g.status]}</span>
                    </div>
                    <h3 className="font-bold text-forest-800 text-lg">{g.name}</h3>
                    <p className="text-sm text-forest-600 mt-1">אזור: {g.region}</p>
                    <p className="text-sm text-forest-600">מנהל: {admin?.full_name ?? "—"}</p>
                    <p className="text-sm text-forest-500">חברים: {memberCount} | {g.default_meeting_day} | {g.meeting_frequency}</p>
                    <p className="text-sm text-forest-700 mt-2">{g.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(g.id)} className="btn-secondary btn-sm">
                      <Pencil className="w-4 h-4" />
                      עריכה
                    </button>
                    <button onClick={() => setDeleteId(g.id)} className="btn-danger btn-sm">
                      <Trash2 className="w-4 h-4" />
                      מחיקה
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "עריכת קבוצה" : "קבוצה חדשה"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">שם קבוצה</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">אזור</label>
              <input className="input-field" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} required />
            </div>
            <div>
              <label className="label">מנהל קבוצה</label>
              <select className="input-field" value={form.group_admin_id} onChange={(e) => setForm({ ...form, group_admin_id: e.target.value })} required>
                <option value="">בחר מנהל</option>
                {groupAdmins.map((u) => (
                  <option key={u.id} value={u.id}>{u.full_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">סטטוס</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as GroupStatus })}>
                {Object.entries(GROUP_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">יום מפגש קבוע</label>
              <input className="input-field" value={form.default_meeting_day} onChange={(e) => setForm({ ...form, default_meeting_day: e.target.value })} />
            </div>
            <div>
              <label className="label">תדירות מפגשים</label>
              <input className="input-field" value={form.meeting_frequency} onChange={(e) => setForm({ ...form, meeting_frequency: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">תיאור</label>
            <textarea className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">כללי קבוצה</label>
            <textarea className="input-field" value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} />
          </div>
          <div>
            <label className="label">הערות פנימיות</label>
            <textarea className="input-field" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">{editingId ? "שמירה" : "יצירה"}</button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="מחיקת קבוצה"
        message="האם אתם בטוחים שברצונכם למחוק קבוצה זו? פעולה זו אינה ניתנת לביטול."
        confirmLabel="מחק"
        danger
      />
    </div>
  );
}
