"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/Card";
import { MEMBERSHIP_STATUS_LABELS } from "@/lib/types";

export default function ProfilePage() {
  const { user, updateCurrentUser } = useAuth();
  const { data, getPracticeAreaName, getRegionName } = useData();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    full_name: user?.full_name ?? "",
    firm_name: user?.firm_name ?? "",
    title: user?.title ?? "",
    years_experience: user?.years_experience ?? 0,
    practice_areas: user?.practice_areas ?? [],
    region: user?.region ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    website: user?.website ?? "",
    linkedin: user?.linkedin ?? "",
    bio: user?.bio ?? "",
    referral_seeking: user?.referral_seeking ?? "",
    collaboration_interests: user?.collaboration_interests ?? "",
  });

  if (!user) return null;

  const canEditStatus = user.role === "group_admin" || user.role === "super_admin";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser(form);
    showToast("הפרופיל עודכן בהצלחה");
  };

  const togglePracticeArea = (id: string) => {
    setForm((prev) => ({
      ...prev,
      practice_areas: prev.practice_areas.includes(id)
        ? prev.practice_areas.filter((p) => p !== id)
        : [...prev.practice_areas, id],
    }));
  };

  return (
    <div>
      <PageHeader title="הפרופיל שלי" subtitle="עריכת פרטים אישיים ומקצועיים" />

      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        <div className="card">
          <div className="card-body space-y-4">
            <h3 className="font-bold text-forest-800 border-b border-cream-300 pb-2">פרטים אישיים</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">שם מלא</label>
                <input
                  className="input-field"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">שם משרד</label>
                <input
                  className="input-field"
                  value={form.firm_name}
                  onChange={(e) => setForm({ ...form, firm_name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">תפקיד</label>
                <input
                  className="input-field"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="label">שנות ותק</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.years_experience}
                  onChange={(e) => setForm({ ...form, years_experience: Number(e.target.value) })}
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body space-y-4">
            <h3 className="font-bold text-forest-800 border-b border-cream-300 pb-2">תחומי עיסוק</h3>
            <div className="flex flex-wrap gap-2">
              {data.practiceAreas.filter((p) => p.is_active).map((pa) => (
                <button
                  key={pa.id}
                  type="button"
                  onClick={() => togglePracticeArea(pa.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    form.practice_areas.includes(pa.id)
                      ? "bg-forest-700 text-white border-forest-700"
                      : "bg-white text-forest-700 border-cream-300 hover:border-forest-500"
                  }`}
                >
                  {pa.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body space-y-4">
            <h3 className="font-bold text-forest-800 border-b border-cream-300 pb-2">פרטי קשר</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">אזור פעילות</label>
                <select
                  className="input-field"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                >
                  <option value="">בחר אזור</option>
                  {data.regions.filter((r) => r.is_active).map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">טלפון</label>
                <input
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="label">אימייל</label>
                <input
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="label">אתר אינטרנט</label>
                <input
                  className="input-field"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">לינקדאין</label>
                <input
                  className="input-field"
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body space-y-4">
            <h3 className="font-bold text-forest-800 border-b border-cream-300 pb-2">מקצועי</h3>
            <div>
              <label className="label">תיאור מקצועי קצר</label>
              <textarea
                className="input-field min-h-[100px]"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div>
              <label className="label">איזה סוג הפניות אני מחפש</label>
              <input
                className="input-field"
                value={form.referral_seeking}
                onChange={(e) => setForm({ ...form, referral_seeking: e.target.value })}
              />
            </div>
            <div>
              <label className="label">איזה סוג שיתופי פעולה מעניינים אותי</label>
              <input
                className="input-field"
                value={form.collaboration_interests}
                onChange={(e) => setForm({ ...form, collaboration_interests: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <label className="label">סטטוס חברות</label>
            <div className="flex items-center gap-3">
              <span className="badge-green text-base px-4 py-1">
                {MEMBERSHIP_STATUS_LABELS[user.membership_status]}
              </span>
              {!canEditStatus && (
                <span className="text-sm text-forest-500">(ניתן לצפייה בלבד)</span>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary">
          <Save className="w-5 h-5" />
          שמירת פרופיל
        </button>
      </form>
    </div>
  );
}
