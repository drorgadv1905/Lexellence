"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { EmptyState, PageHeader } from "@/components/ui/Card";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { PERIOD_LABELS, type MembershipPeriod } from "@/lib/types";

const emptyPlan = {
  name: "",
  price: 0,
  period: "yearly" as MembershipPeriod,
  description: "",
  is_active: true,
  internal_notes: "",
};

export default function SystemMembershipPlansPage() {
  const { data, addMembershipPlan, updateMembershipPlan, deleteMembershipPlan } = useData();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPlan);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyPlan);
    setShowForm(true);
  };

  const openEdit = (id: string) => {
    const p = data.membershipPlans.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setForm({
      name: p.name,
      price: p.price,
      period: p.period,
      description: p.description,
      is_active: p.is_active,
      internal_notes: p.internal_notes,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMembershipPlan(editingId, form);
      showToast("מסלול החברות עודכן");
    } else {
      addMembershipPlan(form);
      showToast("מסלול חברות נוסף");
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMembershipPlan(deleteId);
    showToast("מסלול נמחק");
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader
        title="מסלולי חברות"
        subtitle="ניהול מסלולים ותמחור"
        action={
          <button onClick={openCreate} className="btn-gold">
            <Plus className="w-5 h-5" />
            מסלול חדש
          </button>
        }
      />

      <div className="alert-info">
        אין סליקה אוטומטית בשלב זה. סטטוס תשלום מנוהל ידנית בפרופיל המשתמש.
      </div>

      {data.membershipPlans.length === 0 ? (
        <EmptyState title="אין מסלולי חברות" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.membershipPlans.map((plan) => (
            <div key={plan.id} className="card relative">
              <div className="card-body">
                <div className="absolute top-4 left-4 flex gap-1">
                  <button onClick={() => openEdit(plan.id)} className="icon-btn-edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(plan.id)} className="icon-btn-delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-forest-900 text-lg mb-3">{plan.name}</h3>
                <p className="text-3xl font-bold text-[#c49645]">₪{plan.price.toLocaleString()}</p>
                <p className="text-sm text-forest-500 mb-3">{PERIOD_LABELS[plan.period]}</p>
                <p className="text-sm text-forest-600 mb-4">{plan.description}</p>
                <span className={plan.is_active ? "badge-green" : "badge-gray"}>
                  {plan.is_active ? "פעיל" : "לא פעיל"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "עריכת מסלול" : "מסלול חדש"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">שם מסלול</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">מחיר (₪)</label>
              <input type="number" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required min={0} />
            </div>
            <div>
              <label className="label">תקופה</label>
              <select className="input-field" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value as MembershipPeriod })}>
                {Object.entries(PERIOD_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">תיאור</label>
            <textarea className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">הערות פנימיות</label>
            <textarea className="input-field" value={form.internal_notes} onChange={(e) => setForm({ ...form, internal_notes: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm text-forest-700">מסלול פעיל</span>
          </label>
          <button type="submit" className="btn-gold w-full">שמירה</button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="מחיקת מסלול"
        message="האם אתם בטוחים שברצונכם למחוק מסלול זה?"
        confirmLabel="מחק"
        danger
      />
    </div>
  );
}
