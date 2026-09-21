-- HAAN DLS: documents/notices schema
-- Enforces: signedDate defaults to uploadedDate on insert (never guessed otherwise),
-- uploadedDate is immutable, version auto-increments when the file changes.

create extension if not exists "pgcrypto";

create type document_status as enum ('draft', 'published');

create table document_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label_vi text not null,
  sort_order int not null default 0
);

insert into document_categories (slug, label_vi, sort_order) values
  ('thong-bao', 'Thông báo', 1),
  ('quyet-dinh', 'Quyết định', 2),
  ('quy-che-tuyen-sinh', 'Quy chế tuyển sinh', 3),
  ('quy-che-dao-tao', 'Quy chế đào tạo', 4),
  ('van-ban-phap-ly', 'Văn bản pháp lý', 5),
  ('thong-bao-trung-tam', 'Thông báo trung tâm', 6);

create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  document_number text,
  category_id uuid not null references document_categories(id),
  signed_date date,
  uploaded_date date not null default ((now() at time zone 'Asia/Ho_Chi_Minh')::date),
  version integer not null default 1,
  status document_status not null default 'draft',
  file_url text not null,
  content text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_documents_status_signed_date on documents (status, signed_date desc);
create index idx_documents_category on documents (category_id);

-- Default signedDate = uploadedDate on insert when not provided.
-- A DB trigger (not app code) so the rule holds for every entry point:
-- admin UI, the one-off import script, or manual edits in Supabase Studio.
create or replace function documents_before_insert()
returns trigger language plpgsql as $$
begin
  if new.signed_date is null then
    new.signed_date := new.uploaded_date;
  end if;
  return new;
end;
$$;

create trigger trg_documents_before_insert
before insert on documents
for each row execute function documents_before_insert();

-- uploaded_date is immutable after creation. version bumps only when the
-- underlying file is actually replaced. signed_date is left alone on update:
-- the "never silently changed" rule is about the system re-deriving it, not
-- about forbidding an admin's deliberate edit in the edit form.
create or replace function documents_before_update()
returns trigger language plpgsql as $$
begin
  new.uploaded_date := old.uploaded_date;

  if new.file_url is distinct from old.file_url then
    new.version := old.version + 1;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_documents_before_update
before update on documents
for each row execute function documents_before_update();

-- RLS
alter table documents enable row level security;

create policy "public_read_published"
on documents for select
to anon, authenticated
using (status = 'published');

create policy "staff_full_access"
on documents for all
to authenticated
using (true)
with check (true);

alter table document_categories enable row level security;

create policy "categories_public_read"
on document_categories for select
to anon, authenticated
using (true);

create policy "categories_staff_write"
on document_categories for all
to authenticated
using (true)
with check (true);

-- Storage: public bucket for document PDFs, staff-only writes.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

create policy "documents_bucket_staff_write"
on storage.objects for insert
to authenticated
with check (bucket_id = 'documents');

create policy "documents_bucket_staff_update"
on storage.objects for update
to authenticated
using (bucket_id = 'documents');

create policy "documents_bucket_staff_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'documents');

create policy "documents_bucket_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'documents');
