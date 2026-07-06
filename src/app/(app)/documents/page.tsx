"use client";

import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { DOCUMENT_TYPE_LABELS } from "@/lib/types";

export default function DocumentsPage() {
  const { user } = useAuth();
  const { data, getGroupById, getUserById } = useData();

  if (!user) return null;

  const visibleDocs = data.documents.filter(
    (d) => d.group_id === user.group_id || user.role === "super_admin"
  );

  return (
    <div>
      <PageHeader title="מסמכים וסיכומי מפגש" subtitle="צפייה במסמכים, סיכומים וכללים" />

      {visibleDocs.length === 0 ? (
        <EmptyState title="אין מסמכים" description="טרם הועלו מסמכים לקבוצה" />
      ) : (
        <div className="space-y-4">
          {visibleDocs.map((doc) => {
            const group = getGroupById(doc.group_id);
            const uploader = getUserById(doc.uploaded_by);
            return (
              <Card key={doc.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="badge-gold">{DOCUMENT_TYPE_LABELS[doc.type]}</span>
                    <h3 className="font-bold text-forest-800 text-lg mt-2">{doc.title}</h3>
                  </div>
                  <span className="text-sm text-forest-500">{formatDate(doc.created_at)}</span>
                </div>
                <div className="mt-3 text-sm text-forest-600 space-y-1">
                  {group && <p>קבוצה: {group.name}</p>}
                  <p>הועלה על ידי: {uploader?.full_name}</p>
                  {doc.meeting_date && <p>תאריך מפגש: {formatDate(doc.meeting_date)}</p>}
                </div>
                <div className="mt-4 p-4 bg-cream-100 rounded-lg text-forest-700 whitespace-pre-line">
                  {doc.content}
                </div>
                {doc.decisions && (
                  <div className="mt-3">
                    <p className="font-medium text-forest-800">החלטות:</p>
                    <p className="text-forest-700">{doc.decisions}</p>
                  </div>
                )}
                {doc.tasks && (
                  <div className="mt-3">
                    <p className="font-medium text-forest-800">משימות להמשך:</p>
                    <p className="text-forest-700">{doc.tasks}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
