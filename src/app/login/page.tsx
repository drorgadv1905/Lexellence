"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, LogIn, Shield, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getDefaultHome } from "@/lib/permissions";
import { DEMO_CREDENTIALS } from "@/lib/demo-data";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.replace(getDefaultHome(user.role));
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const loggedIn = login(email, password);
    if (loggedIn) {
      router.push(getDefaultHome(loggedIn.role));
    } else {
      setError("אימייל או סיסמה שגויים");
    }
  };

  const quickLogin = (credEmail: string, credPassword: string) => {
    setEmail(credEmail);
    setPassword(credPassword);
    const loggedIn = login(credEmail, credPassword);
    if (loggedIn) {
      router.push(getDefaultHome(loggedIn.role));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-gradient-to-bl from-forest-950 via-forest-900 to-forest-800 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-gold-400/30" />
          <div className="absolute bottom-32 left-16 w-48 h-48 rounded-full border border-gold-400/20" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 rounded-2xl bg-forest-800 border border-gold-400/40 flex items-center justify-center shadow-elevated">
              <Scale className="w-8 h-8 text-gold-400" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">Forum Lexellence</h1>
              <p className="text-gold-400/90 text-sm mt-0.5">פורום מקצועי לעורכי דין</p>
            </div>
          </div>

          <h2 className="font-display text-4xl font-semibold leading-tight mb-6">
            קהילה משפטית<br />
            <span className="text-gold-400">איכותית ומבוססת אמון</span>
          </h2>
          <p className="text-forest-200 text-lg leading-relaxed max-w-md">
            פלטפורמה סגורה לניהול קבוצות, שיתופי פעולה, הפניות מקצועיות ואירועים — במקום אחד.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          {[
            { icon: Shield, label: "דיסקרטיות" },
            { icon: Users, label: "קהילה" },
            { icon: Scale, label: "מקצועיות" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Icon className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <p className="text-sm text-forest-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-cream-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest-800 border border-gold-400/30 mb-4">
              <Scale className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-forest-900">Forum Lexellence</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-elevated p-8 md:p-10 border border-cream-300/60">
            <h2 className="font-display text-2xl font-semibold text-forest-900 mb-1">ברוכים הבאים</h2>
            <p className="text-forest-500 mb-8">התחברו לחשבון שלכם</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">אימייל</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.co.il"
                  required
                  dir="ltr"
                />
              </div>
              <div>
                <label className="label">סיסמה</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>
              )}

              <button type="submit" className="btn-gold w-full py-3.5 text-base">
                <LogIn className="w-5 h-5" />
                כניסה למערכת
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-cream-300">
              <p className="text-sm text-forest-500 text-center mb-4">
                חשבונות דמו לבדיקה (סיסמה: Lexellence123!):
              </p>
              <div className="space-y-2">
                {DEMO_CREDENTIALS.map((cred) => (
                  <button
                    key={cred.email}
                    onClick={() => quickLogin(cred.email, cred.password)}
                    className="w-full text-right px-4 py-3.5 rounded-xl border border-cream-300 hover:border-gold-400/50 hover:bg-cream-50 transition text-sm group"
                  >
                    <span className="font-medium text-forest-800 group-hover:text-forest-900" dir="ltr">
                      {cred.email}
                    </span>
                    <span className="block text-forest-400 text-xs mt-0.5">{cred.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
