import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idsParam = url.searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json([]);
  }
  const ids = idsParam.split(",").filter(Boolean);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, phone, address, city, providers(company_name, tax_id)"
    )
    .in("id", ids);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = await Promise.all(
    (data || []).map(async (p) => {
      const { data: userData } = await supabase.auth.admin.getUserById(p.id);
      return {
        id: p.id,
        full_name: p.full_name ?? null,
        email: userData.user?.email ?? null,
        phone: p.phone ?? null,
        address: p.address ?? null,
        city: p.city ?? null,
        company_name: p.providers?.[0]?.company_name ?? null,
        tax_id: p.providers?.[0]?.tax_id ?? null,
            };
    })
  );
  return NextResponse.json(rows);
}
