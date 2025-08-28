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

create or replace function api.ensure_provider_role()
returns trigger as $$
begin
  if exists (
    select 1 from api.profiles p where p.id = new.id and p.role = 'provider'
  ) then
    return new;
  end if;
  raise exception 'profile % is not a provider', new.id;
end;
$$ language plpgsql;

drop trigger if exists providers_role_check on api.providers;
create trigger providers_role_check
  before insert or update on api.providers
  for each row execute function api.ensure_provider_role();

-- Remove deprecated services array column if present
alter table api.providers drop column if exists services;

-- Join table linking providers to offered services
create table if not exists api.provider_services (
  provider_id uuid not null references api.providers(id) on delete cascade,
  service_id uuid not null references reference.services(id) on delete cascade,
  primary key (provider_id, service_id)
);

-- Service requests placed by users
create table if not exists api.service_requests (
  user_id uuid references api.profiles(id) on delete set null,
  service_id uuid references reference.services(id) on delete set null,
  provider_id uuid references api.profiles(id) on delete set null,
  id uuid not null default gen_random_uuid(),
  service_description text,
  service_location text,
  service_deadline date,
  user_name text,
  user_email text,
  user_telephone text,
  user_address text,
  user_city text,
  request_property_type text,
  request_cleaning_type text,
  request_cleaning_frequency text,
  request_message text,
  provider_assigned_at timestamptz,
  request_closed_at timestamptz,
  request_updated_at timestamptz,
  request_systems jsonb default '[]'::jsonb,
  request_invoice_urls text[] default array[]::text[],
  request_status request_status not null default 'open'::request_status,
  request_created_at timestamptz default now(),
  constraint service_requests_pkey primary key (id)
);

-- automatically track updates
create extension if not exists moddatetime schema extensions;
drop trigger if exists handle_updated_at on api.service_requests;
drop trigger if exists set_updated_at on api.service_requests;
create trigger set_request_updated_at
  before insert or update on api.service_requests
  for each row execute procedure moddatetime(request_updated_at);

-- Ensure service requests come only from client profiles
create function if not exists api.ensure_client_role()
returns trigger as $$
begin
  if new.user_id is null then
    return new;
  end if;
  if exists (
    select 1 from api.profiles p where p.id = new.user_id and p.role = 'client'
  ) then
    return new;
  end if;
  raise exception 'profile % is not a client', new.user_id;
end;
$$ language plpgsql;

create trigger service_requests_role_check
  before insert or update on api.service_requests
  for each row execute function api.ensure_client_role();

-- Remove legacy category column if exists
alter table api.service_requests drop column if exists category;

-- Each requested service may be resolved by exactly one provider
create table if not exists api.service_request_services (
  request_id uuid not null references api.service_requests(id) on delete cascade,
  service_id uuid not null references reference.services(id) on delete cascade,
  provider_id uuid references api.providers(id) on delete set null,
  primary key (request_id, service_id)
);

-- Grant API schema privileges to service_role
grant usage on schema api to service_role;
grant all on api.profiles to service_role;
grant all on api.providers to service_role;
grant all on api.provider_services to service_role;
grant all on api.service_requests to service_role;
grant all on api.service_request_services to service_role;
