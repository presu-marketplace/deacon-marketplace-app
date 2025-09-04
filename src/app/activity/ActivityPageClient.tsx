"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import useUser from "@/features/auth/useUser";
import { supabase } from "@/lib/supabaseClient";
import ServiceRequestModal, { RequestStatus, ModalTranslations } from "./ServiceRequestModal";

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
  provider_id?: string | null;
  user_name?: string | null;
  service_deadline?: string | null;
  request_invoice_urls?: string[] | null;
  service_location?: string | null;
  request_message?: string | null;
  request_property_type?: string | null;
  request_cleaning_type?: string | null;
  request_cleaning_frequency?: string | null;
  user_email?: string | null;
  user_telephone?: string | null;
  user_address?: string | null;
  user_city?: string | null;
  provider_assigned_at?: string | null;
  request_closed_at?: string | null;
  provider?: {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    company_name?: string | null;
    tax_id?: string | null;
  } | null;
}

interface ProviderServiceRow {
  service_id: string;
  provider_id: string;
  providers: { profiles?: { full_name: string | null } | null } | null;
}

type Locale = "en" | "es";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status?: string | null;
  serviceId?: string | null;
  providerId?: string | null;
  userName?: string | null;
  dueDate?: string | null;
  attachments?: string[] | null;
  message?: string | null;
  serviceLocation?: string | null;
  requestPropertyType?: string | null;
  requestCleaningType?: string | null;
  requestCleaningFrequency?: string | null;
  userEmail?: string | null;
  userTelephone?: string | null;
  userAddress?: string | null;
  userCity?: string | null;
  providerName?: string | null;
  providerCompany?: string | null;
  providerTaxId?: string | null;
  providerPhone?: string | null;
  providerAddress?: string | null;
  providerCity?: string | null;
  providerEmail?: string | null;
  providerAssignedAt?: string | null;
  requestClosedAt?: string | null;
  serviceSlug?: string | null;
};

interface PageTranslations {
  searchPlaceholder: string;
  results: string;
  all: string;
  open: string;
  assigned: string;
  closed: string;
  noDescription: string;
  user: string;
  due: string;
  asc: string;
  desc: string;
  filterLabel: string;
}

// ---------- Pure helpers (exported for tests) ----------
export function normalizeStatus(status?: string | null) {
  return (status || "").toLowerCase();
}

export function filterItems(
  items: ActivityItem[],
  query: string,
  statusFilter: "all" | "open" | "assigned" | "closed"
) {
  const q = (query || "").trim().toLowerCase();
  const equivalents: Record<Exclude<typeof statusFilter, "all">, string[]> = {
    open: ["open", "abierto"],
    assigned: ["assigned", "asignado"],
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

function formatDate(iso: string, locale: Locale) {
  if (!iso) return null;
  const d = new Date(iso);
  const tag = LOCALE_TO_BCP47[locale] || "en-US";
  const date = new Intl.DateTimeFormat(tag, { day: "2-digit", month: "short", year: "numeric" }).format(d);
  return { iso: d.toISOString(), date };
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
  user,
  setUser,
  order,
  setOrder,
  role,
}: {
  query: string;
  setQuery: (v: string) => void;
  status: "all" | "open" | "assigned" | "closed";
  setStatus: (v: "all" | "open" | "assigned" | "closed") => void;
  count: number;
  pageT: PageTranslations;
  user?: string;
  setUser?: (v: string) => void;
  order?: "asc" | "desc";
  setOrder?: (v: "asc" | "desc") => void;
  role?: "client" | "provider" | "admin";
}) {
  const pills: Array<{ key: "all" | "open" | "assigned" | "closed"; label: string }> = [
    { key: "all", label: pageT.all },
    { key: "open", label: pageT.open },
    { key: "assigned", label: pageT.assigned },
    { key: "closed", label: pageT.closed },
  ];
  const isAdmin = role === "admin";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <label htmlFor="activity-search" className="sr-only">
            {pageT.searchPlaceholder}
          </label>
          <input
            id="activity-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pageT.searchPlaceholder}
            className="w-64 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 placeholder-neutral-400 shadow-[0_1px_0_#0000000d] focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M11 19a8 8 0 1 1 5.293-14.293L21 9.414" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </div>
        {isAdmin && (
          <div className="relative">
            <label htmlFor="activity-user" className="sr-only">
              {pageT.user}
            </label>
            <input
              id="activity-user"
              value={user || ""}
              onChange={(e) => setUser && setUser(e.target.value)}
              placeholder={pageT.user}
              className="w-40 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 placeholder-neutral-400 shadow-[0_1px_0_#0000000d] focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label={pageT.filterLabel}>
          {pills.map((p) => (
            <button
              key={p.key}
              onClick={() => setStatus(p.key)}
              aria-pressed={status === p.key}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 ${status === p.key
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
        {isAdmin && (
          <select
            value={order}
            onChange={(e) => setOrder && setOrder(e.target.value as "asc" | "desc")}
            className="rounded-xl border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 shadow-[0_1px_0_#0000000d] focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
          >
            <option value="asc">{pageT.asc}</option>
            <option value="desc">{pageT.desc}</option>
          </select>
        )}
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
    empty: locale === "es" ? "Sin actividad para mostrar" : "No activity to display",
    open: locale === "es" ? "Abierto" : "Open",
    closed: locale === "es" ? "Cerrado" : "Closed",
    assigned: locale === "es" ? "Asignado" : "Assigned",
    noDescription: locale === "es" ? "Sin descripción" : "No description",
    results: locale === "es" ? "resultados" : "results",
    all: locale === "es" ? "Todos" : "All",
    user: locale === "es" ? "Usuario" : "User",
    due: locale === "es" ? "Vence" : "Due",
    asc: locale === "es" ? "Ascendente" : "Ascendant",
    desc: locale === "es" ? "Descendente" : "Descendant",
    filterLabel: locale === "es" ? "Filtrar por estado" : "Filter by status",
  };
  const typedPageT: PageTranslations = {
    searchPlaceholder: t.searchPlaceholder,
    results: pageT.results,
    all: pageT.all,
    open: pageT.open,
    assigned: pageT.assigned,
    closed: pageT.closed,
    noDescription: pageT.noDescription,
    user: pageT.user,
    due: pageT.due,
    asc: pageT.asc,
    desc: pageT.desc,
    filterLabel: pageT.filterLabel,
  };

  const modalT: ModalTranslations = {
    subtitle: locale === "es" ? "Solicitud de servicio" : "Service Request",
    serviceDetails: locale === "es" ? "Detalles del servicio" : "Service Details",
    requester: locale === "es" ? "Solicitante" : "Requester",
    provider: locale === "es" ? "Proveedor" : "Provider",
    timeline: locale === "es" ? "Cronograma" : "Timeline",
    attachments: locale === "es" ? "Adjuntos" : "Attachments",
    systems: locale === "es" ? "Sistemas" : "Systems",
    type: locale === "es" ? "Tipo" : "Type",
    frequency: locale === "es" ? "Frecuencia" : "Frequency",
    property: locale === "es" ? "Propiedad" : "Property",
    location: locale === "es" ? "Ubicación" : "Location",
    email: locale === "es" ? "Correo" : "Email",
    taxId: locale === "es" ? "CUIT" : "Tax ID",
    phone: locale === "es" ? "Teléfono" : "Phone",
    address: locale === "es" ? "Dirección" : "Address",
    requestedOn: locale === "es" ? "Solicitado el" : "Requested on",
    dueBy: locale === "es" ? "Vence" : "Due by",
    assignedAt: locale === "es" ? "Asignado el" : "Assigned at",
    closedAt: locale === "es" ? "Cerrado el" : "Closed at",
    markAsClosed: locale === "es" ? "Marcar como cerrado" : "Mark as Closed",
    assignProvider: locale === "es" ? "Asignar proveedor" : "Assign Provider",
    assign: locale === "es" ? "Asignar" : "Assign",
    cancel: locale === "es" ? "Cancelar" : "Cancel",
    selectProvider: locale === "es" ? "Seleccionar proveedor" : "Select provider",
    unknown: locale === "es" ? "Desconocido" : "Unknown",
    notAssignedYet: locale === "es" ? "Sin asignar aún" : "Not Assigned Yet",
    noProviderAssigned: locale === "es" ? "Sin proveedor asignado" : "No Provider Assigned",
    more: locale === "es" ? "más" : "more",
    status: {
      open: pageT.open,
      assigned: pageT.assigned,
      closed: pageT.closed,
    },
  };

  const user = useUser();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceNames, setServiceNames] = useState<Record<string, { slug: string; name_en: string; name_es: string }>>({});
  const [role, setRole] = useState<"client" | "provider" | "admin">("client");
  const [providersByService, setProvidersByService] = useState<Record<string, { id: string; name: string }[]>>({});

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "assigned" | "closed">("all");
  const [userQuery, setUserQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeItem, setActiveItem] = useState<ActivityItem | null>(null);

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
  }, [router]);

  useEffect(() => {
    const fetchProviders = async () => {
      if (role !== "admin") return;
      try {
        const res = await fetch("/api/providers");
        if (!res.ok) return;
        const rows = (await res.json()) as ProviderServiceRow[];
        const map: Record<string, { id: string; name: string }[]> = {};
        for (const row of rows || []) {
          const name = row.providers?.profiles?.full_name || "";
          if (!map[row.service_id]) map[row.service_id] = [];
          map[row.service_id].push({ id: row.provider_id, name });
        }
        setProvidersByService(map);
      } catch {
        /* ignore */
      }
    };
    fetchProviders();
  }, [role]);

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
      return {
        label: pageT.open,
        rail: "bg-blue-600",
        pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
        accent: "border-blue-600",
      };
    if (s === "assigned" || s === "asignado")
      return {
        label: pageT.assigned,
        rail: "bg-yellow-500",
        pill: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
        accent: "border-yellow-500",
      };
    return {
      label: pageT.closed,
      rail: "bg-gray-500",
      pill: "bg-gray-50 text-gray-700 ring-1 ring-gray-200",
      accent: "border-gray-500",
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      const userRole = (profile?.role as "client" | "provider" | "admin" | null) ?? "client";
      setRole(userRole);
      const selectBase =
        "id, service_id, provider_id, service_description, request_created_at, request_status, user_name, service_deadline, request_invoice_urls, service_location, request_message, request_property_type, request_cleaning_type, request_cleaning_frequency, user_email, user_telephone, user_address, user_city, provider_assigned_at, request_closed_at";

      async function fetchAndEnrich(params: URLSearchParams) {
        const rows = (await fetchFromApi<ServiceRequest[]>("service_requests", params)) || [];
        const providerIds = Array.from(new Set(rows.map((r) => r.provider_id).filter(Boolean))) as string[];
        if (providerIds.length) {
          const res = await fetch(`/api/provider-profiles?ids=${providerIds.join(',')}`);
          if (res.ok) {
            const profiles: Array<{
              id: string;
              full_name: string | null;
              email?: string | null;
              phone: string | null;
              address: string | null;
              city: string | null;
              company_name: string | null;
              tax_id: string | null;
            }> = await res.json();
            const map = Object.fromEntries(profiles.map((p) => [p.id, p]));
            rows.forEach((r) => {
              if (r.provider_id && map[r.provider_id]) {
                r.provider = map[r.provider_id];
              }
            });
          }
        }
        setRequests(rows);
      }

      if (userRole === "client") {
        const params = new URLSearchParams({
          select: selectBase,
          user_id: `eq.${user.id}`,
          order: "request_created_at.desc",
        });
        await fetchAndEnrich(params);
      } else if (userRole === "provider") {
        const params = new URLSearchParams({
          select: selectBase,
          provider_id: `eq.${user.id}`,
          order: "request_created_at.desc",
        });
        await fetchAndEnrich(params);
      } else if (userRole === "admin") {
        const params = new URLSearchParams({
          select: selectBase,
          order: "request_created_at.desc",
          limit: "1000",
        });
        await fetchAndEnrich(params);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const hasData = requests.length > 0;

  const items: ActivityItem[] = useMemo(() => {
    return requests.map((r) => ({
      id: r.id,
      title: getServiceName(r.service_id),
      description: r.service_description || pageT.noDescription,
      createdAt: r.request_created_at,
      status: r.request_status ?? "closed",
      serviceId: r.service_id,
      providerId: r.provider_id,
      userName: r.user_name,
      dueDate:
        r.service_deadline ||
        new Date(new Date(r.request_created_at).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      attachments: r.request_invoice_urls,
      message: r.request_message,
      serviceLocation: r.service_location,
      requestPropertyType: r.request_property_type,
      requestCleaningType: r.request_cleaning_type,
      requestCleaningFrequency: r.request_cleaning_frequency,
      userEmail: r.user_email,
      userTelephone: r.user_telephone,
      userAddress: r.user_address,
      userCity: r.user_city,
      providerName: r.provider?.full_name || null,
      providerCompany: r.provider?.company_name || null,
      providerTaxId: r.provider?.tax_id || null,
      providerPhone: r.provider?.phone || null,
      providerAddress: r.provider?.address || null,
      providerCity: r.provider?.city || null,
      providerEmail: r.provider?.email || null,
      providerAssignedAt: r.provider_assigned_at,
      requestClosedAt: r.request_closed_at,
      serviceSlug: r.service_id ? serviceNames[r.service_id]?.slug || null : null,
    }));
  }, [requests, getServiceName, pageT.noDescription, serviceNames]);

  const filtered = useMemo(() => {
    const base = filterItems(items, query, statusFilter);
    const byUser =
      role === "admin"
        ? base.filter((it) =>
            !userQuery || (it.userName || "").toLowerCase().includes(userQuery.toLowerCase())
          )
        : base;
    return [...byUser].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [items, query, statusFilter, userQuery, sortOrder, role]);

  const assignProvider = useCallback(
    async (requestId: string, providerId: string) => {
      const now = new Date().toISOString();
      const { error } = await supabase.rpc("assign_provider", {
        req_id: requestId,
        prov_id: providerId,
      });

      if (error) {
        console.error("Failed to assign provider", error);
        return;
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                provider_id: providerId,
                provider_assigned_at: now,
                request_status: "assigned",
              }
            : r
        )
      );
      setActiveItem(null);
      router.refresh();
    },
    [router]
  );

  const extendDeadline = useCallback(async (requestId: string, currentDue?: string) => {
    const base = currentDue ? new Date(currentDue) : new Date();
    const extended = new Date(base.getTime() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    await supabase
      .from("service_requests")
      .update({ service_deadline: extended })
      .eq("id", requestId);
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, service_deadline: extended } : r))
    );
  }, []);

  const closeRequest = useCallback(
    async (requestId: string) => {
      const closedAt = new Date().toISOString();
      const { error } = await supabase.rpc("close_request", {
        req_id: requestId,
      });
      if (error) {
        console.error("Failed to close request", error);
        return;
      }
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, request_status: "closed", request_closed_at: closedAt }
            : r
        )
      );
      setActiveItem(null);
      router.refresh();
    },
    [router]
  );

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <div className="bg-white min-h-screen pt-32">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-black mb-6">{pageT.title}</h1>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : !user ? (
            <EmptyState message={pageT.empty} />
          ) : hasData ? (
            <>
              <Toolbar
                query={query}
                setQuery={setQuery}
                status={statusFilter}
                setStatus={setStatusFilter}
                count={filtered.length}
                pageT={typedPageT}
                user={userQuery}
                setUser={setUserQuery}
                order={sortOrder}
                setOrder={setSortOrder}
                role={role}
              />
                {filtered.length ? (
                  <ul className="mt-12 space-y-3">
                    {filtered.map((it) => (
                      <li key={it.id}>
                      <ActivityCard
                        id={it.id}
                        title={it.title}
                        description={it.description}
                        createdAt={it.createdAt}
                        status={it.status}
                        serviceId={it.serviceId}
                        providerId={it.providerId}
                        userName={it.userName}
                        dueDate={it.dueDate}
                        attachments={it.attachments}
                        message={it.message}
                        serviceLocation={it.serviceLocation}
                        requestPropertyType={it.requestPropertyType}
                        requestCleaningType={it.requestCleaningType}
                        requestCleaningFrequency={it.requestCleaningFrequency}
                        userEmail={it.userEmail}
                        userTelephone={it.userTelephone}
                        userAddress={it.userAddress}
                        userCity={it.userCity}
                        providerName={it.providerName}
                        providerPhone={it.providerPhone}
                        providerAddress={it.providerAddress}
                        providerCity={it.providerCity}
                        providerEmail={it.providerEmail}
                        providerAssignedAt={it.providerAssignedAt}
                        requestClosedAt={it.requestClosedAt}
                        serviceSlug={it.serviceSlug}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState message={pageT.empty} />
              )}
            </>
          ) : (
            <EmptyState message={pageT.empty} />
      )}
        </div>
      </div>
      {activeItem && (
        <ServiceRequestModal
          open
          request={{
            id: activeItem.id,
            service_name: activeItem.title,
            service_id: activeItem.serviceId,
            service_description: activeItem.description,
            request_message: activeItem.message,
            service_location: activeItem.serviceLocation,
            service_deadline: activeItem.dueDate,
            request_property_type: activeItem.requestPropertyType,
            request_cleaning_type: activeItem.requestCleaningType,
            request_cleaning_frequency: activeItem.requestCleaningFrequency,
            request_invoice_urls: activeItem.attachments,
            request_status: normalizeStatus(activeItem.status) as RequestStatus,
            request_created_at: activeItem.createdAt,
            provider_assigned_at: activeItem.providerAssignedAt,
            request_closed_at: activeItem.requestClosedAt,
            user_name: activeItem.userName,
            user_email: activeItem.userEmail,
            user_telephone: activeItem.userTelephone,
            user_address: activeItem.userAddress,
            user_city: activeItem.userCity,
            provider_id: activeItem.providerId,
            provider_name: activeItem.providerName,
            provider_company_name: activeItem.providerCompany,
            provider_tax_id: activeItem.providerTaxId,
            provider_email: activeItem.providerEmail,
            provider_telephone: activeItem.providerPhone,
            provider_address: activeItem.providerAddress,
            provider_city: activeItem.providerCity,
          }}
          role={role}
          providers={activeItem.serviceId ? providersByService[activeItem.serviceId] || [] : []}
          onClose={() => setActiveItem(null)}
          onAssign={(id, providerId) => assignProvider(id, providerId)}
          onCloseRequest={role === "provider" ? undefined : (req) => closeRequest(req.id)}
          locale={locale}
          t={modalT}
        />
      )}
    </>
  );

  // -------- Local component --------
  function ActivityCard(props: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    status?: string | null;
    serviceId?: string | null;
    providerId?: string | null;
    userName?: string | null;
    dueDate?: string | null;
    attachments?: string[] | null;
    message?: string | null;
    serviceLocation?: string | null;
    requestPropertyType?: string | null;
    requestCleaningType?: string | null;
    requestCleaningFrequency?: string | null;
    userEmail?: string | null;
    userTelephone?: string | null;
    userAddress?: string | null;
    userCity?: string | null;
    providerName?: string | null;
    providerPhone?: string | null;
    providerAddress?: string | null;
    providerCity?: string | null;
    providerEmail?: string | null;
    providerAssignedAt?: string | null;
    requestClosedAt?: string | null;
    serviceSlug?: string | null;
  }) {
    const { id, title, description, createdAt, status, userName, dueDate, attachments } = props;
    const meta = statusMeta(status);
    const when = createdAt ? formatWhen(createdAt, locale) : null;
    const due = dueDate ? formatDate(dueDate, locale) : null;

    return (
      <motion.div
        className="group relative w-full sm:w-[70%] mx-auto cursor-pointer"
        aria-label={`${title} – ${meta.label}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        whileTap={{ scale: 0.995 }}
        onClick={() => setActiveItem(props)}
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
                      {attachments && attachments.length > 0 && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 text-neutral-400"
                          aria-label="Has attachments"
                        >
                          <path d="M21.44 11.05L13 19.5a5 5 0 01-7.07-7.07l8.49-8.49a3 3 0 014.24 4.24l-8.49 8.49a1 1 0 01-1.41-1.41l7.78-7.78" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-5 ${meta.pill}`}>{meta.label}</span>
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5" aria-hidden>
                        <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <p className="mt-1 text-neutral-700 line-clamp-2 text-sm">{description}</p>

                  {due && (
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4 text-[12px] text-neutral-500">
                      {role === "admin" && userName && <span>{userName}</span>}
                      <span>
                        {pageT.due}: <time dateTime={due.iso}>{due.date}</time>
                      </span>
                      {role === "admin" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            extendDeadline(id, dueDate ?? undefined);
                          }}
                          className="rounded bg-neutral-200 px-2 py-0.5 text-xs text-neutral-700"
                        >
                          {locale === "es" ? "Extender +3d" : "Extend +3d"}
                        </button>
                      )}
                    </div>
                  )}

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

                  {/* Provider assignment handled within ServiceRequestModal */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

}

function SkeletonCard() {
  return (
    <div className="w-full sm:w-[70%] mx-auto flex overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_0_#0000000d]">
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
