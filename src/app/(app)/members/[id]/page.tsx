import { initialData } from "@/lib/demo-data";
import { MemberProfileClient } from "./MemberProfileClient";

export function generateStaticParams() {
  return initialData.users.map((user) => ({ id: user.id }));
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MemberProfileClient id={id} />;
}
