-- Ensure RLS is on
alter table api.provider_services enable row level security;

-- Providers can read their own service associations
create policy "provider_services select own"
on api.provider_services
for select
to authenticated
using (provider_id = auth.uid());

-- Providers can add services for themselves
create policy "provider_services insert own"
on api.provider_services
for insert
to authenticated
with check (provider_id = auth.uid());

-- Providers can update their own service associations
create policy "provider_services update own"
on api.provider_services
for update
to authenticated
using (provider_id = auth.uid())
with check (provider_id = auth.uid());

-- Providers can remove their own service associations
create policy "provider_services delete own"
on api.provider_services
for delete
to authenticated
using (provider_id = auth.uid());
