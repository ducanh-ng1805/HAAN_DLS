-- Lets admins star a document to feature it in the homepage news section.

alter table documents add column featured boolean not null default false;
create index idx_documents_featured on documents (featured) where featured;
