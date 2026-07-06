"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/Card";

export default function SystemContentPage() {
  const { data, updateSystemContent } = useData();
  const { showToast } = useToast();

  const [edits, setEdits] = useState<Record<string, string>>({});

  const getContent = (key: string) => {
    const item = data.systemContent.find((c) => c.key === key);
    return edits[key] ?? item?.content ?? "";
  };

  const handleSave = (key: string) => {
    const content = edits[key];
    if (content !== undefined) {
      updateSystemContent(key, content);
      showToast("התוכן עודכן בהצלחה");
      setEdits((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  return (
    <div>
      <PageHeader title="ניהול תוכן כללי" subtitle="עריכת טקסטים באפליקציה" />

      <div className="space-y-6 max-w-3xl">
        {data.systemContent.map((item) => (
          <div key={item.key} className="card">
            <div className="card-body space-y-3">
              <h3 className="font-bold text-forest-800">{item.title}</h3>
              <textarea
                className="input-field min-h-[120px]"
                value={getContent(item.key)}
                onChange={(e) => setEdits({ ...edits, [item.key]: e.target.value })}
              />
              {edits[item.key] !== undefined && (
                <button onClick={() => handleSave(item.key)} className="btn-primary btn-sm">
                  <Save className="w-4 h-4" />
                  שמירה
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
