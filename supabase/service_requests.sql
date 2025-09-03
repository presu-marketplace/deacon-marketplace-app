-- Ensure RLS is on
alter table api.service_requests enable row level security;

-- Allow authenticated users to work with their service requests
grant usage on schema api to authenticated;
grant select, insert, update, delete on api.service_requests to authenticated;

create policy "Clients can view their own service requests" on api.service_requests
for select to authenticated using (user_id = auth.uid());

-- Providers can view assigned requests
create policy "Providers can view assigned service requests" on api.service_requests
for select to authenticated using (provider_id = auth.uid());

-- Admins can view all requests
create policy "Admins can view all service requests" on api.service_requests
for select to authenticated using (
  exists (
    select 1 from api.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Clients can create their own requests
create policy "Clients can insert their own service requests" on api.service_requests
for insert to authenticated with check (user_id = auth.uid());

-- Allow updates by owner, assigned provider, or admin
create policy "Clients, assigned providers, or admins can update service requests" on api.service_requests
for update to authenticated using (
  user_id = auth.uid()
  or provider_id = auth.uid()
  or exists (
    select 1 from api.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
) with check (
  user_id = auth.uid()
  or provider_id = auth.uid()
  or exists (
    select 1 from api.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Admins can delete requests
create policy "Admins can delete service requests" on api.service_requests
for delete to authenticated using (
  exists (
    select 1 from api.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
);
