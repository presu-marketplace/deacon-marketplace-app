-- Ensure RLS is on
alter table api.service_request_services enable row level security;

-- Allow authenticated users to interact with service_request_services
grant usage on schema api to authenticated;
grant select, insert, update, delete on api.service_request_services to authenticated;

-- Clients can view associations for their own requests
create policy "service_request_services select own" on api.service_request_services
for select to authenticated
using (
  exists (
    select 1 from api.service_requests r
    where r.id = service_request_services.request_id
      and r.user_id = auth.uid()
  )
);

-- Providers can view associations assigned to them
create policy "service_request_services select assigned" on api.service_request_services
for select to authenticated
using (provider_id = auth.uid());

-- Admins can view all associations
create policy "service_request_services select all" on api.service_request_services
for select to authenticated
using (
  exists (
    select 1 from api.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Admins can insert associations
create policy "service_request_services insert admin" on api.service_request_services
for insert to authenticated
with check (
  exists (
    select 1 from api.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Admins can update associations
create policy "service_request_services update admin" on api.service_request_services
for update to authenticated
using (
  exists (
    select 1 from api.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from api.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Admins can delete associations
create policy "service_request_services delete admin" on api.service_request_services
for delete to authenticated
using (
  exists (
    select 1 from api.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
);
