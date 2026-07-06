"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/Modal";

export default function SystemPracticeAreasPage() {
  const { data, addPracticeArea, updatePracticeArea, deletePracticeArea } = useData();
  const { showToast } = useToast();
  const [newName, setNewName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addPracticeArea(newName.trim());
    showToast("תחום עיסוק נוסף");
    setNewName("");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deletePracticeArea(deleteId);
    showToast("תחום עיסוק נמחק");
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader title="ניהול תחומי עיסוק" subtitle="הוספה, עריכה ומחיקת תחומים" />

      <form onSubmit={handleAdd} className="card mb-6">
        <div className="card-body flex flex-col sm:flex-row gap-3">
          <input
            className="input-field flex-1"
            placeholder="שם תחום עיסוק חדש..."
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
        {data.practiceAreas.map((pa) => (
          <div key={pa.id} className="card">
            <div className="card-body flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={pa.is_active}
                  onChange={(e) => updatePracticeArea(pa.id, { is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <input
                  className="input-field flex-1"
                  value={pa.name}
                  onChange={(e) => updatePracticeArea(pa.id, { name: e.target.value })}
                />
              </div>
              <button onClick={() => setDeleteId(pa.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
        title="מחיקת תחום עיסוק"
        message="האם אתם בטוחים? תחום זה עלול להיות משויך למשתמשים קיימים."
        confirmLabel="מחק"
        danger
      />
    </div>
  );
}
