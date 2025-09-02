-- Schema for profiles, providers and service request workflow
create schema if not exists api;

-- Enum for service request workflow
create type if not exists public.request_status as enum ('open','assigned','pending','closed');

-- User profiles
create table if not exists api.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role = any (array['client','provider','admin'])),
  created_at timestamp without time zone default now(),
  phone text,
  address text,
  city text
);

-- Provider details linked to profiles
create table if not exists api.providers (
  user_id uuid primary key references api.profiles(id) on delete cascade,
  company_name text,
  tax_id text,
  coverage_area text[] default '{}'::text[],
  id uuid not null default gen_random_uuid()
);

create or replace function api.ensure_provider_role()
returns trigger as $$
declare
  pid uuid;
begin
  -- Provider id may live in different columns depending on the table
  pid := coalesce(new.provider_id, new.user_id);
  if pid is null then
    return new;
  end if;
  if exists (
    select 1 from api.profiles p where p.id = pid and p.role = 'provider'
  ) then
    return new;
  end if;
  raise exception 'profile % is not a provider', pid;
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
  provider_id uuid not null references api.providers(user_id) on delete cascade,
  service_id uuid not null references reference.services(id) on delete cascade,
  primary key (provider_id, service_id)
);


-- Service requests placed by users
create table if not exists api.service_requests (
  id uuid not null default gen_random_uuid(),
  user_id uuid null,
  service_id uuid null,
  provider_id uuid null,
  service_description text null,
  service_location text null,
  service_deadline date null,
  user_name text null,
  user_email text null,
  user_telephone text null,
  user_address text null,
  user_city text null,
  request_property_type text null,
  request_cleaning_type text null,
  request_cleaning_frequency text null,
  request_message text null,
  request_systems jsonb null default '[]'::jsonb,
  request_invoice_urls text[] null default array[]::text[],
  request_status public.request_status not null default 'open'::request_status,
  request_created_at timestamptz null default now(),
  provider_assigned_at timestamptz null,
  request_closed_at timestamptz null,
  request_updated_at timestamptz null,
  constraint service_requests_pkey primary key (id),
  constraint service_requests_provider_id_fkey foreign key (provider_id) references api.profiles(id) on delete set null,
  constraint service_requests_service_id_fkey foreign key (service_id) references reference.services(id) on delete set null,
  constraint service_requests_user_id_fkey foreign key (user_id) references api.profiles(id) on delete set null
);

create index if not exists idx_service_requests_user_id on api.service_requests using btree (user_id);
create index if not exists idx_service_requests_provider_id on api.service_requests using btree (provider_id);
create index if not exists idx_service_requests_service_id on api.service_requests using btree (service_id);

drop trigger if exists service_requests_set_timestamps on api.service_requests;
drop trigger if exists trg_service_requests_set_updated_at on api.service_requests;

create or replace function api.tg_sr_set_timestamps()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    new.request_created_at := coalesce(new.request_created_at, now());
  end if;
  new.request_updated_at := now();
  return new;
end;
$$ language plpgsql;

create or replace function api.set_updated_at()
returns trigger as $$
begin
  new.request_updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger service_requests_set_timestamps
  before insert or update on api.service_requests
  for each row execute function api.tg_sr_set_timestamps();

create trigger trg_service_requests_set_updated_at
  before update on api.service_requests
  for each row execute function api.set_updated_at();

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

create trigger service_requests_provider_role_check
  before insert or update of provider_id on api.service_requests
  for each row execute function api.ensure_provider_role();

-- Remove legacy category column if exists
alter table api.service_requests drop column if exists category;

-- Link each service request to a provider offer
create table if not exists api.service_request_services (
  request_id uuid not null references api.service_requests(id) on delete cascade,
  provider_id uuid references api.providers(user_id) on delete set null,
  primary key (request_id)
);

-- Grant API schema privileges to service_role
grant usage on schema api to service_role;
grant all on api.profiles to service_role;
grant all on api.providers to service_role;
grant all on api.provider_services to service_role;
grant all on api.service_requests to service_role;
grant all on api.service_request_services to service_role;
