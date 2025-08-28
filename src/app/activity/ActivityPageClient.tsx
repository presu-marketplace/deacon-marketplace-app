"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import useUser from "@/features/auth/useUser";
import { supabase } from "@/lib/supabaseClient";

/**
 * Uber‑style inspired Activity UI
 * - Big, breathable cards with strong type hierarchy
 * - Left color rail for quick status recognition
 * - Subtle borders + soft shadow that lifts on hover
 * - Tactile hit areas, chevron affordance
 * - Compact badges, neutral palette
 */

interface ServiceRequest {
  id: string;
  service_description: string | null;
  request_created_at: string;
  request_status?: string | null;
  service_id?: string | null;
}

interface Offer {
  request_id: string;
  service_slug: string;
  description?: string | null;
  status?: string | null;
  created_at?: string;
}

type Locale = "en" | "es";

export default function ActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const langParam = searchParams.get("lang");

  const initialLocale: Locale = useMemo(() => {
    if (langParam === "es" || langParam === "en") return langParam;
    if (typeof navigator !== "undefined") {
      return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
    }
    return "en";
  }, [langParam]);

  const [locale, setLocale] = useState<Locale>(initialLocale);
  useEffect(() => {
    if (langParam === "es" || langParam === "en") setLocale(langParam);
  }, [langParam]);

  const toggleLocale = () => {
    const newLocale = locale === "es" ? "en" : "es";
    setLocale(newLocale);
    const q = new URLSearchParams(Array.from(searchParams.entries()));
    q.set("lang", newLocale);
    router.replace(`${pathname}?${q.toString()}`);
  };

  const t = {
    howItWorks: locale === "es" ? "Cómo funciona" : "How it works",
    login: locale === "es" ? "Iniciar sesión" : "Log In",
    signup: locale === "es" ? "Crear cuenta" : "Sign Up",
    searchPlaceholder: locale === "es" ? "Buscar servicio..." : "Search service...",
    language: locale === "es" ? "Español" : "English",
    joinAsPro: locale === "es" ? "Unirse como proveedor" : "Join as provider",
  };

  const pageT = {
    title: locale === "es" ? "Actividad" : "Activity",
    loading: locale === "es" ? "Cargando..." : "Loading...",
    empty: locale === "es" ? "Sin actividad" : "No activity yet",
    open: locale === "es" ? "abierto" : "open",
    closed: locale === "es" ? "cerrado" : "closed",
    pending: locale === "es" ? "pendiente" : "pending",
    assigned: locale === "es" ? "asignado" : "assigned",
    noDescription: locale === "es" ? "Sin descripción" : "No description",
    service: locale === "es" ? "Servicio" : "Service",
  };

  const user = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceNames, setServiceNames] = useState<
    Record<string, { slug: string; name_en: string; name_es: string }>
  >({});

  const fetchFromApi = async <T,>(path: string, params: URLSearchParams): Promise<T | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return null;

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}?${params.toString()}`;
    const headers = {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${session.access_token}`,
    } as const;

    let res = await fetch(url, { headers });
    if (res.status === 403) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (refreshed.session) {
        res = await fetch(url, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${refreshed.session.access_token}`,
          },
        });
      }
    }
    if (!res.ok) {
      console.error("API request failed", res.status, await res.text());
      return null;
    }
    return (await res.json()) as T;
  };

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from("services").select("id, slug, name_en, name_es");
      const map = Object.fromEntries(
        ((data as { id: string; slug: string; name_en: string; name_es: string }[]) || []).map(
          (s) => [s.id, { slug: s.slug, name_en: s.name_en, name_es: s.name_es }]
        )
      );
      setServiceNames(map);
    };
    fetchServices();
  }, []);

  const getServiceName = (key?: string | null) => {
    if (!key) return "";
    const entry = serviceNames[key] || Object.values(serviceNames).find((s) => s.slug === key);
    if (!entry) return "";
    return (locale === "es" ? entry.name_es : entry.name_en) || entry.slug;
  };

  const normalizeStatus = (status?: string | null) => (status || "").toLowerCase();
  const statusMeta = (status?: string | null) => {
    const s = normalizeStatus(status);
    if (s === "open" || s === "abierto")
      return { label: pageT.open, rail: "bg-amber-500", pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" };
    if (s === "assigned" || s === "asignado")
      return { label: pageT.assigned, rail: "bg-blue-600", pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" };
    if (s === "pending" || s === "pendiente")
      return { label: pageT.pending, rail: "bg-yellow-500", pill: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200" };
    // closed / default
    return { label: pageT.closed, rail: "bg-emerald-600", pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      const userRole = (profile?.role as string | null) ?? "client";
      setRole(userRole);

      if (userRole === "client") {
        const params = new URLSearchParams({
          select: "id, service_id, service_description, request_created_at, request_status",
          user_id: `eq.${user.id}`,
          order: "request_created_at.desc",
        });
        const rows =
          (await fetchFromApi<
            { id: string; service_id: string | null; service_description: string | null; request_created_at: string; request_status?: string | null }[]
          >("service_requests", params)) || [];
        setRequests(
          rows.map((r) => ({
            id: r.id,
            service_id: r.service_id,
            service_description: r.service_description,
            request_created_at: r.request_created_at,
            request_status: r.request_status,
          }))
        );
      } else if (userRole === "provider") {
        const baseParams = new URLSearchParams({ select: "request_id, service_slug, status", provider_id: `eq.${user.id}` });
        let rows = (await fetchFromApi<{ request_id: string; service_slug: string; status?: string | null }[]>(
          "service_request_services",
          baseParams
        )) || [];
        if (!rows.length) {
          const fallback = await fetchFromApi<{ request_id: string; service_slug: string; status?: string | null }[]>(
            "service_request_services",
            new URLSearchParams({ select: "request_id, service_slug", provider_id: `eq.${user.id}` })
          );
          rows = fallback || [];
        }
        const ids = rows.map((r) => r.request_id);
        let reqData: Record<string, { description: string | null; created_at: string }> = {};
        if (ids.length) {
          const reqParams = new URLSearchParams({ select: "id, service_description, request_created_at", id: `in.(${ids.join(",")})` });
          const reqs =
            (await fetchFromApi<{ id: string; service_description: string | null; request_created_at: string }[]>(
              "service_requests",
              reqParams
            )) || [];
          reqData = Object.fromEntries(reqs.map((r) => [r.id, { description: r.service_description, created_at: r.request_created_at }]));
        }
        setOffers(
          rows.map((r) => ({
            ...r,
            description: reqData[r.request_id]?.description || null,
            created_at: reqData[r.request_id]?.created_at,
          }))
        );
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const hasData = (role === "client" && requests.length > 0) || (role === "provider" && offers.length > 0);

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <div className="bg-white min-h-screen pt-32">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold tracking-tight text-black mb-6">{pageT.title}</h1>

          {(!user || loading) && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {user && !loading && (
            <div>
              {hasData ? (
                <ul className="space-y-3">
                  {role === "client" &&
                    requests.map((r) => (
                      <li key={r.id}>
                        <ActivityCard
                          title={getServiceName(r.service_id)}
                          description={r.service_description || pageT.noDescription}
                          createdAt={r.request_created_at}
                          status={r.request_status}
                          metaLabel={pageT.service}
                          metaValue={getServiceName(r.service_id)}
                        />
                      </li>
                    ))}

                  {role === "provider" &&
                    offers.map((o) => (
                      <li key={`${o.request_id}-${o.service_slug}`}>
                        <ActivityCard
                          title={getServiceName(o.service_slug)}
                          description={o.description || pageT.noDescription}
                          createdAt={o.created_at || ""}
                          status={o.status}
                          metaLabel={pageT.service}
                          metaValue={getServiceName(o.service_slug)}
                        />
                      </li>
                    ))}
                </ul>
              ) : (
                <EmptyState message={pageT.empty} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );

  function ActivityCard(props: {
    title: string;
    description: string;
    createdAt: string;
    status?: string | null;
    metaLabel?: string;
    metaValue?: string;
  }) {
    const meta = statusMeta(props.status);
    const date = props.createdAt ? new Date(props.createdAt) : null;
    const dateStr = date ? date.toLocaleDateString() : "";

    return (
      <button
        type="button"
        className="group relative w-full text-left"
        aria-label={`${props.title} – ${meta.label}`}
      >
        <div className="flex overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_0_#0000000d] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          {/* Status rail */}
          <div className={`w-1 sm:w-1.5 ${meta.rail}`} aria-hidden />

          {/* Main content */}
          <div className="flex w-full items-stretch p-4 sm:p-5">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 hidden sm:block" aria-hidden>
                  {/* Dot avatar */}
                  <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-4 w-4">
                      <circle cx="12" cy="12" r="10" fill="currentColor" className="text-neutral-300" />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="truncate text-[15px] sm:text-base font-semibold text-neutral-900">
                      {props.title}
                    </h2>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-5 ${meta.pill}`}>
                        {meta.label}
                      </span>
                      {/* Chevron */}
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      >
                        <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-neutral-700">
                    {props.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-neutral-500">
                    {props.metaValue && (
                      <span className="inline-flex items-center gap-1">
                        <span className="uppercase tracking-wide text-neutral-400">{props.metaLabel}:</span>
                        <span className="text-neutral-700">{props.metaValue}</span>
                      </span>
                    )}
                    {dateStr && (
                      <span className="inline-flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                          <path d="M7 10h10M7 14h6M5 5h14v14H5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        {dateStr}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  }
}

function SkeletonCard() {
  return (
    <div className="flex overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_0_#0000000d]">
      <div className="w-1.5 bg-neutral-200" aria-hidden />
      <div className="w-full p-5">
        <div className="h-4 w-40 bg-neutral-200 rounded" />
        <div className="mt-2 h-3 w-full bg-neutral-200/70 rounded" />
        <div className="mt-1.5 h-3 w-3/4 bg-neutral-200/70 rounded" />
        <div className="mt-3 h-4 w-24 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 py-14">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-white shadow-[0_1px_0_#0000000d] ring-1 ring-neutral-200 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-neutral-400" aria-hidden>
            <path d="M3 7h18M7 7v10m10-10v10M5 17h14" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="text-sm text-neutral-600">{message}</p>
      </div>
    </div>
  );
}
