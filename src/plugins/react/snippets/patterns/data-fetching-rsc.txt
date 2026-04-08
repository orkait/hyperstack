// ✅ Fetch in RSC — no loading state, no useEffect
export default async function Page({ params }: { params: { id: string } }) {
  const data = await fetch(`/api/items/${params.id}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  }).then(r => r.json());
  return <Detail data={data} />;
}

// ✅ Client-side: React Query (not useEffect)
"use client";
import { useQuery } from "@tanstack/react-query";
function ClientWidget() {
  const { data } = useQuery({ queryKey: ["widget"], queryFn: fetchWidget });
  return <div>{data?.value}</div>;
}