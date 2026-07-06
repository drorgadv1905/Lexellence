"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, LogIn } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-700 border border-gold-400/30 mb-4">
            <Scale className="w-9 h-9 text-gold-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Forum Lexellence</h1>
          <p className="text-forest-300">פורום מקצועי לעורכי דין</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-forest-800 mb-6 text-center">התחברות</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full py-3">
              <LogIn className="w-5 h-5" />
              כניסה למערכת
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-cream-300">
            <p className="text-sm text-forest-500 text-center mb-4">חשבונות לדוגמה:</p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => quickLogin(cred.email, cred.password)}
                  className="w-full text-right px-4 py-3 rounded-lg border border-cream-300 hover:border-forest-500 hover:bg-forest-50 transition text-sm"
                >
                  <span className="font-medium text-forest-800">{cred.label}</span>
                  <span className="block text-forest-500 text-xs mt-0.5" dir="ltr">
                    {cred.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
