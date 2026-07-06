"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Avatar, EmptyState, PageHeader } from "@/components/ui/Card";
import { MEMBERSHIP_STATUS_LABELS, type MembershipStatus } from "@/lib/types";

export default function AdminMembersPage() {
  const { user } = useAuth();
  const { data, updateUser, getPracticeAreaName } = useData();
  const { showToast } = useToast();

  if (!user?.group_id) return null;

  const members = data.users.filter((u) => u.group_id === user.group_id);

  const handleStatusChange = (userId: string, status: MembershipStatus) => {
    updateUser(userId, { membership_status: status });
    showToast("סטטוס החבר עודכן");
  };

  return (
    <div>
      <PageHeader title="ניהול חברי קבוצה" subtitle="עריכת סטטוס וניהול חברים" />

      {members.length === 0 ? (
        <EmptyState title="אין חברים בקבוצה" />
      ) : (
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="card">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar name={member.full_name} size="sm" />
                    <div>
                      <p className="font-bold text-forest-800">{member.full_name}</p>
                      <p className="text-sm text-forest-500">{member.firm_name}</p>
                      <p className="text-sm text-forest-500">{member.practice_areas.map(getPracticeAreaName).join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      className="input-field w-auto"
                      value={member.membership_status}
                      onChange={(e) => handleStatusChange(member.id, e.target.value as MembershipStatus)}
                    >
                      {Object.entries(MEMBERSHIP_STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                    <Link href={`/members/${member.id}`} className="btn-secondary btn-sm">
                      <Eye className="w-4 h-4" />
                      פרופיל
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
