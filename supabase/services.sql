-- Create schema for reference data if it doesn't exist
create schema if not exists reference;

-- Services table storing catalog information
create table if not exists reference.services (
  slug text primary key,
  name_es text,
  name_en text,
  rating numeric,
  schedule text,
  image_url text
);

-- Insert initial service records
insert into reference.services (slug, name_es, name_en, rating, image_url) values
  ('seguridad', 'Seguridad privada', 'Private Security', 4.8, '/images/services/security.jpg'),
  ('limpieza', 'Limpieza Profesional', 'Professional Cleaning', 4.7, '/images/services/cleaning.jpg'),
  ('fumigacion', 'Fumigación a domicilio', 'Home Fumigation', 4.6, '/images/services/fumigation.jpg'),
  ('mantenimiento-ascensores', 'Mantenimiento de ascensores', 'Elevator Maintenance', 4.5, '/images/services/elevator_maintenance.jpg'),
  ('escribania', 'Escribanía', 'Notary Services', 4.7, '/images/services/notary.jpg'),
  ('community-manager', 'Community Manager', 'Community Manager', 4.5, '/images/services/community.jpg'),
  ('traslados-ejecutivos', 'Traslados Ejecutivos', 'Executive Transfers', 4.8, '/images/services/transfer.jpg'),
  ('salones-infantiles', 'Salones Infantiles', 'Kids Party Venues', 4.6, '/images/services/kids-party.jpg')
  on conflict (slug) do update set
    name_es = excluded.name_es,
    name_en = excluded.name_en,
    rating = excluded.rating,
    image_url = excluded.image_url;

-- Exposed view in the api schema
create schema if not exists api;
create or replace view api.services as
  select slug, name_es, name_en, rating, schedule, image_url
  from reference.services;

-- Allow read access to the view for anonymous and authenticated users
grant usage on schema api to anon, authenticated;
grant select on api.services to anon, authenticated;
