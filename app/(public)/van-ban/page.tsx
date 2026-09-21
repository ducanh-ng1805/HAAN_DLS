import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatVNDate, shouldShowUploadedDate } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Thông báo & văn bản",
};

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: activeCategory } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("document_categories")
    .select("id, slug, label_vi, sort_order")
    .order("sort_order", { ascending: true });

  let query = supabase
    .from("documents")
    .select(
      "id, title, document_number, signed_date, uploaded_date, document_categories(slug, label_vi)"
    )
    .eq("status", "published")
    .order("signed_date", { ascending: false });

  if (activeCategory) {
    const cat = categories?.find((c) => c.slug === activeCategory);
    if (cat) query = query.eq("category_id", cat.id);
  }

  const { data: documents } = await query;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Thông báo & văn bản</h1>
      <p className="mt-3 text-muted-foreground">
        Danh sách thông báo học phí, quyết định, quy chế và văn bản chính thức của trung tâm.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/van-ban"
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            !activeCategory
              ? "border-primary bg-primary text-primary-foreground"
              : "text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-primary"
          )}
        >
          Tất cả
        </Link>
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/van-ban?category=${cat.slug}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              activeCategory === cat.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-primary"
            )}
          >
            {cat.label_vi}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {documents && documents.length > 0 ? (
          documents.map((doc) => {
            const category = Array.isArray(doc.document_categories)
              ? doc.document_categories[0]
              : doc.document_categories;
            return (
              <Link key={doc.id} href={`/van-ban/${doc.id}`}>
                <Card className="transition-colors hover:border-primary/50">
                  <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                    <CardTitle className="text-base">{doc.title}</CardTitle>
                    {category ? (
                      <Badge variant="secondary" className="border-transparent bg-primary/10 text-primary">
                        {category.label_vi}
                      </Badge>
                    ) : null}
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {doc.document_number ? <span>Số: {doc.document_number} · </span> : null}
                    <span>Ngày ký: {formatVNDate(doc.signed_date)}</span>
                    {shouldShowUploadedDate(doc.signed_date, doc.uploaded_date) && (
                      <span> · Ngày đăng tải: {formatVNDate(doc.uploaded_date)}</span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có văn bản nào được đăng.</p>
        )}
      </div>
    </div>
  );
}
