-- Two staff roles:
--   super_admin: can manage documents AND the staff list itself
--   editor:      can manage documents only, cannot touch the staff list
--
-- is_super_admin() is SECURITY DEFINER for the same reason as is_staff() in
-- 0002 — lets the staff table's own RLS policies check role without
-- recursing into themselves.

create type staff_role as enum ('super_admin', 'editor');

alter table staff add column role staff_role not null default 'editor';

update staff set role = 'super_admin' where email = 'anhnd@haancorp.com';

create or replace function is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from staff where email = auth.email() and role = 'super_admin');
$$;

-- Only super_admins may see or change the staff list. (Document/category/
-- storage policies from 0002 stay on is_staff() — any role can edit docs.)
drop policy "staff_read" on staff;
create policy "staff_read"
on staff for select
to authenticated
using (is_super_admin());

drop policy "staff_write" on staff;
create policy "staff_write"
on staff for all
to authenticated
using (is_super_admin())
with check (is_super_admin());
