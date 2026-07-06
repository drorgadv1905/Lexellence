"use client";

import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { StatCard, PageHeader } from "@/components/ui/Card";
import { Users, Calendar, Share2, MessageSquare, UserPlus, UserX } from "lucide-react";

export default function AdminReportsPage() {
  const { user } = useAuth();
  const { data } = useData();

  if (!user?.group_id) return null;

  const groupId = user.group_id;
  const activeMembers = data.users.filter((u) => u.group_id === groupId && u.membership_status === "active").length;
  const inactiveMembers = data.users.filter((u) => u.group_id === groupId && u.membership_status === "inactive").length;
  const completedEvents = data.events.filter((e) => e.group_id === groupId && e.status === "completed").length;
  const groupEvents = data.events.filter((e) => e.group_id === groupId);
  const totalRsvps = data.eventRSVPs.filter((r) =>
    groupEvents.some((e) => e.id === r.event_id && r.status === "attending")
  ).length;
  const avgAttendance = completedEvents > 0 ? Math.round(totalRsvps / completedEvents) : 0;
  const referrals = data.referrals.filter((r) => r.group_id === groupId).length;
  const requests = data.requests.filter((r) => r.group_id === groupId).length;
  const newCandidates = data.candidates.filter((c) => c.group_id === groupId && c.status === "new").length;

  return (
    <div>
      <PageHeader title="דוחות פעילות קבוצה" subtitle="סקירה בסיסית של פעילות הקבוצה" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="חברים פעילים" value={activeMembers} icon={<Users className="w-6 h-6" />} />
        <StatCard label="אירועים שהתקיימו" value={completedEvents} icon={<Calendar className="w-6 h-6" />} />
        <StatCard label="ממוצע נוכחות" value={avgAttendance} icon={<Calendar className="w-6 h-6" />} accent />
        <StatCard label="הפניות שדווחו" value={referrals} icon={<Share2 className="w-6 h-6" />} />
        <StatCard label="בקשות מקצועיות" value={requests} icon={<MessageSquare className="w-6 h-6" />} />
        <StatCard label="מועמדים חדשים" value={newCandidates} icon={<UserPlus className="w-6 h-6" />} />
        <StatCard label="חברים לא פעילים" value={inactiveMembers} icon={<UserX className="w-6 h-6" />} />
      </div>
    </div>
  );
}
