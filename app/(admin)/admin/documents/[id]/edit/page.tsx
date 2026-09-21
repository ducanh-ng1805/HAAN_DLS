import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateDocument } from "@/app/actions/documents";
import { DocumentForm } from "../../document-form";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: categories }, { data: doc }] = await Promise.all([
    supabase.from("document_categories").select("id, label_vi").order("sort_order", { ascending: true }),
    supabase
      .from("documents")
      .select("id, title, document_number, category_id, signed_date, content, status")
      .eq("id", id)
      .maybeSingle(),
  ]);

  if (!doc) notFound();

  const boundAction = updateDocument.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Sửa tài liệu</h1>
      <div className="mt-6">
        <DocumentForm
          categories={categories ?? []}
          action={boundAction}
          defaultValues={doc}
          submitLabel="Cập nhật tài liệu"
        />
      </div>
    </div>
  );
}
