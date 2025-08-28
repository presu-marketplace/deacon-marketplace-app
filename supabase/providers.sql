-- Ensure RLS is on
alter table api.providers enable row level security;

-- SELECT: providers can read their own row
create policy "providers select own"
on api.providers
for select
to authenticated
using (id = auth.uid());

-- INSERT: only the logged-in provider can create their own row,
-- and only if their profile role is 'provider'
create policy "providers insert self"
on api.providers
for insert
to authenticated
with check (
  id = auth.uid()
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
using (id = auth.uid())
with check (id = auth.uid());

-- DELETE: (optional) only delete own row
create policy "providers delete own"
on api.providers
for delete
to authenticated
using (id = auth.uid());
