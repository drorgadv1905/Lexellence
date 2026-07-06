"use client";

import Link from "next/link";
import { Building2, Users, UserPlus, Calendar, Share2, MessageSquare, Shield } from "lucide-react";
import { useData } from "@/lib/store";
import { StatCard, PageHeader } from "@/components/ui/Card";
import { formatDate, isUpcoming } from "@/lib/utils";

export default function SystemDashboardPage() {
  const { data } = useData();

  const activeMembers = data.users.filter((u) => u.membership_status === "active" && u.role !== "super_admin").length;
  const candidates = data.candidates.filter((c) => ["new", "in_conversation"].includes(c.status)).length;
  const groupAdmins = data.users.filter((u) => u.role === "group_admin").length;
  const upcomingEvents = data.events.filter((e) => isUpcoming(e.date) && e.status === "published").slice(0, 5);
  const monthReferrals = data.referrals.length;
  const openRequests = data.requests.filter((r) => r.status === "open").length;

  return (
    <div>
      <PageHeader title="דשבורד מנהל מערכת" subtitle="סקירה כללית של Forum Lexellence" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="קבוצות" value={data.groups.length} icon={<Building2 className="w-6 h-6" />} accent />
        <StatCard label="חברים פעילים" value={activeMembers} icon={<Users className="w-6 h-6" />} />
        <StatCard label="מועמדים" value={candidates} icon={<UserPlus className="w-6 h-6" />} />
        <StatCard label="מנהלי קבוצות" value={groupAdmins} icon={<Shield className="w-6 h-6" />} />
        <StatCard label="הפניות החודש" value={monthReferrals} icon={<Share2 className="w-6 h-6" />} />
        <StatCard label="בקשות פתוחות" value={openRequests} icon={<MessageSquare className="w-6 h-6" />} />
      </div>

      <div className="card mb-8">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-forest-600" />
            <h3 className="font-bold text-forest-800">אירועים קרובים בכל המערכת</h3>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-forest-500 text-sm">אין אירועים קרובים</p>
          ) : (
            <ul className="space-y-2">
              {upcomingEvents.map((e) => {
                const group = data.groups.find((g) => g.id === e.group_id);
                return (
                  <li key={e.id} className="flex justify-between text-sm border-b border-cream-200 pb-2 last:border-0">
                    <span className="font-medium text-forest-800">{e.title}</span>
                    <span className="text-forest-500">{formatDate(e.date)} | {group?.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <h3 className="font-bold text-forest-800 mb-4">ניהול מהיר</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/system/users" className="card hover:shadow-md transition-shadow text-center py-4">
          <Users className="w-6 h-6 mx-auto text-forest-600 mb-2" />
          <span className="text-sm font-medium text-forest-800">משתמשים</span>
        </Link>
        <Link href="/system/groups" className="card hover:shadow-md transition-shadow text-center py-4">
          <Building2 className="w-6 h-6 mx-auto text-forest-600 mb-2" />
          <span className="text-sm font-medium text-forest-800">קבוצות</span>
        </Link>
        <Link href="/system/announcements" className="card hover:shadow-md transition-shadow text-center py-4">
          <MessageSquare className="w-6 h-6 mx-auto text-forest-600 mb-2" />
          <span className="text-sm font-medium text-forest-800">הודעות מערכת</span>
        </Link>
        <Link href="/system/reports" className="card hover:shadow-md transition-shadow text-center py-4">
          <Share2 className="w-6 h-6 mx-auto text-forest-600 mb-2" />
          <span className="text-sm font-medium text-forest-800">דוחות</span>
        </Link>
      </div>
    </div>
  );
}
