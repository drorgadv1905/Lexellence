"use client";

import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { CANDIDATE_STATUS_LABELS, type CandidateStatus } from "@/lib/types";

export default function AdminCandidatesPage() {
  const { user } = useAuth();
  const { data, updateCandidate, getPracticeAreaName } = useData();
  const { showToast } = useToast();

  if (!user?.group_id) return null;

  const candidates = data.candidates.filter((c) => c.group_id === user.group_id);

  const handleStatusChange = (id: string, status: CandidateStatus) => {
    updateCandidate(id, { status });
    showToast("סטטוס המועמד עודכן");
  };

  return (
    <div>
      <PageHeader title="מועמדים להצטרפות" subtitle="ניהול ואישור מועמדים חדשים" />

      {candidates.length === 0 ? (
        <EmptyState title="אין מועמדים" />
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-forest-800 text-lg">{c.full_name}</h3>
                  <p className="text-sm text-forest-500" dir="ltr">{c.email} | {c.phone}</p>
                </div>
                <span className="badge-gold">{CANDIDATE_STATUS_LABELS[c.status]}</span>
              </div>
              <div className="mt-3 text-sm text-forest-600 space-y-1">
                <p>אזור: {c.region}</p>
                <p>תחומים: {c.practice_areas.map(getPracticeAreaName).join(", ")}</p>
                <p>ותק: {c.years_experience} שנים</p>
                <p>{c.bio}</p>
                <p><span className="font-medium">מחפש:</span> {c.seeking}</p>
                {c.notes && <p><span className="font-medium">הערות:</span> {c.notes}</p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <select
                  className="input-field w-auto"
                  value={c.status}
                  onChange={(e) => handleStatusChange(c.id, e.target.value as CandidateStatus)}
                >
                  {Object.entries(CANDIDATE_STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
