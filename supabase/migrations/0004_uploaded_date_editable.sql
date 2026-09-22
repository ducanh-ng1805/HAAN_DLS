-- uploaded_date used to be forced back to its old value on every update
-- (see 0001_init.sql). The admin UI now lets staff deliberately correct it
-- next to signed_date, so drop that lock the same way signed_date's system
-- re-derivation is already excluded from update-time enforcement.

create or replace function documents_before_update()
returns trigger language plpgsql as $$
begin
  if new.file_url is distinct from old.file_url then
    new.version := old.version + 1;
  end if;

  new.updated_at := now();
  return new;
end;
$$;
