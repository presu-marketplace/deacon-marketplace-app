-- Ensure RLS is on
alter table api.providers enable row level security;

-- Allow authenticated users to work with their provider record
grant usage on schema api to authenticated;
grant select, insert, update, delete on api.providers to authenticated;

-- SELECT: providers can read their own row
create policy "providers select own"
on api.providers
for select
to authenticated
using (user_id = auth.uid());

-- INSERT: only the logged-in provider can create their own row,
-- and only if their profile role is 'provider'
create policy "providers insert self"
on api.providers
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from api.profiles p
    where p.id = auth.uid() and p.role = 'provider'
  )
);

-- UPDATE: can only modify their own row
create policy "providers update own"
on api.providers
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- DELETE: (optional) only delete own row
create policy "providers delete own"
on api.providers
for delete
to authenticated
using (user_id = auth.uid());
