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
    .from("providers")
    .select(
      "user_id, company_name, tax_id, profiles(full_name, email, phone, address, city)"
    )
    .in("user_id", ids);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const rows = (data || []).map((p) => ({
    id: p.user_id,
    full_name: p.profiles?.full_name ?? null,
    email: p.profiles?.email ?? null,
    phone: p.profiles?.phone ?? null,
    address: p.profiles?.address ?? null,
    city: p.profiles?.city ?? null,
    company_name: p.company_name ?? null,
    tax_id: p.tax_id ?? null,
  }));
  return NextResponse.json(rows);
}
