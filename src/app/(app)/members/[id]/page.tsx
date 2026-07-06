"use client";

import Link from "next/link";
import { ArrowRight, Mail, Phone, Globe, Linkedin } from "lucide-react";
import { useParams } from "next/navigation";
import { useData } from "@/lib/store";
import { Avatar, EmptyState, PageHeader } from "@/components/ui/Card";
import { MEMBERSHIP_STATUS_LABELS } from "@/lib/types";

export default function MemberProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { getUserById, getPracticeAreaName, getRegionName, getGroupById } = useData();

  const member = getUserById(id);

  if (!member) {
    return (
      <EmptyState
        title="חבר לא נמצא"
        action={
          <Link href="/members" className="btn-primary">
            חזרה לרשימה
          </Link>
        }
      />
    );
  }

  const group = member.group_id ? getGroupById(member.group_id) : null;

  return (
    <div>
      <Link href="/members" className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 mb-4 text-sm">
        <ArrowRight className="w-4 h-4" />
        חזרה לחברי הפורום
      </Link>

      <PageHeader title={member.full_name} subtitle={member.firm_name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <div className="card-body flex flex-col items-center text-center">
            <Avatar name={member.full_name} size="lg" />
            <h2 className="font-bold text-xl text-forest-800 mt-4">{member.full_name}</h2>
            <p className="text-forest-600">{member.title}</p>
            <span className="badge-green mt-2">{MEMBERSHIP_STATUS_LABELS[member.membership_status]}</span>
            {group && <p className="text-sm text-forest-500 mt-2">{group.name}</p>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-body space-y-3">
              <h3 className="font-bold text-forest-800">פרטים מקצועיים</h3>
              <p className="text-forest-700">{member.bio || "—"}</p>
              <p><span className="text-forest-500">ותק:</span> {member.years_experience} שנים</p>
              <p>
                <span className="text-forest-500">תחומי עיסוק:</span>{" "}
                {member.practice_areas.map(getPracticeAreaName).join(", ") || "—"}
              </p>
              <p><span className="text-forest-500">אזור:</span> {getRegionName(member.region)}</p>
              {member.referral_seeking && (
                <p><span className="text-forest-500">מחפש הפניות:</span> {member.referral_seeking}</p>
              )}
              {member.collaboration_interests && (
                <p><span className="text-forest-500">שיתופי פעולה:</span> {member.collaboration_interests}</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body space-y-3">
              <h3 className="font-bold text-forest-800">יצירת קשר</h3>
              <p className="flex items-center gap-2 text-forest-700">
                <Phone className="w-4 h-4 text-forest-500" />
                <span dir="ltr">{member.phone}</span>
              </p>
              <p className="flex items-center gap-2 text-forest-700">
                <Mail className="w-4 h-4 text-forest-500" />
                <span dir="ltr">{member.email}</span>
              </p>
              {member.website && (
                <p className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-forest-500" />
                  <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-forest-700 hover:underline" dir="ltr">
                    {member.website}
                  </a>
                </p>
              )}
              {member.linkedin && (
                <p className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-forest-500" />
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-forest-700 hover:underline" dir="ltr">
                    LinkedIn
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
