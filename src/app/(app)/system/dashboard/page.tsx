"use client";

import { Building2, Users, UserPlus, Calendar, Share2, HelpCircle, Shield } from "lucide-react";
import { useData } from "@/lib/store";
import { PageHeader, StatCard } from "@/components/ui/Card";
import { isUpcoming } from "@/lib/utils";

export default function SystemDashboardPage() {
  const { data } = useData();

  const activeMembers = data.users.filter((u) => u.membership_status === "active" && u.role !== "super_admin").length;
  const candidates = data.candidates.filter((c) => ["new", "in_conversation"].includes(c.status)).length;
  const groupAdmins = data.users.filter((u) => u.role === "group_admin").length;
  const upcomingEventsCount = data.events.filter((e) => isUpcoming(e.date) && e.status === "published").length;
  const monthReferrals = data.referrals.length;
  const openRequests = data.requests.filter((r) => r.status === "open").length;

  return (
    <div>
      <PageHeader title="דשבורד מערכת" subtitle="סקירה כללית של המערכת" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="קבוצות" value={data.groups.length} icon={<Building2 className="w-5 h-5" />} />
        <StatCard label="חברים פעילים" value={activeMembers} icon={<Users className="w-5 h-5" />} />
        <StatCard label="מועמדים" value={candidates} icon={<UserPlus className="w-5 h-5" />} />
        <StatCard label="מנהלי קבוצות" value={groupAdmins} icon={<Shield className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="בקשות פתוחות" value={openRequests} icon={<HelpCircle className="w-5 h-5" />} />
        <StatCard label="הפניות החודש" value={monthReferrals} icon={<Share2 className="w-5 h-5" />} />
        <StatCard label="אירועים קרובים" value={upcomingEventsCount} icon={<Calendar className="w-5 h-5" />} />
      </div>
    </div>
  );
}
