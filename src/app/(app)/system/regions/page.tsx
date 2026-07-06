"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/Modal";

export default function SystemRegionsPage() {
  const { data, addRegion, updateRegion, deleteRegion } = useData();
  const { showToast } = useToast();
  const [newName, setNewName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addRegion(newName.trim());
    showToast("אזור נוסף");
    setNewName("");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteRegion(deleteId);
    showToast("אזור נמחק");
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader title="ניהול אזורים" subtitle="הוספה, עריכה ומחיקת אזורי פעילות" />

      <form onSubmit={handleAdd} className="card mb-6">
        <div className="card-body flex flex-col sm:flex-row gap-3">
          <input
            className="input-field flex-1"
            placeholder="שם אזור חדש..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            <Plus className="w-5 h-5" />
            הוספה
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.regions.map((r) => (
          <div key={r.id} className="card">
            <div className="card-body flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={r.is_active}
                  onChange={(e) => updateRegion(r.id, { is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <input
                  className="input-field flex-1"
                  value={r.name}
                  onChange={(e) => updateRegion(r.id, { name: e.target.value })}
                />
              </div>
              <button onClick={() => setDeleteId(r.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="מחיקת אזור"
        message="האם אתם בטוחים? אזור זה עלול להיות משויך למשתמשים קיימים."
        confirmLabel="מחק"
        danger
      />
    </div>
  );
}
