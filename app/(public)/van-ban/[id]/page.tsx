import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatVNDate, shouldShowUploadedDate } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function getDocument(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select(
      "id, title, document_number, signed_date, uploaded_date, version, content, file_url, document_categories(label_vi)"
    )
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doc = await getDocument(id);
  return { title: doc?.title ?? "Văn bản" };
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getDocument(id);

  if (!doc) notFound();

  const category = Array.isArray(doc.document_categories)
    ? doc.document_categories[0]
    : doc.document_categories;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/van-ban" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Quay lại danh sách văn bản
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{doc.title}</h1>
        {category ? (
          <Badge variant="secondary" className="border-transparent bg-primary/10 text-primary">
            {category.label_vi}
          </Badge>
        ) : null}
      </div>

      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        {doc.document_number ? <p>Số văn bản: {doc.document_number}</p> : null}
        <p>Ngày ký: {formatVNDate(doc.signed_date)}</p>
        {shouldShowUploadedDate(doc.signed_date, doc.uploaded_date) && (
          <p>Ngày đăng tải: {formatVNDate(doc.uploaded_date)}</p>
        )}
        <p>Phiên bản: {doc.version}</p>
      </div>

      {doc.content ? (
        <div className="mt-6 whitespace-pre-line text-sm leading-relaxed">{doc.content}</div>
      ) : null}

      <Button
        className="mt-8"
        nativeButton={false}
        render={
          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
            Xem / tải file PDF
          </a>
        }
      />
    </div>
  );
}
