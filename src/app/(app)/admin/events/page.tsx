"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import {
  EVENT_STATUS_LABELS,
  MEETING_TYPE_LABELS,
  type EventStatus,
  type EventVisibility,
  type MeetingType,
} from "@/lib/types";

const emptyForm = {
  title: "",
  date: "",
  start_time: "18:30",
  end_time: "20:30",
  location: "",
  meeting_type: "physical" as MeetingType,
  zoom_link: "",
  description: "",
  agenda: "",
  visibility: "group_only" as EventVisibility,
  status: "draft" as EventStatus,
};

export default function AdminEventsPage() {
  const { user } = useAuth();
  const { data, addEvent, updateEvent, deleteEvent } = useData();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  if (!user?.group_id) return null;

  const events = data.events
    .filter((e) => e.group_id === user.group_id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (id: string) => {
    const event = data.events.find((e) => e.id === id);
    if (!event) return;
    setEditingId(id);
    setForm({
      title: event.title,
      date: event.date,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      meeting_type: event.meeting_type,
      zoom_link: event.zoom_link,
      description: event.description,
      agenda: event.agenda,
      visibility: event.visibility,
      status: event.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateEvent(editingId, form);
      showToast("האירוע עודכן בהצלחה");
    } else {
      addEvent({ ...form, group_id: user.group_id!, created_by: user.id });
      showToast("האירוע נוצר בהצלחה");
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteEvent(deleteId);
    showToast("האירוע נמחק");
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader
        title="ניהול אירועים"
        subtitle="יצירה ועריכת אירועים ומפגשים"
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-5 h-5" />
            אירוע חדש
          </button>
        }
      />

      {events.length === 0 ? (
        <EmptyState title="אין אירועים" description="צרו אירוע חדש לקבוצה" action={<button onClick={openCreate} className="btn-primary">הוסף אירוע</button>} />
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const rsvpCount = data.eventRSVPs.filter(
              (r) => r.event_id === event.id && r.status === "attending"
            ).length;
            return (
              <Card key={event.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="badge-green">{EVENT_STATUS_LABELS[event.status]}</span>
                      <span className="badge-gray">{MEETING_TYPE_LABELS[event.meeting_type]}</span>
                    </div>
                    <h3 className="font-bold text-forest-800 text-lg">{event.title}</h3>
                    <p className="text-sm text-forest-600 mt-1">
                      {formatDate(event.date)} | {event.start_time}–{event.end_time}
                    </p>
                    <p className="text-sm text-forest-600">{event.location}</p>
                    <p className="text-sm text-forest-500 mt-1">אישורי הגעה: {rsvpCount}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(event.id)} className="btn-secondary btn-sm">
                      <Pencil className="w-4 h-4" />
                      עריכה
                    </button>
                    <button onClick={() => setDeleteId(event.id)} className="btn-danger btn-sm">
                      <Trash2 className="w-4 h-4" />
                      מחיקה
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "עריכת אירוע" : "אירוע חדש"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">שם האירוע</label>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">תאריך</label>
              <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div>
              <label className="label">שעת התחלה</label>
              <input type="time" className="input-field" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required />
            </div>
            <div>
              <label className="label">שעת סיום</label>
              <input type="time" className="input-field" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">מיקום</label>
              <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div>
              <label className="label">סוג מפגש</label>
              <select className="input-field" value={form.meeting_type} onChange={(e) => setForm({ ...form, meeting_type: e.target.value as MeetingType })}>
                {Object.entries(MEETING_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          {form.meeting_type === "zoom" && (
            <div>
              <label className="label">קישור Zoom</label>
              <input className="input-field" value={form.zoom_link} onChange={(e) => setForm({ ...form, zoom_link: e.target.value })} dir="ltr" />
            </div>
          )}
          <div>
            <label className="label">תיאור</label>
            <textarea className="input-field min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">סדר יום</label>
            <textarea className="input-field min-h-[80px]" value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">נראות</label>
              <select className="input-field" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as EventVisibility })}>
                <option value="group_only">רק לקבוצה</option>
                <option value="all_forum">לכל הפורום</option>
              </select>
            </div>
            <div>
              <label className="label">סטטוס</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })}>
                {Object.entries(EVENT_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">{editingId ? "שמירה" : "יצירת אירוע"}</button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="מחיקת אירוע"
        message="האם אתם בטוחים שברצונכם למחוק את האירוע? פעולה זו אינה ניתנת לביטול."
        confirmLabel="מחק"
        danger
      />
    </div>
  );
}
