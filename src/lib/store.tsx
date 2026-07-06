"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Announcement,
  AppData,
  Candidate,
  Document,
  Event,
  EventRSVP,
  Group,
  MembershipPlan,
  PracticeArea,
  Referral,
  Region,
  Request,
  RequestComment,
  SystemContent,
  User,
} from "./types";
import { initialData } from "./demo-data";
import { generateId, nowISO, STORAGE_KEY } from "./permissions";
import { AuthProvider } from "./auth";

interface DataContextValue {
  data: AppData;
  getUserById: (id: string) => User | undefined;
  getUserByEmail: (email: string) => User | undefined;
  getGroupById: (id: string) => Group | undefined;
  getPracticeAreaName: (id: string) => string;
  getRegionName: (id: string) => string;
  updateUser: (id: string, updates: Partial<User>) => void;
  addUser: (user: Omit<User, "id" | "created_at" | "updated_at">) => void;
  deleteUser: (id: string) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  addGroup: (group: Omit<Group, "id" | "created_at" | "updated_at">) => void;
  deleteGroup: (id: string) => void;
  addEvent: (event: Omit<Event, "id" | "created_at" | "updated_at">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  setRSVP: (eventId: string, userId: string, status: EventRSVP["status"]) => void;
  addReferral: (ref: Omit<Referral, "id" | "created_at" | "updated_at">) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  addRequest: (req: Omit<Request, "id" | "created_at" | "updated_at">) => void;
  updateRequest: (id: string, updates: Partial<Request>) => void;
  addRequestComment: (comment: Omit<RequestComment, "id" | "created_at">) => void;
  addDocument: (doc: Omit<Document, "id" | "created_at" | "updated_at">) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  addAnnouncement: (ann: Omit<Announcement, "id" | "created_at" | "updated_at">) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  addPracticeArea: (name: string) => void;
  updatePracticeArea: (id: string, updates: Partial<PracticeArea>) => void;
  deletePracticeArea: (id: string) => void;
  addRegion: (name: string) => void;
  updateRegion: (id: string, updates: Partial<Region>) => void;
  deleteRegion: (id: string) => void;
  addMembershipPlan: (plan: Omit<MembershipPlan, "id">) => void;
  updateMembershipPlan: (id: string, updates: Partial<MembershipPlan>) => void;
  deleteMembershipPlan: (id: string) => void;
  updateSystemContent: (key: string, content: string, title?: string) => void;
  addCandidate: (c: Omit<Candidate, "id" | "created_at">) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

function loadData(): AppData {
  if (typeof window === "undefined") return initialData;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as AppData;
    } catch {
      return initialData;
    }
  }
  return initialData;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadData());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, hydrated]);

  const mutate = useCallback((fn: (prev: AppData) => AppData) => {
    setData(fn);
  }, []);

  const getUserById = useCallback((id: string) => data.users.find((u) => u.id === id), [data.users]);
  const getUserByEmail = useCallback((email: string) => data.users.find((u) => u.email === email), [data.users]);
  const getGroupById = useCallback((id: string) => data.groups.find((g) => g.id === id), [data.groups]);
  const getPracticeAreaName = useCallback(
    (id: string) => data.practiceAreas.find((p) => p.id === id)?.name ?? id,
    [data.practiceAreas]
  );
  const getRegionName = useCallback(
    (id: string) => data.regions.find((r) => r.id === id)?.name ?? id,
    [data.regions]
  );

  const updateUser = useCallback(
    (id: string, updates: Partial<User>) => {
      mutate((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === id ? { ...u, ...updates, updated_at: nowISO() } : u
        ),
      }));
    },
    [mutate]
  );

  const addUser = useCallback(
    (user: Omit<User, "id" | "created_at" | "updated_at">) => {
      const now = nowISO();
      mutate((prev) => ({
        ...prev,
        users: [...prev.users, { ...user, id: generateId(), created_at: now, updated_at: now }],
      }));
    },
    [mutate]
  );

  const deleteUser = useCallback(
    (id: string) => {
      mutate((prev) => ({ ...prev, users: prev.users.filter((u) => u.id !== id) }));
    },
    [mutate]
  );

  const updateGroup = useCallback(
    (id: string, updates: Partial<Group>) => {
      mutate((prev) => ({
        ...prev,
        groups: prev.groups.map((g) =>
          g.id === id ? { ...g, ...updates, updated_at: nowISO() } : g
        ),
      }));
    },
    [mutate]
  );

  const addGroup = useCallback(
    (group: Omit<Group, "id" | "created_at" | "updated_at">) => {
      const now = nowISO();
      mutate((prev) => ({
        ...prev,
        groups: [...prev.groups, { ...group, id: generateId(), created_at: now, updated_at: now }],
      }));
    },
    [mutate]
  );

  const deleteGroup = useCallback(
    (id: string) => {
      mutate((prev) => ({ ...prev, groups: prev.groups.filter((g) => g.id !== id) }));
    },
    [mutate]
  );

  const addEvent = useCallback(
    (event: Omit<Event, "id" | "created_at" | "updated_at">) => {
      const now = nowISO();
      mutate((prev) => ({
        ...prev,
        events: [...prev.events, { ...event, id: generateId(), created_at: now, updated_at: now }],
      }));
    },
    [mutate]
  );

  const updateEvent = useCallback(
    (id: string, updates: Partial<Event>) => {
      mutate((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === id ? { ...e, ...updates, updated_at: nowISO() } : e
        ),
      }));
    },
    [mutate]
  );

  const deleteEvent = useCallback(
    (id: string) => {
      mutate((prev) => ({ ...prev, events: prev.events.filter((e) => e.id !== id) }));
    },
    [mutate]
  );

  const setRSVP = useCallback(
    (eventId: string, userId: string, status: EventRSVP["status"]) => {
      mutate((prev) => {
        const existing = prev.eventRSVPs.find((r) => r.event_id === eventId && r.user_id === userId);
        const now = nowISO();
        if (existing) {
          return {
            ...prev,
            eventRSVPs: prev.eventRSVPs.map((r) =>
              r.id === existing.id ? { ...r, status, updated_at: now } : r
            ),
          };
        }
        return {
          ...prev,
          eventRSVPs: [
            ...prev.eventRSVPs,
            { id: generateId(), event_id: eventId, user_id: userId, status, created_at: now, updated_at: now },
          ],
        };
      });
    },
    [mutate]
  );

  const addReferral = useCallback(
    (ref: Omit<Referral, "id" | "created_at" | "updated_at">) => {
      const now = nowISO();
      mutate((prev) => ({
        ...prev,
        referrals: [...prev.referrals, { ...ref, id: generateId(), created_at: now, updated_at: now }],
      }));
    },
    [mutate]
  );

  const updateReferral = useCallback(
    (id: string, updates: Partial<Referral>) => {
      mutate((prev) => ({
        ...prev,
        referrals: prev.referrals.map((r) =>
          r.id === id ? { ...r, ...updates, updated_at: nowISO() } : r
        ),
      }));
    },
    [mutate]
  );

  const addRequest = useCallback(
    (req: Omit<Request, "id" | "created_at" | "updated_at">) => {
      const now = nowISO();
      mutate((prev) => ({
        ...prev,
        requests: [...prev.requests, { ...req, id: generateId(), created_at: now, updated_at: now }],
      }));
    },
    [mutate]
  );

  const updateRequest = useCallback(
    (id: string, updates: Partial<Request>) => {
      mutate((prev) => ({
        ...prev,
        requests: prev.requests.map((r) =>
          r.id === id ? { ...r, ...updates, updated_at: nowISO() } : r
        ),
      }));
    },
    [mutate]
  );

  const addRequestComment = useCallback(
    (comment: Omit<RequestComment, "id" | "created_at">) => {
      mutate((prev) => ({
        ...prev,
        requestComments: [
          ...prev.requestComments,
          { ...comment, id: generateId(), created_at: nowISO() },
        ],
      }));
    },
    [mutate]
  );

  const addDocument = useCallback(
    (doc: Omit<Document, "id" | "created_at" | "updated_at">) => {
      const now = nowISO();
      mutate((prev) => ({
        ...prev,
        documents: [...prev.documents, { ...doc, id: generateId(), created_at: now, updated_at: now }],
      }));
    },
    [mutate]
  );

  const updateDocument = useCallback(
    (id: string, updates: Partial<Document>) => {
      mutate((prev) => ({
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === id ? { ...d, ...updates, updated_at: nowISO() } : d
        ),
      }));
    },
    [mutate]
  );

  const addAnnouncement = useCallback(
    (ann: Omit<Announcement, "id" | "created_at" | "updated_at">) => {
      const now = nowISO();
      mutate((prev) => ({
        ...prev,
        announcements: [...prev.announcements, { ...ann, id: generateId(), created_at: now, updated_at: now }],
      }));
    },
    [mutate]
  );

  const updateAnnouncement = useCallback(
    (id: string, updates: Partial<Announcement>) => {
      mutate((prev) => ({
        ...prev,
        announcements: prev.announcements.map((a) =>
          a.id === id ? { ...a, ...updates, updated_at: nowISO() } : a
        ),
      }));
    },
    [mutate]
  );

  const addPracticeArea = useCallback(
    (name: string) => {
      mutate((prev) => ({
        ...prev,
        practiceAreas: [...prev.practiceAreas, { id: generateId(), name, is_active: true }],
      }));
    },
    [mutate]
  );

  const updatePracticeArea = useCallback(
    (id: string, updates: Partial<PracticeArea>) => {
      mutate((prev) => ({
        ...prev,
        practiceAreas: prev.practiceAreas.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    },
    [mutate]
  );

  const deletePracticeArea = useCallback(
    (id: string) => {
      mutate((prev) => ({ ...prev, practiceAreas: prev.practiceAreas.filter((p) => p.id !== id) }));
    },
    [mutate]
  );

  const addRegion = useCallback(
    (name: string) => {
      mutate((prev) => ({
        ...prev,
        regions: [...prev.regions, { id: generateId(), name, is_active: true }],
      }));
    },
    [mutate]
  );

  const updateRegion = useCallback(
    (id: string, updates: Partial<Region>) => {
      mutate((prev) => ({
        ...prev,
        regions: prev.regions.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      }));
    },
    [mutate]
  );

  const deleteRegion = useCallback(
    (id: string) => {
      mutate((prev) => ({ ...prev, regions: prev.regions.filter((r) => r.id !== id) }));
    },
    [mutate]
  );

  const addMembershipPlan = useCallback(
    (plan: Omit<MembershipPlan, "id">) => {
      mutate((prev) => ({
        ...prev,
        membershipPlans: [...prev.membershipPlans, { ...plan, id: generateId() }],
      }));
    },
    [mutate]
  );

  const updateMembershipPlan = useCallback(
    (id: string, updates: Partial<MembershipPlan>) => {
      mutate((prev) => ({
        ...prev,
        membershipPlans: prev.membershipPlans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    },
    [mutate]
  );

  const deleteMembershipPlan = useCallback(
    (id: string) => {
      mutate((prev) => ({ ...prev, membershipPlans: prev.membershipPlans.filter((p) => p.id !== id) }));
    },
    [mutate]
  );

  const updateSystemContent = useCallback(
    (key: string, content: string, title?: string) => {
      mutate((prev) => ({
        ...prev,
        systemContent: prev.systemContent.map((sc) =>
          sc.key === key
            ? { ...sc, content, title: title ?? sc.title, updated_at: nowISO() }
            : sc
        ),
      }));
    },
    [mutate]
  );

  const addCandidate = useCallback(
    (c: Omit<Candidate, "id" | "created_at">) => {
      mutate((prev) => ({
        ...prev,
        candidates: [...prev.candidates, { ...c, id: generateId(), created_at: nowISO() }],
      }));
    },
    [mutate]
  );

  const updateCandidate = useCallback(
    (id: string, updates: Partial<Candidate>) => {
      mutate((prev) => ({
        ...prev,
        candidates: prev.candidates.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }));
    },
    [mutate]
  );

  const resetData = useCallback(() => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      data,
      getUserById,
      getUserByEmail,
      getGroupById,
      getPracticeAreaName,
      getRegionName,
      updateUser,
      addUser,
      deleteUser,
      updateGroup,
      addGroup,
      deleteGroup,
      addEvent,
      updateEvent,
      deleteEvent,
      setRSVP,
      addReferral,
      updateReferral,
      addRequest,
      updateRequest,
      addRequestComment,
      addDocument,
      updateDocument,
      addAnnouncement,
      updateAnnouncement,
      addPracticeArea,
      updatePracticeArea,
      deletePracticeArea,
      addRegion,
      updateRegion,
      deleteRegion,
      addMembershipPlan,
      updateMembershipPlan,
      deleteMembershipPlan,
      updateSystemContent,
      addCandidate,
      updateCandidate,
      resetData,
    }),
    [
      data,
      getUserById,
      getUserByEmail,
      getGroupById,
      getPracticeAreaName,
      getRegionName,
      updateUser,
      addUser,
      deleteUser,
      updateGroup,
      addGroup,
      deleteGroup,
      addEvent,
      updateEvent,
      deleteEvent,
      setRSVP,
      addReferral,
      updateReferral,
      addRequest,
      updateRequest,
      addRequestComment,
      addDocument,
      updateDocument,
      addAnnouncement,
      updateAnnouncement,
      addPracticeArea,
      updatePracticeArea,
      deletePracticeArea,
      addRegion,
      updateRegion,
      deleteRegion,
      addMembershipPlan,
      updateMembershipPlan,
      deleteMembershipPlan,
      updateSystemContent,
      addCandidate,
      updateCandidate,
      resetData,
    ]
  );

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-forest-700 text-lg">טוען...</div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={value}>
      <AuthProvider getUserByEmail={getUserByEmail} updateUser={updateUser}>
        {children}
      </AuthProvider>
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
