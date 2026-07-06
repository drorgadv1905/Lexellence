"use client";

import { Download } from "lucide-react";
import { useData } from "@/lib/store";
import { exportToCSV } from "@/lib/permissions";
import { StatCard, PageHeader } from "@/components/ui/Card";
import { PAYMENT_STATUS_LABELS } from "@/lib/types";
import { Users, Building2, Calendar, Share2, MessageSquare, UserX } from "lucide-react";

export default function SystemReportsPage() {
  const { data, getGroupById } = useData();

  const activeMembers = data.users.filter((u) => u.membership_status === "active" && u.role !== "super_admin").length;
  const inactiveMembers = data.users.filter((u) => u.membership_status === "inactive").length;
  const candidates = data.candidates.length;
  const events = data.events.length;
  const rsvps = data.eventRSVPs.filter((r) => r.status === "attending").length;
  const referrals = data.referrals.length;
  const requests = data.requests.length;

  const membersByGroup = data.groups.map((g) => ({
    קבוצה: g.name,
    "חברים פעילים": data.users.filter((u) => u.group_id === g.id && u.membership_status === "active").length,
    מועמדים: data.candidates.filter((c) => c.group_id === g.id).length,
  }));

  const paymentReport = data.users
    .filter((u) => u.role !== "super_admin")
    .map((u) => ({
      שם: u.full_name,
      קבוצה: u.group_id ? getGroupById(u.group_id)?.name ?? "" : "",
      "סטטוס תשלום": PAYMENT_STATUS_LABELS[u.payment_status],
    }));

  const handleExportMembers = () => exportToCSV(membersByGroup, "members-by-group.csv");
  const handleExportPayments = () => exportToCSV(paymentReport, "payment-status.csv");

  return (
    <div>
      <PageHeader title="דוחות וייצוא" subtitle="דוחות כלליים וייצוא נתונים" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="חברים פעילים" value={activeMembers} icon={<Users className="w-6 h-6" />} />
        <StatCard label="מועמדים" value={candidates} icon={<Users className="w-6 h-6" />} />
        <StatCard label="קבוצות" value={data.groups.length} icon={<Building2 className="w-6 h-6" />} />
        <StatCard label="אירועים" value={events} icon={<Calendar className="w-6 h-6" />} />
        <StatCard label="אישורי הגעה" value={rsvps} icon={<Calendar className="w-6 h-6" />} />
        <StatCard label="הפניות" value={referrals} icon={<Share2 className="w-6 h-6" />} />
        <StatCard label="בקשות מקצועיות" value={requests} icon={<MessageSquare className="w-6 h-6" />} />
        <StatCard label="חברים לא פעילים" value={inactiveMembers} icon={<UserX className="w-6 h-6" />} accent />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-body">
            <h3 className="font-bold text-forest-800 mb-4">חברים לפי קבוצה</h3>
            <div className="space-y-2 mb-4">
              {membersByGroup.map((row, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-cream-200 pb-2">
                  <span className="text-forest-800">{row.קבוצה}</span>
                  <span className="text-forest-600">{row["חברים פעילים"]} חברים</span>
                </div>
              ))}
            </div>
            <button onClick={handleExportMembers} className="btn-secondary w-full">
              <Download className="w-4 h-4" />
              ייצוא CSV
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="font-bold text-forest-800 mb-4">סטטוסי תשלום</h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => {
                const count = data.users.filter((u) => u.payment_status === key && u.role !== "super_admin").length;
                return (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-forest-700">{label}</span>
                    <span className="font-medium text-forest-800">{count}</span>
                  </div>
                );
              })}
            </div>
            <button onClick={handleExportPayments} className="btn-secondary w-full">
              <Download className="w-4 h-4" />
              ייצוא CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
