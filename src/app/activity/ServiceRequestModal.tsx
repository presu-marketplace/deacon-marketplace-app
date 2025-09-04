"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiFileText,
  FiUser,
  FiHome,
  FiRepeat,
  FiLayers,
} from "react-icons/fi";

export type RequestStatus = "open" | "assigned" | "pending" | "closed";

export interface ServiceRequest {
  id: string;
  service_name?: string | null;
  service_id?: string | null;
  service_description?: string | null;
  service_location?: string | null;
  service_deadline?: string | null;
  request_property_type?: string | null;
  request_cleaning_type?: string | null;
  request_cleaning_frequency?: string | null;
  request_message?: string | null;
  request_systems?: unknown[] | null;
  request_invoice_urls?: string[] | null;
  request_status: RequestStatus;
  request_created_at?: string | null;
  request_closed_at?: string | null;
  provider_assigned_at?: string | null;
  user_id?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  user_telephone?: string | null;
  user_address?: string | null;
  user_city?: string | null;
  provider_name?: string | null;
  provider_email?: string | null;
  provider_telephone?: string | null;
  provider_address?: string | null;
  provider_city?: string | null;
}
export interface ModalTranslations {
  subtitle: string;
  serviceDetails: string;
  requester: string;
  provider: string;
  timeline: string;
  attachments: string;
  systems: string;
  type: string;
  frequency: string;
  property: string;
  location: string;
  email: string;
  phone: string;
  address: string;
  requestedOn: string;
  dueBy: string;
  assignedAt: string;
  closedAt: string;
  markAsClosed: string;
  assignProvider: string;
  assign: string;
  cancel: string;
  selectProvider: string;
  unknown: string;
  status: Record<RequestStatus, string>;
  more: string;
}

const LOCALE_MAP: Record<"en" | "es", string> = { en: "en-US", es: "es-AR" };

const fmtDate = (iso?: string | null, locale: "en" | "es" = "en") =>
  iso
    ? new Date(iso).toLocaleString(LOCALE_MAP[locale], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

const fmtDateOnly = (iso?: string | null, locale: "en" | "es" = "en") =>
  iso ? new Date(iso).toLocaleDateString(LOCALE_MAP[locale], { dateStyle: "medium" }) : null;

function classNames(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

function StatusBadge({
  status,
  labels,
}: {
  status: RequestStatus;
  labels: Record<RequestStatus, string>;
}) {
  const color: Record<RequestStatus, string> = {
    open: "bg-blue-600 text-white",
    assigned: "bg-amber-500 text-white",
    pending: "bg-gray-600 text-white",
    closed: "bg-neutral-200 text-neutral-700",
  };
  return (
    <span className={classNames("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm", color[status])}>
      {labels[status] || status}
    </span>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-neutral-50 px-3 py-1 text-base font-semibold text-neutral-800">
      <Icon className="h-4 w-4" />
      {children}
    </div>
  );
}

function FieldRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label?: string;
  value?: React.ReactNode;
  href?: string;
}) {
  if (!value) return null;
  const Content = (
    <div className="ml-4 flex min-w-0 items-start gap-2 py-1 text-sm text-neutral-700">
      <Icon className="mt-0.5 h-4 w-4 flex-none text-neutral-400" />
      <div className="min-w-0">
        {label ? <div className="text-xs font-medium text-neutral-500">{label}</div> : null}
        <div className="truncate">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a className="hover:underline" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {Content}
    </a>
  ) : (
    Content
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="mr-2 inline-flex items-center rounded-full border border-neutral-200 px-2 py-0.5 text-xs text-neutral-700">{children}</span>;
}

function Note({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 text-sm text-neutral-700">{children}</div>;
}

function TimelineItem({
  icon: Icon,
  title,
  when,
  danger,
}: {
  icon: React.ElementType;
  title: string;
  when?: string | null;
  danger?: boolean;
}) {
  if (!when) return null;
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1.5 h-4 w-px bg-neutral-200" />
      <Icon className={classNames("absolute left-[-10px] top-0 h-5 w-5", danger ? "text-red-500" : "text-neutral-400")} />
      <div className={classNames("text-sm", danger ? "text-red-600" : "text-neutral-800")}>{title}</div>
      <div className={classNames("text-xs", danger ? "text-red-500" : "text-neutral-500")}>{when}</div>
    </div>
  );
}

function AttachmentList({ urls }: { urls: string[] }) {
  const [sizes, setSizes] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();
    async function fetchSizes() {
      const entries = await Promise.all(
        urls.map(async (url) => {
          try {
            const res = await fetch(url, { method: "HEAD", signal: controller.signal });
            const len = res.headers.get("content-length");
            return [url, len ? parseInt(len, 10) : 0] as const;
          } catch {
            return [url, 0] as const;
          }
        })
      );
      setSizes(Object.fromEntries(entries));
    }
    fetchSizes();
    return () => controller.abort();
  }, [urls]);

  const fmt = (n: number) => {
    if (!n) return null;
    const units = ["B", "KB", "MB", "GB"]; // simple
    const idx = Math.floor(Math.log(n) / Math.log(1024));
    return `${(n / Math.pow(1024, idx)).toFixed(1)} ${units[idx]}`;
  };

  return (
    <ul className="space-y-1">
      {urls.map((url, idx) => {
        const size = sizes[url];
        const name = url.split("/").pop();
        return (
          <li key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
            <FiFileText className="h-4 w-4 text-neutral-400" />
            <a href={url} target="_blank" rel="noreferrer" className="truncate hover:underline">
              {name || url}
            </a>
            {size ? <span className="text-xs text-neutral-500">({fmt(size)})</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function ServiceRequestModal({
  open,
  request,
  onClose,
  role,
  providers,
  onAssign,
  onCloseRequest,
  locale,
  t,
}: {
  open: boolean;
  request: ServiceRequest;
  onClose: () => void;
  role: "client" | "provider" | "admin";
  providers?: { id: string; name: string }[];
  onAssign?: (id: string, providerId: string) => void;
  onCloseRequest?: (req: ServiceRequest) => void;
  locale: "en" | "es";
  t: ModalTranslations;
}) {
  const [assignMode, setAssignMode] = useState(false);
  const [selected, setSelected] = useState("");

  if (!open) return null;

  const systems = Array.isArray(request.request_systems)
    ? (request.request_systems as unknown[])
    : [];
  const hasFiles = (request.request_invoice_urls?.length ?? 0) > 0;
  const overdue = request.service_deadline ? new Date(request.service_deadline) < new Date() : false;
  // Clients see provider details only when a request has been assigned
  const showProvider = role === "client" && request.request_status === "assigned";
  const personName = showProvider ? request.provider_name : request.user_name;
  const personCity = showProvider ? request.provider_city : request.user_city;
  const personEmail = showProvider ? request.provider_email : request.user_email;
  const personPhone = showProvider ? request.provider_telephone : request.user_telephone;
  const addr = fullAddress(request, showProvider ? "provider" : "user");

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="fixed left-1/2 top-1/2 z-50 w-[min(920px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-neutral-900">
              {request.service_name || t.subtitle}
            </h2>
            <p className="mt-0.5 text-sm text-neutral-500">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={request.request_status} labels={t.status} />
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Close"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-5 sm:grid-cols-2">
          <section>
            <SectionLabel icon={FiFileText}>{t.serviceDetails}</SectionLabel>

            <FieldRow icon={FiLayers} label={t.type} value={request.request_cleaning_type} />
            <FieldRow
              icon={FiRepeat}
              label={t.frequency}
              value={
                request.request_cleaning_frequency && (
                  <Chip>{request.request_cleaning_frequency}</Chip>
                )
              }
            />
            <FieldRow icon={FiHome} label={t.property} value={request.request_property_type} />
            <FieldRow icon={FiMapPin} label={t.location} value={request.service_location || request.user_city} />

            <Note>{request.request_message || request.service_description}</Note>

            {systems.length > 0 && (
              <div className="mt-3">
                <div className="mb-1 text-xs font-medium text-neutral-500">{t.systems}</div>
                <div>
                  {systems.slice(0, 8).map((s, i) => {
                    const name =
                      typeof s === "object" && s !== null && "name" in s
                        ? String((s as { name?: unknown }).name ?? "")
                        : String(s);
                    return <Chip key={i}>{name}</Chip>;
                  })}
                  {systems.length > 8 && <Chip>+{systems.length - 8} {t.more}</Chip>}
                </div>
              </div>
            )}

            {hasFiles && (
              <div className="mt-4">
                <div className="mb-1 text-xs font-medium text-neutral-500">{t.attachments}</div>
                <AttachmentList urls={request.request_invoice_urls!} />
              </div>
            )}
          </section>

          <section>
            <SectionLabel icon={FiUser}>{showProvider ? t.provider : t.requester}</SectionLabel>

            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                {getInitials(personName)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-neutral-800">
                  {personName || t.unknown}
                </div>
                {personCity ? (
                  <div className="truncate text-xs text-neutral-500">{personCity}</div>
                ) : null}
              </div>
            </div>

            <FieldRow icon={FiMail} label={t.email} value={personEmail} href={personEmail ? `mailto:${personEmail}` : undefined} />
            <FieldRow icon={FiPhone} label={t.phone} value={personPhone} href={personPhone ? `tel:${personPhone}` : undefined} />
            <FieldRow icon={FiMapPin} label={t.address} value={addr} href={mapsHref(addr)} />

            <div className="mt-4">
              <SectionLabel icon={FiCalendar}>{t.timeline}</SectionLabel>
              <div className="space-y-3">
                <TimelineItem icon={FiClock} title={t.requestedOn} when={fmtDate(request.request_created_at, locale)} />
                <TimelineItem icon={FiCalendar} title={t.dueBy} when={fmtDateOnly(request.service_deadline, locale)} danger={overdue} />
                <TimelineItem icon={FiUser} title={t.assignedAt} when={fmtDate(request.provider_assigned_at, locale)} />
                <TimelineItem icon={FiCalendar} title={t.closedAt} when={fmtDate(request.request_closed_at, locale)} />
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-6 py-4">
          <div className="text-xs text-neutral-500">ID: {request.id}</div>
          <div className="flex items-center gap-2">
            {request.request_status !== "closed" && role !== "provider" && (
              <button
                onClick={() => onCloseRequest?.(request)}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                {t.markAsClosed}
              </button>
            )}
            {request.request_status === "open" && role === "admin" && (
              assignMode ? (
                <>
                  <select
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    <option value="">{t.selectProvider}</option>
                    {(providers || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.id}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={async () => {
                      if (selected) {
                        await onAssign?.(request.id, selected);
                        onClose?.();
                      }
                      setAssignMode(false);
                      setSelected("");
                    }}
                    disabled={!selected}
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-40"
                  >
                    {t.assign}
                  </button>
                  <button
                    onClick={() => {
                      setAssignMode(false);
                      setSelected("");
                    }}
                    className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    {t.cancel}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAssignMode(true)}
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  {t.assignProvider}
                </button>
              )
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function getInitials(name?: string | null) {
  if (!name) return "?";
  const n = name.trim().split(/\s+/);
  return (n[0]?.[0] ?? "").concat(n[1]?.[0] ?? "").toUpperCase();
}

function fullAddress(r: ServiceRequest, type: "user" | "provider" = "user") {
  const parts =
    type === "provider"
      ? [r.provider_address, r.provider_city]
      : [r.user_address, r.user_city];
  return parts.filter(Boolean).join(", ") || undefined;
}

function mapsHref(addr?: string) {
  return addr ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}` : undefined;
}
