export type UserRole = "member" | "group_admin" | "super_admin";

export type MembershipStatus = "active" | "candidate" | "pending" | "inactive";

export type PaymentStatus =
  | "not_required"
  | "pending"
  | "paid"
  | "exempt"
  | "founder_price";

export type GroupStatus = "active" | "forming" | "inactive";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export type EventVisibility = "group_only" | "all_forum";

export type MeetingType = "physical" | "zoom" | "other";

export type RSVPStatus = "attending" | "not_attending" | "maybe";

export type ReferralType = "given" | "received" | "collaboration" | "other";

export type ReferralStatus = "new" | "in_progress" | "completed" | "not_progressed";

export type RequestUrgency = "normal" | "urgent";

export type RequestVisibility = "my_group" | "all_forum";

export type RequestStatus = "open" | "in_progress" | "closed";

export type DocumentType = "meeting_summary" | "rules" | "presentation" | "other";

export type AnnouncementAudience = "all" | "group_admins" | "specific_group";

export type CandidateStatus =
  | "new"
  | "in_conversation"
  | "invited_trial"
  | "approved"
  | "rejected";

export type MembershipPeriod = "monthly" | "quarterly" | "yearly";

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  group_id: string | null;
  firm_name: string;
  title: string;
  years_experience: number;
  practice_areas: string[];
  region: string;
  bio: string;
  website: string;
  linkedin: string;
  profile_image: string;
  membership_status: MembershipStatus;
  payment_status: PaymentStatus;
  referral_seeking: string;
  collaboration_interests: string;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  region: string;
  description: string;
  group_admin_id: string;
  status: GroupStatus;
  meeting_frequency: string;
  default_meeting_day: string;
  rules: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  group_id: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  meeting_type: MeetingType;
  zoom_link: string;
  description: string;
  agenda: string;
  visibility: EventVisibility;
  status: EventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: RSVPStatus;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  type: ReferralType;
  created_by: string;
  related_user_id: string;
  group_id: string;
  practice_area: string;
  description: string;
  status: ReferralStatus;
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  practice_area: string;
  urgency: RequestUrgency;
  visibility: RequestVisibility;
  status: RequestStatus;
  created_by: string;
  group_id: string;
  created_at: string;
  updated_at: string;
}

export interface RequestComment {
  id: string;
  request_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  group_id: string;
  content: string;
  file_url: string;
  uploaded_by: string;
  meeting_date?: string;
  decisions?: string;
  tasks?: string;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: AnnouncementAudience;
  group_id: string | null;
  is_important: boolean;
  show_on_homepage: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PracticeArea {
  id: string;
  name: string;
  is_active: boolean;
}

export interface Region {
  id: string;
  name: string;
  is_active: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  period: MembershipPeriod;
  description: string;
  is_active: boolean;
  internal_notes: string;
}

export interface SystemContent {
  id: string;
  key: string;
  title: string;
  content: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  region: string;
  practice_areas: string[];
  years_experience: number;
  bio: string;
  seeking: string;
  status: CandidateStatus;
  group_id: string;
  notes: string;
  created_at: string;
}

export interface AppData {
  users: User[];
  groups: Group[];
  events: Event[];
  eventRSVPs: EventRSVP[];
  referrals: Referral[];
  requests: Request[];
  requestComments: RequestComment[];
  documents: Document[];
  announcements: Announcement[];
  practiceAreas: PracticeArea[];
  regions: Region[];
  membershipPlans: MembershipPlan[];
  systemContent: SystemContent[];
  candidates: Candidate[];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  member: "חבר פורום",
  group_admin: "מנהל קבוצה",
  super_admin: "מנהל מערכת",
};

export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, string> = {
  active: "פעיל",
  candidate: "מועמד",
  pending: "בהמתנה",
  inactive: "לא פעיל",
};

export const RSVP_STATUS_LABELS: Record<RSVPStatus, string> = {
  attending: "מגיע",
  not_attending: "לא מגיע",
  maybe: "אולי",
};

export const REFERRAL_TYPE_LABELS: Record<ReferralType, string> = {
  given: "הפניה שנתתי",
  received: "הפניה שקיבלתי",
  collaboration: "שיתוף פעולה",
  other: "אחר",
};

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  new: "חדש",
  in_progress: "בטיפול",
  completed: "הסתיים",
  not_progressed: "לא התקדם",
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  open: "פתוח",
  in_progress: "בטיפול",
  closed: "נסגר",
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: "טיוטה",
  published: "פורסם",
  cancelled: "בוטל",
  completed: "הסתיים",
};

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  physical: "פיזי",
  zoom: "Zoom",
  other: "אחר",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  meeting_summary: "סיכום מפגש",
  rules: "כללים",
  presentation: "מצגת",
  other: "אחר",
};

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  new: "חדש",
  in_conversation: "בשיחה",
  invited_trial: "הוזמן למפגש ניסיון",
  approved: "אושר",
  rejected: "נדחה",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  not_required: "לא נדרש",
  pending: "ממתין לתשלום",
  paid: "שולם",
  exempt: "פטור",
  founder_price: "מחיר מייסדים",
};

export const PERIOD_LABELS: Record<MembershipPeriod, string> = {
  monthly: "חודשי",
  quarterly: "רבעוני",
  yearly: "שנתי",
};
