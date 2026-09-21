-- Staff allowlist: membership here (not just having a Supabase Auth
-- account) determines admin write access to documents/categories/storage.
--
-- is_staff() is SECURITY DEFINER so the staff table's own RLS policies can
-- check membership without recursing into themselves (a self-referencing
-- policy on `staff` would otherwise trigger "infinite recursion detected
-- in policy for relation staff").

create table staff (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create or replace function is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from staff where email = auth.email());
$$;

alter table staff enable row level security;

create policy "staff_read"
on staff for select
to authenticated
using (is_staff());

create policy "staff_write"
on staff for all
to authenticated
using (is_staff())
with check (is_staff());

-- Tighten "any authenticated user" policies from 0001_init.sql to the
-- allowlist.
drop policy "staff_full_access" on documents;
create policy "staff_full_access"
on documents for all
to authenticated
using (is_staff())
with check (is_staff());

drop policy "categories_staff_write" on document_categories;
create policy "categories_staff_write"
on document_categories for all
to authenticated
using (is_staff())
with check (is_staff());

drop policy "documents_bucket_staff_write" on storage.objects;
create policy "documents_bucket_staff_write"
on storage.objects for insert
to authenticated
with check (bucket_id = 'documents' and is_staff());

drop policy "documents_bucket_staff_update" on storage.objects;
create policy "documents_bucket_staff_update"
on storage.objects for update
to authenticated
using (bucket_id = 'documents' and is_staff());

drop policy "documents_bucket_staff_delete" on storage.objects;
create policy "documents_bucket_staff_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'documents' and is_staff());

-- Seed the first admin so the allowlist isn't empty after this migration.
-- This account must also exist in Supabase Auth (Authentication > Users)
-- for login to work.
insert into staff (email) values ('anhnd@haancorp.com');
