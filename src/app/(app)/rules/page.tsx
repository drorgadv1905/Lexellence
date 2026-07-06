"use client";

import { useData } from "@/lib/store";
import { PageHeader } from "@/components/ui/Card";

export default function RulesPage() {
  const { data } = useData();
  const rulesContent = data.systemContent.find((c) => c.key === "rules");

  return (
    <div>
      <PageHeader title="כללי הפורום" subtitle="כללי התנהגות, אתיקה ודיסקרטיות" />

      <div className="card max-w-3xl">
        <div className="card-body">
          <div className="prose prose-forest max-w-none">
            {rulesContent?.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-bold text-forest-800 mt-6 mb-2 first:mt-0">
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.trim()) {
                return (
                  <p key={i} className="text-forest-700 leading-relaxed mb-3">
                    {line}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
