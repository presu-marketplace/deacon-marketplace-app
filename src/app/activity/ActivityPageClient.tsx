"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import useUser from "@/features/auth/useUser";
import { supabase } from "@/lib/supabaseClient";

/**
 * Uber‑style inspired Activity UI
 * - Professional neutral palette
 * - Left status rail, compact status pill
 * - Search + localized status filters
 * - Clean date row with calendar‑clock icon
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

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status?: string | null;
};

interface PageTranslations {
  searchPlaceholder: string;
  results: string;
  all: string;
  open: string;
  assigned: string;
  pending: string;
  closed: string;
  noDescription: string;
}

// ---------- Pure helpers (exported for tests) ----------
export function normalizeStatus(status?: string | null) {
  return (status || "").toLowerCase();
}

export function filterItems(
  items: ActivityItem[],
  query: string,
  statusFilter: "all" | "open" | "assigned" | "pending" | "closed"
) {
  const q = (query || "").trim().toLowerCase();
  const equivalents: Record<Exclude<typeof statusFilter, "all">, string[]> = {
    open: ["open", "abierto"],
    assigned: ["assigned", "asignado"],
    pending: ["pending", "pendiente"],
    closed: ["closed", "cerrado"],
  };

  return items.filter((it) => {
    const matchesText = !q || it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q);
    const s = normalizeStatus(it.status);
    const matchesStatus =
      statusFilter === "all" || (equivalents[statusFilter as Exclude<typeof statusFilter, "all">] || []).includes(s);
    return matchesText && matchesStatus;
  });
}

const LOCALE_TO_BCP47: Record<Locale, string> = { es: "es-AR", en: "en-US" };

function formatWhen(iso: string, locale: Locale) {
  if (!iso) return null;
  const d = new Date(iso);
  const tag = LOCALE_TO_BCP47[locale] || "en-US";
  const date = new Intl.DateTimeFormat(tag, { day: "2-digit", month: "short", year: "numeric" }).format(d);
  const time = new Intl.DateTimeFormat(tag, { hour: "2-digit", minute: "2-digit" }).format(d);
  return { iso: d.toISOString(), date, time };
}

// -------------------------------------------------------

/**
 * Toolbar is defined before ActivityPage to avoid parse/hoisting surprises
 */
function Toolbar({
  query,
  setQuery,
  status,
  setStatus,
  count,
  pageT,
}: {
  query: string;
  setQuery: (v: string) => void;
  status: "all" | "open" | "assigned" | "pending" | "closed";
  setStatus: (v: "all" | "open" | "assigned" | "pending" | "closed") => void;
  count: number;
  pageT: PageTranslations;
}) {
  const pills: Array<{ key: "all" | "open" | "assigned" | "pending" | "closed"; label: string }> = [
    { key: "all", label: pageT.all },
    { key: "open", label: pageT.open },
    { key: "assigned", label: pageT.assigned },
    { key: "pending", label: pageT.pending },
    { key: "closed", label: pageT.closed },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            id="activity-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pageT.searchPlaceholder}
            className="w-64 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 placeholder-neutral-400 shadow-[0_1px_0_#0000000d] focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M11 19a8 8 0 1 1 5.293-14.293L21 9.414" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </div>
        <div className="flex items-center gap-1">
          {pills.map((p) => (
            <button
              key={p.key}
              onClick={() => setStatus(p.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition ${status === p.key
                ? "bg-neutral-900 text-white ring-neutral-900"
                : "bg-white text-neutral-700 ring-neutral-200 hover:bg-neutral-50"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-500">{count} {pageT.results}</span>
      </div>
    </div>
  );
}

// -------------------------------------------------------

export default function ActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const langParam = searchParams.get("lang");

  const [locale, setLocale] = useState<Locale>(() => {
    if (langParam === "es" || langParam === "en") return langParam;
    if (typeof navigator !== "undefined") {
      return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
    }
    return "en";
  });

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
    searchPlaceholder: locale === "es" ? "Buscar actividad…" : "Search activity…",
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
    results: locale === "es" ? "resultados" : "results",
    all: locale === "es" ? "Todos" : "All",
  };
  const typedPageT: PageTranslations = {
    searchPlaceholder: t.searchPlaceholder,
    results: pageT.results,
    all: pageT.all,
    open: pageT.open,
    assigned: pageT.assigned,
    pending: pageT.pending,
    closed: pageT.closed,
    noDescription: pageT.noDescription,
  };

  const user = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceNames, setServiceNames] = useState<Record<string, { slug: string; name_en: string; name_es: string }>>({});

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "assigned" | "pending" | "closed">("all");

  // -------- fetch helper --------
  const fetchFromApi = async <T,>(path: string, params: URLSearchParams): Promise<T | null> => {
    let {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      const { data } = await supabase.auth.refreshSession();
      session = data.session;
    }
    if (!session) return null;
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}?${params.toString()}`;
    const getHeaders = (token: string) => ({
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${token}`,
    }) as const;
    let res = await fetch(url, { headers: getHeaders(session.access_token) });
    if (res.status === 401) {
      const { data } = await supabase.auth.refreshSession();
      const refreshed = data.session;
      if (!refreshed) return null;
      res = await fetch(url, { headers: getHeaders(refreshed.access_token) });
    }
    if (!res.ok) return null;
    return (await res.json()) as T;
  };
  // --------------------------------------------------

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from("services").select("id, slug, name_en, name_es");
      const map = Object.fromEntries(
        ((data as { id: string; slug: string; name_en: string; name_es: string }[]) || []).map((s) => [
          s.id,
          { slug: s.slug, name_en: s.name_en, name_es: s.name_es },
        ])
      );
      setServiceNames(map);
    };
    fetchServices();
  }, []);

  const getServiceName = useCallback(
    (key?: string | null) => {
      if (!key) return "";
      const entry = serviceNames[key] || Object.values(serviceNames).find((s) => s.slug === key);
      if (!entry) return "";
      return (locale === "es" ? entry.name_es : entry.name_en) || entry.slug;
    },
    [serviceNames, locale]
  );

  const statusMeta = (status?: string | null) => {
    const s = normalizeStatus(status);
    if (s === "open" || s === "abierto")
      return { label: pageT.open, rail: "bg-indigo-600", pill: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" };
    if (s === "assigned" || s === "asignado")
      return { label: pageT.assigned, rail: "bg-blue-600", pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" };
    if (s === "pending" || s === "pendiente")
      return { label: pageT.pending, rail: "bg-yellow-500", pill: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200" };
    return { label: pageT.closed, rail: "bg-emerald-600", pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
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
        const rows = (await fetchFromApi<ServiceRequest[]>("service_requests", params)) || [];
        setRequests(rows);
      } else if (userRole === "provider") {
        const baseParams = new URLSearchParams({ select: "request_id, service_slug, status", provider_id: `eq.${user.id}` });
        const rows = (await fetchFromApi<Offer[]>("service_request_services", baseParams)) || [];
        setOffers(rows);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const hasData = (role === "client" && requests.length > 0) || (role === "provider" && offers.length > 0);

  const items: ActivityItem[] = useMemo(() => {
    if (role === "client") {
      return requests.map((r) => ({
        id: r.id,
        title: getServiceName(r.service_id),
        description: r.service_description || pageT.noDescription,
        createdAt: r.request_created_at,
        status: r.request_status ?? "closed",
      }));
    }
    if (role === "provider") {
      return offers.map((o) => ({
        id: `${o.request_id}-${o.service_slug}`,
        title: getServiceName(o.service_slug),
        description: o.description || pageT.noDescription,
        createdAt: o.created_at || "",
        status: o.status ?? "closed",
      }));
    }
    return [];
  }, [role, requests, offers, getServiceName, pageT.noDescription]);

  const filtered = useMemo(() => filterItems(items, query, statusFilter), [items, query, statusFilter]);

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <div className="bg-white min-h-screen pt-32">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold tracking-tight text-black mb-6">{pageT.title}</h1>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : !user ? (
            <EmptyState message={pageT.empty} />
          ) : (
            <>
              <Toolbar query={query} setQuery={setQuery} status={statusFilter} setStatus={setStatusFilter} count={filtered.length} pageT={typedPageT} />
              {hasData ? (
                <ul className="mt-4 space-y-3">
                  {filtered.map((it) => (
                    <li key={it.id}>
                      <ActivityCard title={it.title} description={it.description} createdAt={it.createdAt} status={it.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState message={pageT.empty} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );

  // -------- Local component --------
  function ActivityCard(props: { title: string; description: string; createdAt: string; status?: string | null }) {
    const { title, description, createdAt, status } = props;
    const meta = statusMeta(status);
    const when = createdAt ? formatWhen(createdAt, locale) : null;

    return (
      <motion.button
        type="button"
        className="group relative w-full text-left"
        aria-label={`${title} – ${meta.label}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_0_#0000000d] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className={`w-1 sm:w-1.5 ${meta.rail}`} aria-hidden />
          <div className="flex w-full items-stretch p-4 sm:p-5">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="truncate font-semibold text-neutral-900 text-[15px] sm:text-base">{title}</h2>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-5 ${meta.pill}`}>{meta.label}</span>
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5" aria-hidden>
                        <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <p className="mt-1 text-neutral-700 line-clamp-2 text-sm">{description}</p>

                  {when && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-neutral-500 leading-none">
                      {/* Better calendar + small clock */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 shrink-0 text-neutral-400 -translate-y-px"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <circle cx="17" cy="17" r="3.5" />
                        <line x1="17" y1="17" x2="17" y2="15.5" />
                        <line x1="17" y1="17" x2="18.5" y2="17" />
                      </svg>

                      <time dateTime={when.iso} title={`${when.date} ${when.time}`}>
                        {when.date} · {when.time}
                      </time>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.button>
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
