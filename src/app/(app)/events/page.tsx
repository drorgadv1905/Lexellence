"use client";

import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { formatDate, isUpcoming } from "@/lib/utils";
import {
  MEETING_TYPE_LABELS,
  RSVP_STATUS_LABELS,
  type RSVPStatus,
} from "@/lib/types";

export default function EventsPage() {
  const { user } = useAuth();
  const { data, getGroupById, setRSVP } = useData();
  const { showToast } = useToast();

  if (!user) return null;

  const visibleEvents = data.events.filter(
    (e) =>
      (e.status === "published" || e.status === "completed") &&
      (e.visibility === "all_forum" || e.group_id === user.group_id)
  );

  const upcoming = visibleEvents
    .filter((e) => isUpcoming(e.date) && e.status === "published")
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = visibleEvents
    .filter((e) => !isUpcoming(e.date) || e.status === "completed")
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleRSVP = (eventId: string, status: RSVPStatus) => {
    setRSVP(eventId, user.id, status);
    showToast(`אישור הגעה עודכן: ${RSVP_STATUS_LABELS[status]}`);
  };

  const EventCard = ({ event, showRSVP }: { event: typeof data.events[0]; showRSVP: boolean }) => {
    const group = getGroupById(event.group_id);
    const myRSVP = data.eventRSVPs.find((r) => r.event_id === event.id && r.user_id === user.id);

    return (
      <Card>
        <h3 className="font-bold text-forest-800 text-lg">{event.title}</h3>
        <div className="mt-3 space-y-1 text-sm text-forest-600">
          <p>{formatDate(event.date)} | {event.start_time}–{event.end_time}</p>
          <p>{event.location}</p>
          <p>סוג: {MEETING_TYPE_LABELS[event.meeting_type]}</p>
          {group && <p>קבוצה: {group.name}</p>}
        </div>
        <p className="mt-3 text-forest-700">{event.description}</p>

        {showRSVP && (
          <div className="mt-4 pt-4 border-t border-cream-300">
            <p className="text-sm font-medium text-forest-700 mb-2">אישור הגעה:</p>
            <div className="flex flex-wrap gap-2">
              {(["attending", "not_attending", "maybe"] as RSVPStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleRSVP(event.id, status)}
                  className={`btn-sm px-4 py-2 rounded-lg border transition ${
                    myRSVP?.status === status
                      ? "bg-forest-700 text-white border-forest-700"
                      : "bg-white text-forest-700 border-cream-300 hover:border-forest-500"
                  }`}
                >
                  {RSVP_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div>
      <PageHeader title="אירועים ומפגשים" subtitle="אירועים קרובים וקודמים" />

      <h2 className="text-xl font-bold text-forest-800 mb-4">אירועים קרובים</h2>
      {upcoming.length === 0 ? (
        <EmptyState title="אין אירועים קרובים" />
      ) : (
        <div className="space-y-4 mb-10">
          {upcoming.map((e) => (
            <EventCard key={e.id} event={e} showRSVP />
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-forest-800 mb-4">אירועים קודמים</h2>
      {past.length === 0 ? (
        <EmptyState title="אין אירועים קודמים" />
      ) : (
        <div className="space-y-4">
          {past.map((e) => (
            <EventCard key={e.id} event={e} showRSVP={false} />
          ))}
        </div>
      )}
    </div>
  );
}
