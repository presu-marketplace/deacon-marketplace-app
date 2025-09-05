-- Create schema for reference data if it doesn't exist
create schema if not exists reference;

-- Services table storing catalog information
create table if not exists reference.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name_es text,
  name_en text,
  rating numeric,
  base_providers integer default 0,
  schedule text,
  image_url text
);

-- Insert initial service records with ratings and base provider counts
insert into reference.services (slug, name_es, name_en, rating, base_providers, image_url) values
  ('security', 'Seguridad privada', 'Private Security', 4.8, 10, '/images/services/security.jpg'),
  ('cleaning', 'Limpieza Profesional', 'Professional Cleaning', 4.7, 7, '/images/services/cleaning.jpg'),
  ('fumigation', 'Fumigación a domicilio', 'Home Fumigation', 4.6, 0, '/images/services/fumigation.jpg'),
  ('elevator-maintenance', 'Mantenimiento de ascensores', 'Elevator Maintenance', 4.5, 0, '/images/services/elevator_maintenance.jpg'),
  ('notary', 'Escribanía', 'Notary Services', 4.7, 0, '/images/services/notary.jpg'),
  ('community-manager', 'Community Manager', 'Community Manager', 4.5, 0, '/images/services/community.jpg'),
  ('transfers', 'Traslados Ejecutivos', 'Executive Transfers', 4.8, 0, '/images/services/transfer.jpg'),
  ('kids-party-venues', 'Salones Infantiles', 'Kids Party Venues', 4.6, 0, '/images/services/kids-party.jpg')
on conflict (slug) do update set
  name_es = excluded.name_es,
  name_en = excluded.name_en,
  rating = excluded.rating,
  base_providers = excluded.base_providers,
  image_url = excluded.image_url;

-- Exposed view in the api schema
create schema if not exists api;
create or replace view api.services as
  select
    s.id,
    s.slug,
    s.name_en,
    s.name_es,
    s.rating,
    s.base_providers + coalesce(count(ps.provider_id), 0) as provider_count,
    s.schedule,
    s.image_url
  from reference.services s
  left join api.provider_services ps on ps.service_id = s.id
  group by s.id, s.slug, s.name_en, s.name_es, s.rating, s.base_providers, s.schedule, s.image_url;

-- Allow read access to the view for anonymous and authenticated users
grant usage on schema api to anon, authenticated, service_role;
grant select on api.services to anon, authenticated, service_role;

