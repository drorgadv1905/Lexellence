"use client";

import Link from "next/link";
import { Calendar, Users, User, PlusCircle, Bell, Share2, MessageSquare, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { canViewReferral } from "@/lib/permissions";
import { Card, PageHeader } from "@/components/ui/Card";
import { formatDate, isUpcoming } from "@/lib/utils";
import {
  REFERRAL_TYPE_LABELS,
  REQUEST_STATUS_LABELS,
  RSVP_STATUS_LABELS,
} from "@/lib/types";

export default function HomePage() {
  const { user } = useAuth();
  const { data, getGroupById, getUserById, getPracticeAreaName } = useData();

  if (!user) return null;

  const group = user.group_id ? getGroupById(user.group_id) : null;

  const upcomingEvents = data.events
    .filter(
      (e) =>
        isUpcoming(e.date) &&
        e.status === "published" &&
        (e.visibility === "all_forum" || e.group_id === user.group_id)
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const nextEvent = upcomingEvents[0];
  const myRSVP = nextEvent
    ? data.eventRSVPs.find((r) => r.event_id === nextEvent.id && r.user_id === user.id)
    : null;

  const announcements = data.announcements
    .filter(
      (a) =>
        a.show_on_homepage &&
        (a.audience === "all" ||
          (a.audience === "specific_group" && a.group_id === user.group_id))
    )
    .slice(0, 3);

  const recentRequests = data.requests
    .filter(
      (r) =>
        r.visibility === "all_forum" ||
        (r.visibility === "my_group" && r.group_id === user.group_id)
    )
    .slice(0, 3);

  const myReferrals = data.referrals
    .filter((r) => canViewReferral(r, user) && r.created_by === user.id)
    .slice(0, 3);

  return (
    <div>
      <div className="hero-banner mb-8">
        <div className="relative z-10">
          <p className="text-gold-400 text-sm font-medium mb-2">ברוכים הבאים</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">
            שלום, {user.full_name}
          </h1>
          <p className="text-forest-200 text-lg">
            {group ? group.name : "Forum Lexellence — פורום מקצועי לעורכי דין"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/profile" className="quick-link">
          <div className="card-body flex items-center gap-4">
            <div className="quick-link-icon">
              <User className="w-6 h-6" />
            </div>
            <span className="font-medium text-forest-800">הפרופיל שלי</span>
          </div>
        </Link>
        <Link href="/members" className="quick-link">
          <div className="card-body flex items-center gap-4">
            <div className="quick-link-icon">
              <Users className="w-6 h-6" />
            </div>
            <span className="font-medium text-forest-800">חברי הפורום</span>
          </div>
        </Link>
        <Link href="/requests" className="quick-link">
          <div className="card-body flex items-center gap-4">
            <div className="quick-link-icon bg-gold-500">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-forest-800">פרסום בקשה חדשה</span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {nextEvent && (
          <Card gold>
            <div className="flex items-start gap-3 mb-4">
              <Calendar className="w-6 h-6 text-gold-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-display font-semibold text-forest-900">האירוע הקרוב</h3>
                <p className="text-forest-700 mt-1">{nextEvent.title}</p>
                <p className="text-sm text-forest-500 mt-1">
                  {formatDate(nextEvent.date)} | {nextEvent.start_time}
                </p>
                {myRSVP && (
                  <span className="badge-green mt-2 inline-block">
                    {RSVP_STATUS_LABELS[myRSVP.status]}
                  </span>
                )}
              </div>
            </div>
            <Link href="/events" className="btn-primary btn-sm">
              אישור הגעה
            </Link>
          </Card>
        )}

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-gold-500" />
            <h3 className="font-display font-semibold text-forest-900">עדכונים אחרונים</h3>
          </div>
          {announcements.length === 0 ? (
            <p className="text-forest-500 text-sm">אין עדכונים חדשים</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li key={a.id} className="border-b border-cream-200 pb-3 last:border-0">
                  <p className="font-medium text-forest-800">{a.title}</p>
                  <p className="text-sm text-forest-600 mt-1 line-clamp-2">{a.content}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gold-500" />
            <h3 className="font-display font-semibold text-forest-900">בקשות שיתוף פעולה</h3>
          </div>
          {recentRequests.length === 0 ? (
            <p className="text-forest-500 text-sm">אין בקשות חדשות</p>
          ) : (
            <ul className="space-y-3">
              {recentRequests.map((r) => (
                <li key={r.id} className="border-b border-cream-200 pb-3 last:border-0">
                  <p className="font-medium text-forest-800">{r.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="badge-gray">{getPracticeAreaName(r.practice_area)}</span>
                    <span className="badge-green">{REQUEST_STATUS_LABELS[r.status]}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link href="/requests" className="inline-flex items-center gap-1 text-sm text-forest-600 hover:text-forest-900 mt-3">
            <ArrowLeft className="w-4 h-4" />
            לכל הבקשות
          </Link>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-gold-500" />
            <h3 className="font-display font-semibold text-forest-900">הפניות אחרונות</h3>
          </div>
          {myReferrals.length === 0 ? (
            <p className="text-forest-500 text-sm">לא דיווחת על הפניות לאחרונה</p>
          ) : (
            <ul className="space-y-3">
              {myReferrals.map((r) => {
                const related = getUserById(r.related_user_id);
                return (
                  <li key={r.id} className="border-b border-cream-200 pb-3 last:border-0">
                    <p className="font-medium text-forest-800">
                      {REFERRAL_TYPE_LABELS[r.type]}
                    </p>
                    <p className="text-sm text-forest-600">
                      {related?.full_name} — {getPracticeAreaName(r.practice_area)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          <Link href="/referrals" className="inline-flex items-center gap-1 text-sm text-forest-600 hover:text-forest-900 mt-3">
            <ArrowLeft className="w-4 h-4" />
            לכל ההפניות
          </Link>
        </Card>
      </div>
    </div>
  );
}
