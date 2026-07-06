"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { Avatar, EmptyState, PageHeader } from "@/components/ui/Card";

export default function MembersPage() {
  const { user } = useAuth();
  const { data, getPracticeAreaName, getRegionName, getGroupById } = useData();

  const [nameFilter, setNameFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

  const members = useMemo(() => {
    return data.users
      .filter((u) => u.role !== "super_admin" && u.membership_status === "active")
      .filter((u) => !nameFilter || u.full_name.includes(nameFilter))
      .filter((u) => !areaFilter || u.practice_areas.includes(areaFilter))
      .filter((u) => !regionFilter || u.region === regionFilter)
      .filter((u) => !groupFilter || u.group_id === groupFilter);
  }, [data.users, nameFilter, areaFilter, regionFilter, groupFilter]);

  return (
    <div>
      <PageHeader title="חברי הפורום" subtitle="חיפוש וצפייה בפרופילי חברים" />

      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">חיפוש לפי שם</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input
                  className="input-field pr-10"
                  placeholder="שם..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">תחום עיסוק</label>
              <select className="input-field" value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
                <option value="">הכל</option>
                {data.practiceAreas.filter((p) => p.is_active).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">אזור</label>
              <select className="input-field" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                <option value="">הכל</option>
                {data.regions.filter((r) => r.is_active).map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">קבוצה</label>
              <select className="input-field" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
                <option value="">הכל</option>
                {data.groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <EmptyState title="לא נמצאו חברים" description="נסו לשנות את מסנני החיפוש" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.id} className="card">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <Avatar name={member.full_name} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-forest-800 truncate">{member.full_name}</h3>
                    <p className="text-sm text-forest-600">{member.firm_name}</p>
                    <p className="text-sm text-forest-500 mt-1">
                      {member.practice_areas.map(getPracticeAreaName).join(", ")}
                    </p>
                    <p className="text-sm text-forest-500">{getRegionName(member.region)}</p>
                    <p className="text-sm text-forest-500 mt-1" dir="ltr">{member.phone}</p>
                    <p className="text-sm text-forest-500" dir="ltr">{member.email}</p>
                  </div>
                </div>
                <Link href={`/members/${member.id}`} className="btn-secondary btn-sm w-full mt-4">
                  <Eye className="w-4 h-4" />
                  צפייה בפרופיל
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
