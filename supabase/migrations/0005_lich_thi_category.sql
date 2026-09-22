-- New document category so staff can publish/update exam schedules
-- (lich thi bai sat hach) through the existing document admin panel,
-- reusing upload/publish/version flow instead of a bespoke feature.

insert into document_categories (slug, label_vi, sort_order) values
  ('lich-thi', 'Lịch thi', 0);
