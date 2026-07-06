"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Card, PageHeader } from "@/components/ui/Card";
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
        title="ניהול מסלולי חברות"
        subtitle="תמחור ומסלולי חברות (ללא סליקה)"
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-5 h-5" />
            מסלול חדש
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.membershipPlans.map((plan) => (
          <Card key={plan.id}>
            <div className="flex justify-between items-start">
              <div>
                <span className={`badge ${plan.is_active ? "badge-green" : "badge-gray"}`}>
                  {plan.is_active ? "פעיל" : "לא פעיל"}
                </span>
                <h3 className="font-bold text-forest-800 text-lg mt-2">{plan.name}</h3>
                <p className="text-2xl font-bold text-gold-600 mt-1">₪{plan.price.toLocaleString()}</p>
                <p className="text-sm text-forest-500">{PERIOD_LABELS[plan.period]}</p>
                <p className="text-sm text-forest-700 mt-2">{plan.description}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(plan.id)} className="p-2 hover:bg-cream-200 rounded-lg">
                  <Pencil className="w-4 h-4 text-forest-600" />
                </button>
                <button onClick={() => setDeleteId(plan.id)} className="p-2 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

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
          <button type="submit" className="btn-primary w-full">שמירה</button>
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
