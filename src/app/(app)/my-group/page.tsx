"use client";

import Link from "next/link";
import { Mail, Calendar, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { Avatar, Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { formatDate, isUpcoming } from "@/lib/utils";

export default function MyGroupPage() {
  const { user } = useAuth();
  const { data, getGroupById, getUserById } = useData();

  if (!user?.group_id) {
    return <EmptyState title="לא שויכת לקבוצה" description="פנה למנהל המערכת לשיוך קבוצה" />;
  }

  const group = getGroupById(user.group_id);
  if (!group) return <EmptyState title="קבוצה לא נמצאה" />;

  const admin = getUserById(group.group_admin_id);
  const members = data.users.filter((u) => u.group_id === group.id && u.membership_status === "active");
  const upcomingEvents = data.events
    .filter((e) => e.group_id === group.id && isUpcoming(e.date) && e.status === "published")
    .slice(0, 3);
  const announcements = data.announcements
    .filter((a) => a.group_id === group.id || (a.audience === "specific_group" && a.group_id === group.id))
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="הקבוצה שלי" subtitle={group.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-forest-800 mb-3">פרטי הקבוצה</h3>
            <div className="space-y-2 text-forest-700">
              <p><span className="text-forest-500">שם:</span> {group.name}</p>
              <p><span className="text-forest-500">אזור:</span> {group.region}</p>
              <p><span className="text-forest-500">תיאור:</span> {group.description}</p>
              <p><span className="text-forest-500">יום מפגש:</span> {group.default_meeting_day}</p>
              <p><span className="text-forest-500">תדירות:</span> {group.meeting_frequency}</p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-forest-600" />
              <h3 className="font-bold text-forest-800">חברי הקבוצה ({members.length})</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map((m) => (
                <Link
                  key={m.id}
                  href={`/members/${m.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-100 transition"
                >
                  <Avatar name={m.full_name} size="sm" />
                  <div>
                    <p className="font-medium text-forest-800 text-sm">{m.full_name}</p>
                    <p className="text-xs text-forest-500">{m.firm_name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-forest-800 mb-3">כללי הקבוצה</h3>
            <p className="text-forest-700 whitespace-pre-line">{group.rules}</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-forest-800 mb-3">מנהל הקבוצה</h3>
            {admin && (
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={admin.full_name} size="sm" />
                <div>
                  <p className="font-medium text-forest-800">{admin.full_name}</p>
                  <p className="text-sm text-forest-500">{admin.phone}</p>
                </div>
              </div>
            )}
            {admin && (
              <a href={`mailto:${admin.email}`} className="btn-secondary btn-sm w-full">
                <Mail className="w-4 h-4" />
                יצירת קשר עם מנהל הקבוצה
              </a>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-forest-600" />
              <h3 className="font-bold text-forest-800">אירועים קרובים</h3>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-forest-500">אין אירועים קרובים</p>
            ) : (
              <ul className="space-y-2">
                {upcomingEvents.map((e) => (
                  <li key={e.id} className="text-sm">
                    <p className="font-medium text-forest-800">{e.title}</p>
                    <p className="text-forest-500">{formatDate(e.date)}</p>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/events" className="text-sm text-forest-600 mt-3 inline-block hover:underline">
              לכל האירועים ←
            </Link>
          </Card>

          <Card>
            <h3 className="font-bold text-forest-800 mb-3">עדכונים אחרונים</h3>
            {announcements.length === 0 ? (
              <p className="text-sm text-forest-500">אין עדכונים</p>
            ) : (
              <ul className="space-y-3">
                {announcements.map((a) => (
                  <li key={a.id} className="border-b border-cream-200 pb-2 last:border-0">
                    <p className="font-medium text-sm text-forest-800">{a.title}</p>
                    <p className="text-xs text-forest-500 line-clamp-2">{a.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
