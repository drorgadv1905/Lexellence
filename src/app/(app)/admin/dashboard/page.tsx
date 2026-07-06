"use client";

import Link from "next/link";
import { Users, UserPlus, Calendar, Share2, MessageSquare, Plus, Bell, ClipboardList } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { StatCard, PageHeader } from "@/components/ui/Card";
import { formatDate, isUpcoming } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data } = useData();

  if (!user?.group_id) return null;

  const groupId = user.group_id;
  const activeMembers = data.users.filter((u) => u.group_id === groupId && u.membership_status === "active").length;
  const pendingCandidates = data.candidates.filter((c) => c.group_id === groupId && ["new", "in_conversation"].includes(c.status)).length;
  const nextEvent = data.events
    .filter((e) => e.group_id === groupId && isUpcoming(e.date) && e.status === "published")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const rsvpCount = nextEvent
    ? data.eventRSVPs.filter((r) => r.event_id === nextEvent.id && r.status === "attending").length
    : 0;
  const monthReferrals = data.referrals.filter((r) => r.group_id === groupId).length;
  const openRequests = data.requests.filter((r) => r.group_id === groupId && r.status === "open").length;

  return (
    <div>
      <PageHeader title="ניהול הקבוצה" subtitle="דשבורד מנהל קבוצה" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="חברים פעילים" value={activeMembers} icon={<Users className="w-6 h-6" />} />
        <StatCard label="מועמדים בהמתנה" value={pendingCandidates} icon={<UserPlus className="w-6 h-6" />} accent />
        <StatCard label="אישורי הגעה" value={rsvpCount} icon={<Calendar className="w-6 h-6" />} />
        <StatCard label="הפניות החודש" value={monthReferrals} icon={<Share2 className="w-6 h-6" />} />
        <StatCard label="בקשות פתוחות" value={openRequests} icon={<MessageSquare className="w-6 h-6" />} />
      </div>

      {nextEvent && (
        <div className="card mb-8">
          <div className="card-body">
            <h3 className="font-bold text-forest-800 mb-2">האירוע הקרוב</h3>
            <p className="text-forest-700">{nextEvent.title}</p>
            <p className="text-sm text-forest-500">{formatDate(nextEvent.date)} | {nextEvent.start_time}</p>
          </div>
        </div>
      )}

      <h3 className="font-bold text-forest-800 mb-4">פעולות מהירות</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/admin/events" className="card hover:shadow-md transition-shadow text-center py-4">
          <Plus className="w-6 h-6 mx-auto text-forest-600 mb-2" />
          <span className="text-sm font-medium text-forest-800">הוסף אירוע</span>
        </Link>
        <Link href="/admin/announcements" className="card hover:shadow-md transition-shadow text-center py-4">
          <Bell className="w-6 h-6 mx-auto text-forest-600 mb-2" />
          <span className="text-sm font-medium text-forest-800">שלח הודעה</span>
        </Link>
        <Link href="/admin/candidates" className="card hover:shadow-md transition-shadow text-center py-4">
          <UserPlus className="w-6 h-6 mx-auto text-forest-600 mb-2" />
          <span className="text-sm font-medium text-forest-800">אשר מועמדים</span>
        </Link>
        <Link href="/admin/summaries" className="card hover:shadow-md transition-shadow text-center py-4">
          <ClipboardList className="w-6 h-6 mx-auto text-forest-600 mb-2" />
          <span className="text-sm font-medium text-forest-800">העלה סיכום</span>
        </Link>
      </div>
    </div>
  );
}
