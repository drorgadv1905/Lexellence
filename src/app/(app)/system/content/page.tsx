"use client";

import { useState } from "react";
import { Save, DoorOpen, FileText } from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/Card";

const LOGIN_MAIN_FIELDS = [
  { key: "login_brand_name", label: "שם המותג" },
  { key: "login_brand_subtitle", label: "כתובית מותג" },
  { key: "login_main_text", label: "טקסט ראשי", multiline: true },
  { key: "login_title", label: "כותרת התחברות" },
  { key: "login_subtitle", label: "תת-כותרת התחברות" },
  { key: "register_title", label: "כותרת הרשמה" },
  { key: "register_subtitle", label: "תת-כותרת הרשמה" },
] as const;

const LOGIN_FEATURE_FIELDS = [
  { key: "login_feature_1", label: "תכונה 1" },
  { key: "login_feature_2", label: "תכונה 2" },
  { key: "login_feature_3", label: "תכונה 3" },
  { key: "login_feature_4", label: "תכונה 4" },
] as const;

const ALL_LOGIN_KEYS = [...LOGIN_MAIN_FIELDS.map((f) => f.key), ...LOGIN_FEATURE_FIELDS.map((f) => f.key)];

const GENERAL_KEYS = ["welcome", "vision", "rules", "join", "referrals_help", "requests_help", "footer", "contact"];

type Tab = "login" | "general";

export default function SystemContentPage() {
  const { data, updateSystemContent } = useData();
  const { showToast } = useToast();

  const [tab, setTab] = useState<Tab>("login");
  const [edits, setEdits] = useState<Record<string, string>>({});

  const getContent = (key: string) => {
    const item = data.systemContent.find((c) => c.key === key);
    return edits[key] ?? item?.content ?? "";
  };

  const setField = (key: string, value: string) => {
    setEdits((prev) => ({ ...prev, [key]: value }));
  };

  const saveAll = () => {
    const keys = tab === "login" ? ALL_LOGIN_KEYS : GENERAL_KEYS;
    let saved = 0;
    keys.forEach((key) => {
      if (edits[key] !== undefined) {
        updateSystemContent(key, edits[key]);
        saved++;
      }
    });
    if (saved > 0) {
      showToast("התוכן נשמר בהצלחה");
      setEdits((prev) => {
        const next = { ...prev };
        keys.forEach((k) => delete next[k]);
        return next;
      });
    } else {
      showToast("אין שינויים לשמירה");
    }
  };

  const hasChanges =
    tab === "login"
      ? ALL_LOGIN_KEYS.some((k) => edits[k] !== undefined)
      : GENERAL_KEYS.some((k) => edits[k] !== undefined);

  const generalItems = data.systemContent.filter((c) => GENERAL_KEYS.includes(c.key));

  return (
    <div>
      <PageHeader title="ניהול תוכן כללי" subtitle="עריכת טקסטים באפליקציה" />

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={tab === "login" ? "tab-btn-active" : "tab-btn-inactive"}
        >
          <DoorOpen className="w-4 h-4 inline ml-2" />
          עמוד התחברות
        </button>
        <button
          type="button"
          onClick={() => setTab("general")}
          className={tab === "general" ? "tab-btn-active" : "tab-btn-inactive"}
        >
          <FileText className="w-4 h-4 inline ml-2" />
          תוכן כללי
        </button>
      </div>

      <div className="card max-w-3xl">
        <div className="card-body space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-bold text-forest-900 text-lg">
              {tab === "login" ? "עריכת עמוד ההתחברות" : "עריכת תוכן כללי"}
            </h2>
            <button onClick={saveAll} className="btn-gold btn-sm" disabled={!hasChanges}>
              <Save className="w-4 h-4" />
              שמירת כל השדות
            </button>
          </div>

          {tab === "login" ? (
            <div className="space-y-4">
              {LOGIN_MAIN_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className="label">{field.label}</label>
                  {"multiline" in field && field.multiline ? (
                    <textarea
                      className="input-field min-h-[120px]"
                      value={getContent(field.key)}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                  ) : (
                    <input
                      className="input-field"
                      value={getContent(field.key)}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {LOGIN_FEATURE_FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="label">{field.label}</label>
                    <input
                      className="input-field"
                      value={getContent(field.key)}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {generalItems.map((item) => (
                <div key={item.key}>
                  <label className="label">{item.title}</label>
                  <textarea
                    className="input-field min-h-[100px]"
                    value={getContent(item.key)}
                    onChange={(e) => setField(item.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
