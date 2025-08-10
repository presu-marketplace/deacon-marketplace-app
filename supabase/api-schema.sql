-- Schema for profiles, providers and service request workflow
create schema if not exists api;

-- User profiles
create table if not exists api.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role = any (array['client','provider','admin'])),
  created_at timestamp without time zone default now()
);

-- Provider details linked to profiles
create table if not exists api.providers (
  id uuid primary key references api.profiles(id) on delete cascade,
  company_name text,
  tax_id text,
  coverage_area text[]
);

-- Remove deprecated services array column if present
alter table api.providers drop column if exists services;

-- Join table linking providers to offered services
create table if not exists api.provider_services (
  provider_id uuid not null references api.providers(id) on delete cascade,
  service_slug text not null references reference.services(slug) on delete cascade,
  primary key (provider_id, service_slug)
);

-- Service requests placed by users
create table if not exists api.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references api.profiles(id) on delete set null,
  description text,
  location text,
  deadline date,
  attachments text[],
  created_at timestamptz default now()
);

-- Remove legacy category column if exists
alter table api.service_requests drop column if exists category;

-- Each requested service may be resolved by exactly one provider
create table if not exists api.service_request_services (
  request_id uuid not null references api.service_requests(id) on delete cascade,
  service_slug text not null references reference.services(slug) on delete cascade,
  provider_id uuid references api.providers(id) on delete set null,
  primary key (request_id, service_slug)
);
