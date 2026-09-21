import { createClient } from "@/lib/supabase/server";
import { createDocument } from "@/app/actions/documents";
import { DocumentForm } from "../document-form";

export default async function NewDocumentPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("document_categories")
    .select("id, label_vi")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Thêm tài liệu</h1>
      <div className="mt-6">
        <DocumentForm categories={categories ?? []} action={createDocument} submitLabel="Lưu tài liệu" />
      </div>
    </div>
  );
}
