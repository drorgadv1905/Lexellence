import type { Metadata } from "next";
import { DataProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forum Lexellence",
  description: "פורום מקצועי לעורכי דין",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <DataProvider>
          <ToastProvider>{children}</ToastProvider>
        </DataProvider>
      </body>
    </html>
  );
}
